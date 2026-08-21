const express = require('express');
const router = express.Router();
const { getPortfolio, updatePortfolio } = require('./portfolio.controller');
const requireAdmin = require('../../middleware/requireAdmin.middleware');

router.get('/', getPortfolio);
router.put('/', requireAdmin, updatePortfolio);

module.exports = router;
