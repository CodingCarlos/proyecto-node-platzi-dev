const fs = require('fs');
const multer = require('multer');
const nanoid = require('nanoid');
const imageType = require('image-type');
const sharp = require('sharp');

const response = require('../network/response');

const extensions = ['png', 'jpg', 'jpeg', 'gif'];

const storage = multer.memoryStorage({});
const upload = multer({
	storage,
	fileFilter: function (req, file, callback) {
		let ext = file.originalname.split('.');
		ext = ext[ext.length - 1].toLowerCase();

		if (extensions.indexOf(ext) === -1) {
			return callback(new Error('Only images are allowed'));
		}

		callback(null, true);
	},
	// limits: {
	// 	fileSize: 1024 * 1024,
	// },
});

/**	[internal] saveLocalFile
 *	Save a image from buffer to disk.
 *
 *	@param data {buffer} Image content buffer
 *	@param name {string} Name for the file to store
 *	@return {promise} A promise that resolves with the saved image path;
 */
function saveLocalFile(data, name) {
	let path = 'uploads/' + name;

	return new Promise((resolve, reject) => {
		fs.open(path, 'w', function(err, fd) {  
		    if (err) {
		        const error = 'Could not open file';
		        console.error(error);
		        console.error(err);
		        return Promise.reject(error);
		    }

		    // Write the contents of the buffer, from position 0 to the end, to
		    // the file descriptor returned in opening our file,
		    fs.write(fd, data, 0, data.length, null, function(err) {
		        if (err) {
		        	const error = 'Error writing file'
		        	console.error(error);
		        	console.error(err);
		        	return Promise.reject(error);
		        }

		        fs.close(fd, function() {
		            console.log('wrote the file successfully');
		            console.log(path);
					resolve(path);
		        });
		    });
		});
	});
}

/**	[internal] saveImage
 *	Save a image from buffer to requested location.
 *
 *	@param data {buffer} Image content buffer
 *	@param name {string} Name for the file to store
 *	@param location {string} (optional) Place to store file
 *	@param metadata {object} (optional) File metadata (ext, mime...)
 *	@return {promise} A promise that resolves with the saved image URI;
 */
function saveImage(data, name, location, metadata) {
	if (!data || !(data instanceof Buffer)) {
		const err = 'Invalid data provided. Expected buffer, but came ' + typeof data;
		// console.error('Invalid data provided. Expected buffer, but came ' + typeof data)
		return Promise.reject(err);
	}

	switch (location) {
		case 'file':
		default:
			return saveLocalFile(data, name);
	}
}

/** uploadFile
 *	Load a file from express upload, given its param name. Return an express
 *	middleware, so it perfectly fits into any express app.
 *
 *	Usage example:
 *	router.post('/route', upload('picture', 'gcstorage'), handler);
 *	router.post('/route', upload(), handler); // Will expect a "file" field
 *
 *	@param fieldname {string} Name of the req.body field that contains the file
 *	@param location {string} (optional) Name of the req.body field that contains the file
 *	@return {function} A function to act as express middleware to upload a file
 */
function uploadFile(fieldname, location) {
	const field = fieldname || 'file';

	/** middleware
	 *	Express middleware to upload a file
	 */
	function middleware(req, res, next) {
		upload.single(field)(req, res, async function (err) {
			if (err) {
				console.error('Error!')
				console.error(err);
				return response.error(req, res, 400, 'Invalid file');
			}

			// Only act if file
			if (!req.file) {
				return next();
			}

			// Transform image
			const transformedFile = await sharp(req.file.buffer)
				.resize(400, 400)
				.png()
				.toBuffer();

			// Check image type
			const imgData = imageType(transformedFile);
			if (!imgData || extensions.indexOf(imgData.ext) === -1) {
				return response.error(req, res, 400, 'Invalid file');
			}

			// Generate a random file name
			const filename = nanoid();
			
			// Store image
			saveImage(transformedFile, filename + '.' + imgData.ext, location, imgData)
				.then((path) => {
					req.file.path = path;
					return next();
				})
				.catch(e => {
					console.error('Error writting file:');
					console.error(e);
					return response.error(req, res, 400, 'Invalid file');
				});
		});
	}

	return middleware;
}


module.exports = uploadFile;
