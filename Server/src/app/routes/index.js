const express = require('express');
const router = express.Router();

const portfolioRoutes = require('../modules/portfolio/portfolio.routes');
const contactRoutes = require('../modules/contact/contact.routes');
const authRoutes = require('../modules/auth/auth.routes');

// Healthcheck Route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio Backend Service is operational',
    timestamp: new Date().toISOString(),
  });
});

// Modular Routes
router.use('/auth', authRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/contact', contactRoutes);

module.exports = router;
