const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');
const User = require('../modules/auth/auth.model');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(ApiError.unauthorized('Not authorized to access this route'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
        return next(ApiError.unauthorized('Not authorized to access this route - user not found'));
    }
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(ApiError.forbidden('User role is not authorized to access this route'));
    }

    next();
  } catch (err) {
    return next(ApiError.unauthorized('Not authorized to access this route - token failed'));
  }
});
