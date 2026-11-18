const express = require('express');
const router = express.Router();
const { upload, processUploadedFile } = require('../middleware/upload');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Single image upload
router.post('/single', verifyToken, isAdmin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded.',
      });
    }

    const url = await processUploadedFile(req.file, req);

    res.json({
      success: true,
      message: 'Image uploaded successfully!',
      url,
    });
  } catch (error) {
    next(error);
  }
});

// Multiple images upload
router.post('/multiple', verifyToken, isAdmin, upload.array('images', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files uploaded.',
      });
    }

    const urls = [];
    for (const file of req.files) {
      const url = await processUploadedFile(file, req);
      urls.push(url);
    }

    res.json({
      success: true,
      message: `${urls.length} images uploaded successfully!`,
      urls,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
