const express = require('express');
const router = express.Router();
const { getPortfolio, updatePortfolio, uploadCV, getDashboard, updateDashboard, getAbout, updateAbout, getSkills, updateSkills, getExperience, updateExperience, getProjects, updateProjects, uploadProjectImage, getContact, updateContact } = require('./portfolio.controller');
const { protect } = require('../../middleware/auth.middleware');
const { uploadCV: uploadMiddleware, uploadImage } = require('../../middleware/upload.middleware');

router.get('/', getPortfolio);
router.post('/', protect, updatePortfolio);
router.post('/upload-cv', protect, uploadMiddleware.single('cv'), uploadCV);

router.get('/dashboard', getDashboard);
router.post('/dashboard', protect, updateDashboard);

router.get('/about', getAbout);
router.post('/about', protect, updateAbout);

router.get('/skills', getSkills);
router.post('/skills', protect, updateSkills);

router.get('/experience', getExperience);
router.post('/experience', protect, updateExperience);

router.get('/projects', getProjects);
router.post('/projects', protect, updateProjects);
router.post('/upload-project-image', protect, uploadImage.single('image'), uploadProjectImage);

router.get('/contact', getContact);
router.post('/contact', protect, updateContact);

module.exports = router;
