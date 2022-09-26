exports.successResponse = async (res, statusCode = 200, message, data = []) => {
    res.status(statusCode).send({
        status: 1,
        statusCode: statusCode,
        message: message,
        data: data
    })
}

exports.errorResponse = async (res, statusCode = 500, message, data = []) => {
    res.status(statusCode).send({
        status: 0,
        statusCode: statusCode,
        message: message,
        data: data
    })
}   