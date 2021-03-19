const sendError = async function (message, errCode, next) {
    let err = new Error(message);
    err.status = errCode;
    next(err);
};

const sendResponse = async function (message, status, res) {
    res.status(status).json({
        message: message,
    })
}

module.exports = { sendResponse, sendError }; // Exports all models