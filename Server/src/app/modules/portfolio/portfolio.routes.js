const express = require('express');
const router = express.Router();
const { getPortfolio, updatePortfolio } = require('./portfolio.controller');
const { protect } = require('../../middleware/auth.middleware');

router.get('/', getPortfolio);
router.put('/', protect, updatePortfolio);

module.exports = router;
