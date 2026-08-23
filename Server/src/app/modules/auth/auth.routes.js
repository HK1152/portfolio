const express = require('express');
const authController = require('./auth.controller');
const { protect } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');
const { loginSchema } = require('../../validators/auth.validator');
const { authLimiter } = require('../../middleware/rateLimiter.middleware');

const router = express.Router();

router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);

module.exports = router;
