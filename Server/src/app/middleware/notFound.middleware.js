const ApiError = require('../utils/apiError');

const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.originalUrl}`));
};

module.exports = notFoundHandler;
