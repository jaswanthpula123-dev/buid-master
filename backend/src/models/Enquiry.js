const mongoose = require('mongoose');
const createModelProxy = require('./modelProxy');

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message or query details'],
      trim: true,
    },
    enquiryType: {
      type: String,
      enum: ['Property', 'Project', 'General'],
      default: 'General',
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      default: null,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    propertyTitle: {
      type: String,
      default: '',
    },
    projectTitle: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Progress', 'Closed'],
      default: 'New',
    },
    notes: {
      type: String,
      default: '',
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

const MongooseEnquiry = mongoose.model('Enquiry', enquirySchema);
module.exports = createModelProxy('Enquiry', MongooseEnquiry);
