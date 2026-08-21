const portfolioRepository = require('./portfolio.repository');
const ApiError = require('../../utils/apiError');

/**
 * Portfolio Service - business logic layer
 */
class PortfolioService {
  async getPortfolioData() {
    const portfolio = await portfolioRepository.getLatestPortfolio();
    if (!portfolio) {
      throw ApiError.notFound('Portfolio details not found in database');
    }
    return portfolio;
  }

  async updatePortfolioData(data) {
    if (!data) {
      throw ApiError.badRequest('Portfolio data payload is required');
    }
    return await portfolioRepository.createOrUpdatePortfolio(data);
  }
}

module.exports = new PortfolioService();
