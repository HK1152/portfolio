const express = require('express');
const router = express.Router();
const { getPortfolio, updatePortfolio } = require('../controllers/portfolioController');
const requireAdmin = require('../middleware/requireAdmin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `cv-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDFs and Word documents (.doc, .docx) are allowed!'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `icon-${Date.now()}${ext}`);
  }
});

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|svg|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname || mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, SVG, WebP) are allowed!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', getPortfolio);
router.get('/admin/verify', requireAdmin, (req, res) => {
  res.json({ success: true, message: 'Admin key verified' });
});
router.put('/', requireAdmin, updatePortfolio);

router.post('/admin/upload-cv', requireAdmin, upload.single('cvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const cvUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, cvUrl, message: 'CV uploaded successfully' });
});

router.post('/admin/upload-image', requireAdmin, uploadImage.single('iconFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const iconUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, iconUrl, message: 'Icon uploaded successfully' });
});

router.post('/admin/upload-project-image', requireAdmin, uploadImage.single('projectImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl, message: 'Project image uploaded successfully' });
});

module.exports = router;
