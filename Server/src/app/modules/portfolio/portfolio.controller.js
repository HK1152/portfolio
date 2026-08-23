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

const uploadCV = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.error(res, 'No file uploaded', 400);
  }

  // File path to save in the database
  const cvUrl = `/uploads/cv/${req.file.filename}`;

  // Get current portfolio to find the old CV URL
  let portfolio;
  try {
    portfolio = await portfolioService.getPortfolioData();
  } catch (err) {
    // Portfolio might not exist yet
  }

  if (portfolio && portfolio.personalInfo && portfolio.personalInfo.cvUrl) {
    const oldCvUrl = portfolio.personalInfo.cvUrl;
    // Only attempt to delete if it's a local file stored in /uploads
    if (oldCvUrl.startsWith('/uploads/cv/')) {
      const fs = require('fs');
      const path = require('path');
      const oldFilePath = path.join(__dirname, '../../../../public', oldCvUrl);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (unlinkErr) {
          console.error('Failed to delete old CV file:', unlinkErr);
        }
      }
    }
  }

  // Instead of just updating cvUrl in the database partially, we can just return the URL 
  // and let the frontend update the portfolio with the entire payload to maintain single source of truth.
  // Wait, the user said "db me har bar new dalu to old wala remove hoke ... new aa jana chaiae".
  // If we just return the URL, the frontend handles calling updatePortfolio().

  return ApiResponse.success(res, { cvUrl }, 'CV uploaded successfully');
});

const getDashboard = asyncHandler(async (req, res) => {
  const data = await portfolioService.getDashboardData();
  return ApiResponse.success(res, data, 'Dashboard data retrieved successfully');
});

const updateDashboard = asyncHandler(async (req, res) => {
  const updated = await portfolioService.updateDashboardData(req.body);
  return ApiResponse.success(res, updated, 'Dashboard updated successfully');
});

const getAbout = asyncHandler(async (req, res) => {
  const data = await portfolioService.getAboutData();
  return ApiResponse.success(res, data, 'About data retrieved successfully');
});

const updateAbout = asyncHandler(async (req, res) => {
  const updated = await portfolioService.updateAboutData(req.body);
  return ApiResponse.success(res, updated, 'About updated successfully');
});

const getSkills = asyncHandler(async (req, res) => {
  const data = await portfolioService.getSkillsData();
  return ApiResponse.success(res, data, 'Skills data retrieved successfully');
});

const updateSkills = asyncHandler(async (req, res) => {
  const updated = await portfolioService.updateSkillsData(req.body);
  return ApiResponse.success(res, updated, 'Skills updated successfully');
});

const getExperience = asyncHandler(async (req, res) => {
  const data = await portfolioService.getExperienceData();
  return ApiResponse.success(res, data, 'Experience data retrieved successfully');
});

const updateExperience = asyncHandler(async (req, res) => {
  const updated = await portfolioService.updateExperienceData(req.body);
  return ApiResponse.success(res, updated, 'Experience updated successfully');
});

const getProjects = asyncHandler(async (req, res) => {
  const data = await portfolioService.getProjectsData();
  return ApiResponse.success(res, data, 'Projects data retrieved successfully');
});

const updateProjects = asyncHandler(async (req, res) => {
  const updated = await portfolioService.updateProjectsData(req.body);
  return ApiResponse.success(res, updated, 'Projects updated successfully');
});

const uploadProjectImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.error(res, 'No file uploaded', 400);
  }

  // File path to save in the database
  const imageUrl = `/uploads/projects/${req.file.filename}`;

  return ApiResponse.success(res, { imageUrl }, 'Project image uploaded successfully');
});

const getContact = asyncHandler(async (req, res) => {
  const data = await portfolioService.getContactData();
  return ApiResponse.success(res, data, 'Contact data retrieved successfully');
});

const updateContact = asyncHandler(async (req, res) => {
  const updated = await portfolioService.updateContactData(req.body);
  return ApiResponse.success(res, updated, 'Contact updated successfully');
});

module.exports = {
  getPortfolio,
  updatePortfolio,
  uploadCV,
  getDashboard,
  updateDashboard,
  getAbout,
  updateAbout,
  getSkills,
  updateSkills,
  getExperience,
  updateExperience,
  getProjects,
  updateProjects,
  uploadProjectImage,
  getContact,
  updateContact,
};
