const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { cloudinary, isConfigured } = require('../config/cloudinary');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|svg/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpg, jpeg, png, webp, gif, svg) are allowed!'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

// Helper to upload a file to Cloudinary if available, otherwise return local URL
const processUploadedFile = async (file, req) => {
  if (!file) return null;

  if (isConfigured) {
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'buildmaster',
        resource_type: 'image',
      });
      // Optionally remove temp local file after cloudinary upload
      fs.unlink(file.path, () => {});
      return uploadResult.secure_url;
    } catch (err) {
      console.warn('[Cloudinary upload failed, using local file]', err.message);
    }
  }

  // Fallback to local server static URL
  const protocol = req.protocol || 'http';
  const host = req.get('host') || 'localhost:5000';
  return `${protocol}://${host}/uploads/${file.filename}`;
};

module.exports = {
  upload,
  processUploadedFile,
};
