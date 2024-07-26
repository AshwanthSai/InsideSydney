/* class HttpError extends Error {
    constructor(message, errorCode) {
        super(message)
        this.code = errorCode
    }
}

exports.HttpError = HttpError; */

class HttpError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.code = errorCode;
    }
}

exports.HttpError = HttpError; 


