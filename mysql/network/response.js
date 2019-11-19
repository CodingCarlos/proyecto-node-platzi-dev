const statusMessages = {
    '200': 'Done',
    '201': 'Created',
    '400': 'Invalid format',
    '404': 'Resource not found',
    '500': 'Internal error'
}

exports.success = function (req, res, message, status) {
    let statusCode = status;
    let statusMessage = message;
    
    if (!status) {
        status = 200;
    }

    if (!message) {
        statusMessage = statusMessages[status];
    }

    res.status(statusCode).send({ 
        error: false,
        status: statusCode,
        body: statusMessage,
    });
}

exports.error = function (req, res, message, status, details) {
    res.status(status || 500).send({ 
        error: true,
        message: message,
        status: status || 500,
        body: '',
    });
}