const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');
const prisma = require('../config/prismaClient');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(ApiError.unauthorized('Not authorized to access this route'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    req.user = await prisma.user.findUnique({
      where: { id: parseInt(decoded.id) },
      select: {
        id: true,
        adminId: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
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
