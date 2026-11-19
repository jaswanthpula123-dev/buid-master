const mongoose = require('mongoose');
const createModelProxy = require('./modelProxy');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
    },
    status: {
      type: String,
      required: [true, 'Project status is required'],
      enum: ['Completed', 'Ongoing', 'Upcoming'],
      default: 'Ongoing',
    },
    category: {
      type: String,
      default: 'Residential',
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
    totalFloors: {
      type: Number,
      default: 1,
    },
    totalUnits: {
      type: Number,
      default: 1,
    },
    availableUnits: {
      type: Number,
      default: 0,
    },
    soldUnits: {
      type: Number,
      default: 0,
    },
    completionDate: {
      type: String,
      default: '',
    },
    estimatedStartDate: {
      type: String,
      default: '',
    },
    expectedCompletionDate: {
      type: String,
      default: '',
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    priceRange: {
      type: String,
      default: '',
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
    features: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    specifications: [
      {
        label: { type: String, default: '' },
        value: { type: String, default: '' },
      },
    ],
    floorPlans: [
      {
        title: { type: String, default: 'Standard Plan' },
        area: { type: String, default: '1,250 sq.ft' },
        bedrooms: { type: Number, default: 2 },
        image: { type: String, default: '' },
      },
    ],
    builderDetails: {
      name: { type: String, default: 'BuildMaster Infra Pvt Ltd' },
      experience: { type: String, default: '18+ Years of Excellence' },
      contact: { type: String, default: '+91 93466 38123' },
    },
    milestones: [
      {
        name: { type: String, required: true },
        percentage: { type: Number, default: 0 },
        status: { type: String, enum: ['Completed', 'In Progress', 'Pending'], default: 'Pending' },
        completionDate: { type: String, default: '' },
        inspectionNotes: { type: String, default: '' },
      },
    ],
    siteMetrics: {
      activeWorkforce: { type: Number, default: 180 },
      safetyScore: { type: String, default: '100% Zero Incidents' },
      concreteGrade: { type: String, default: 'M50 High-Tensile' },
      weatherCondition: { type: String, default: 'Optimal / 28°C' },
      lastInspected: { type: String, default: 'Today' },
    },
    siteCameras: [
      {
        id: { type: String, default: 'cam-1' },
        name: { type: String, default: 'CAM 01: Tower Crane View' },
        location: { type: String, default: 'Level 34 Crane Mast' },
        thumbnail: { type: String, default: '' },
        status: { type: String, default: 'Live HD' },
      },
    ],
    timelinePhotos: [
      {
        date: { type: String, default: '' },
        title: { type: String, default: '' },
        stage: { type: String, default: '' },
        image: { type: String, default: '' },
        notes: { type: String, default: '' },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-generate slug before saving
projectSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 6);
  }
  next();
});

const MongooseProject = mongoose.model('Project', projectSchema);
module.exports = createModelProxy('Project', MongooseProject);
