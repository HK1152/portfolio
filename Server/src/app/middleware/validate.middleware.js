const ApiError = require('../utils/apiError');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(ApiError.badRequest(errorMessage));
  }
  next();
};

module.exports = validate;
