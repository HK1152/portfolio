const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the directories exist
const uploadDirCV = path.join(__dirname, '../../../public/uploads/cv');
if (!fs.existsSync(uploadDirCV)) {
  fs.mkdirSync(uploadDirCV, { recursive: true });
}

const uploadDirProjects = path.join(__dirname, '../../../public/uploads/projects');
if (!fs.existsSync(uploadDirProjects)) {
  fs.mkdirSync(uploadDirProjects, { recursive: true });
}

const storageCV = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirCV);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const storageProjects = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirProjects);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilterCV = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const fileFilterImage = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'), false);
  }
};

const uploadCV = multer({
  storage: storageCV,
  fileFilter: fileFilterCV,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadImage = multer({
  storage: storageProjects,
  fileFilter: fileFilterImage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = {
  uploadCV,
  uploadImage
};
