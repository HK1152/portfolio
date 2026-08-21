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

const updatePortfolio = async (req, res) => {
  try {
    const allowedFields = [
      'personalInfo',
      'education',
      'experience',
      'skills',
      'projects',
      'extraActivities',
      'socialLinks',
    ];

    const updates = allowedFields.reduce((acc, field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        acc[field] = req.body[field];
      }
      return acc;
    }, {});

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid portfolio fields provided' });
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { $set: updates },
      { new: true, runValidators: true, upsert: true }
    );

    res.json({ message: 'Portfolio updated successfully', portfolio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getPortfolio,
  updatePortfolio,
};
