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

  async getDashboardData() {
    const portfolio = await portfolioRepository.getDashboard();
    if (!portfolio) {
      throw ApiError.notFound('Portfolio details not found in database');
    }
    return portfolio;
  }

  async updateDashboardData(data) {
    if (!data) {
      throw ApiError.badRequest('Dashboard data payload is required');
    }
    return await portfolioRepository.updateDashboard(data);
  }

  async getContactData() {
    const portfolio = await portfolioRepository.getContact();
    if (!portfolio) {
      throw ApiError.notFound('Portfolio details not found in database');
    }
    return portfolio;
  }

  async updateContactData(data) {
    if (!data) {
      throw ApiError.badRequest('Contact data payload is required');
    }
    return await portfolioRepository.updateContact(data);
  }

  async getAboutData() {
    const portfolio = await portfolioRepository.getAbout();
    if (!portfolio) {
      throw ApiError.notFound('Portfolio details not found in database');
    }
    return portfolio;
  }

  async updateAboutData(data) {
    if (!data) {
      throw ApiError.badRequest('About data payload is required');
    }
    return await portfolioRepository.updateAbout(data);
  }
  async getSkillsData() {
    const portfolio = await portfolioRepository.getSkills();
    if (!portfolio) {
      throw ApiError.notFound('Portfolio details not found in database');
    }
    return portfolio;
  }

  async updateSkillsData(data) {
    if (!data) {
      throw ApiError.badRequest('Skills data payload is required');
    }
    return await portfolioRepository.updateSkills(data);
  }

  async getExperienceData() {
    const portfolio = await portfolioRepository.getExperience();
    if (!portfolio) {
      throw ApiError.notFound('Portfolio details not found in database');
    }
    return portfolio;
  }

  async updateExperienceData(data) {
    if (!data) {
      throw ApiError.badRequest('Experience data payload is required');
    }
    return await portfolioRepository.updateExperience(data);
  }

  async getProjectsData() {
    const portfolio = await portfolioRepository.getProjects();
    if (!portfolio) {
      throw ApiError.notFound('Portfolio details not found in database');
    }
    return portfolio;
  }

  async updateProjectsData(data) {
    if (!data) {
      throw ApiError.badRequest('Projects data payload is required');
    }
    return await portfolioRepository.updateProjects(data);
  }
}

module.exports = new PortfolioService();
