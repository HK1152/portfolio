const Portfolio = require('../models/Portfolio');

// @desc    Get portfolio data
// @route   GET /api/portfolio
// @access  Public
const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne(); // Assuming we only have one portfolio document
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getPortfolio,
};
