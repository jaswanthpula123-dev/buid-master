const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} = require('../controllers/wishlistController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', getWishlist);
router.get('/check/:propertyId', checkWishlist);
router.post('/:propertyId', addToWishlist);
router.delete('/:propertyId', removeFromWishlist);

module.exports = router;
