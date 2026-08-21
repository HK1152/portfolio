const ApiError = require('../../utils/apiError');

/**
 * Validates Contact form input
 */
const validateContactInput = (req, res, next) => {
  const { name, email, message } = req.body;

  const errors = [];
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Name is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required');
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    errors.push('Message cannot be empty');
  }

  if (errors.length > 0) {
    throw ApiError.badRequest('Validation Error', errors);
  }

  next();
};

module.exports = {
  validateContactInput,
};
