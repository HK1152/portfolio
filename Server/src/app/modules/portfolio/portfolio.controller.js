const portfolioService = require('./portfolio.service');
const ApiResponse = require('../../utils/apiResponse');
const asyncHandler = require('../../utils/asyncHandler');

/**
 * @desc    Get portfolio data
 * @route   GET /api/portfolio
 * @access  Public
 */
const getPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await portfolioService.getPortfolioData();
  return ApiResponse.success(res, portfolio, 'Portfolio data retrieved successfully');
});

/**
 * @desc    Update portfolio data
 * @route   PUT /api/portfolio
 * @access  Private (Admin)
 */
const updatePortfolio = asyncHandler(async (req, res) => {
  const updated = await portfolioService.updatePortfolioData(req.body);
  return ApiResponse.success(res, updated, 'Portfolio updated successfully');
});

module.exports = {
  getPortfolio,
  updatePortfolio,
};
