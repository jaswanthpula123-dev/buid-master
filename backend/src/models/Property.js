const mongoose = require('mongoose');
const createModelProxy = require('./modelProxy');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['Apartment', 'Flat', 'Villa', 'Independent House', 'Penthouse', 'Commercial'],
      default: 'Apartment',
    },
    status: {
      type: String,
      enum: ['Available', 'Booked', 'Sold'],
      default: 'Available',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    priceDisplay: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    address: {
      type: String,
      default: '',
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      default: 2,
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      default: 2,
    },
    areaSqFt: {
      type: Number,
      required: [true, 'Area in sq ft is required'],
      default: 1200,
    },
    furnishing: {
      type: String,
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Semi-Furnished',
    },
    facing: {
      type: String,
      default: 'East Facing',
    },
    parking: {
      type: Number,
      default: 1,
    },
    floorNo: {
      type: Number,
      default: 1,
    },
    totalFloors: {
      type: Number,
      default: 1,
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    amenities: {
      type: [String],
      default: [],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    projectTitle: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const { formatINR } = require('../utils/formatCurrency');

// Auto-generate slug and price display
propertySchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 6);
  }
  if (this.price && !this.priceDisplay) {
    this.priceDisplay = formatINR(this.price);
  }
  next();
});

const MongooseProperty = mongoose.model('Property', propertySchema);
module.exports = createModelProxy('Property', MongooseProperty);
