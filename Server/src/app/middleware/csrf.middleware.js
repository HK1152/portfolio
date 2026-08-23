const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');

// Middleware to generate and set CSRF token
exports.csrfProtection = catchAsync(async (req, res, next) => {
  // Methods that don't change state
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

  if (safeMethods.includes(req.method)) {
    // Generate a new token if one doesn't exist in cookies
    let token = req.cookies.xsrfToken;
    if (!token) {
      token = crypto.randomBytes(32).toString('hex');
      res.cookie('xsrfToken', token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        // Note: CSRF token MUST NOT be httpOnly so frontend can read it and send it in header
        httpOnly: false,
      });
    }
    return next();
  }

  // Temporarily bypass CSRF for cross-domain deployments where frontend cannot read the backend cookie
  // const tokenFromCookie = req.cookies.xsrfToken;
  // const tokenFromHeader = req.headers['x-xsrf-token'];
  // 
  // if (!tokenFromCookie || !tokenFromHeader || tokenFromCookie !== tokenFromHeader) {
  //   return next(ApiError.forbidden('Invalid CSRF token'));
  // }

  next();
});
