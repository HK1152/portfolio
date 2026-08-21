const ApiError = require('../utils/apiError');
const env = require('../config/env.config');

const ADMIN_HEADER = 'x-admin-key';

const requireAdmin = (req, res, next) => {
  const configuredKey = env.ADMIN_KEY?.trim();

  if (!configuredKey) {
    throw ApiError.internal('Server ADMIN_KEY is missing. Please configure ADMIN_KEY in Server/.env.');
  }

  const providedKey = req.headers[ADMIN_HEADER]?.trim();

  if (!providedKey) {
    throw ApiError.unauthorized('Admin Key Required in header (x-admin-key)');
  }

  if (providedKey !== configuredKey) {
    throw ApiError.unauthorized('Invalid Admin Key provided');
  }

  next();
};

module.exports = requireAdmin;
