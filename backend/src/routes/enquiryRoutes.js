const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getMyEnquiries,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const { verifyToken, optionalToken, isAdmin } = require('../middleware/auth');

// Public or logged-in submit
router.post('/', optionalToken, createEnquiry);

// Customer enquiry history
router.get('/my', verifyToken, getMyEnquiries);

// Admin enquiry management
router.get('/', verifyToken, isAdmin, getAllEnquiries);
router.put('/:id', verifyToken, isAdmin, updateEnquiryStatus);
router.delete('/:id', verifyToken, isAdmin, deleteEnquiry);

module.exports = router;
