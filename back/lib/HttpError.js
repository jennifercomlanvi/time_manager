class HttpError extends Error {

    constructor(status, error, errors) {
        super(error);
        this.status = status;
        this.error = error;
        this.errors = errors;
    }
}

module.exports = HttpError;
