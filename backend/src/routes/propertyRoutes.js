const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  updatePropertyStatus,
  deleteProperty,
} = require('../controllers/propertyController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', getProperties);
router.get('/:idOrSlug', getPropertyById);

// Admin-only routes
router.post('/', verifyToken, isAdmin, createProperty);
router.put('/:id', verifyToken, isAdmin, updateProperty);
router.patch('/:id/status', verifyToken, isAdmin, updatePropertyStatus);
router.delete('/:id', verifyToken, isAdmin, deleteProperty);

module.exports = router;
