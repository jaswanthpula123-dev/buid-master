const Wishlist = require('../models/Wishlist');
const Property = require('../models/Property');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const list = await Wishlist.find({ user: req.user._id }).populate('property');

    // Extract valid populated properties
    const properties = list
      .filter(item => item.property)
      .map(item => item.property);

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add property to wishlist
// @route   POST /api/wishlist/:propertyId
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    const existing = await Wishlist.findOne({
      user: req.user._id,
      property: propertyId,
    });

    if (existing) {
      return res.json({
        success: true,
        message: 'Property is already in your wishlist.',
      });
    }

    await Wishlist.create({
      user: req.user._id,
      property: propertyId,
    });

    res.status(201).json({
      success: true,
      message: 'Property added to wishlist!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove property from wishlist
// @route   DELETE /api/wishlist/:propertyId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    await Wishlist.deleteOne({
      user: req.user._id,
      property: propertyId,
    });

    res.json({
      success: true,
      message: 'Property removed from wishlist.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if property is in wishlist
// @route   GET /api/wishlist/check/:propertyId
// @access  Private
const checkWishlist = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const existing = await Wishlist.findOne({
      user: req.user._id,
      property: propertyId,
    });

    res.json({
      success: true,
      inWishlist: Boolean(existing),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
};
