const mongoose = require('mongoose');
const createModelProxy = require('./modelProxy');

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
  },
  { timestamps: true }
);

wishlistSchema.index({ user: 1, property: 1 }, { unique: true });

const MongooseWishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = createModelProxy('Wishlist', MongooseWishlist);
