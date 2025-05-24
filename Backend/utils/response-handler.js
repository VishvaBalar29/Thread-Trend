const sendResponse = (res, statusCode, data = {}, message = "") => {
  return res.status(statusCode).json({
    msg: message,
    data: data  // all your key-value pairs inside `data`
  });
};

module.exports = sendResponse;