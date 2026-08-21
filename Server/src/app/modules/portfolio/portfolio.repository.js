const Portfolio = require('./portfolio.model');

/**
 * Portfolio Repository - strictly handles DB interactions
 */
class PortfolioRepository {
  async getLatestPortfolio() {
    return await Portfolio.findOne().lean();
  }

  async createOrUpdatePortfolio(data) {
    const existing = await Portfolio.findOne();
    if (existing) {
      return await Portfolio.findByIdAndUpdate(existing._id, data, { new: true, runValidators: true });
    }
    return await Portfolio.create(data);
  }
}

module.exports = new PortfolioRepository();
