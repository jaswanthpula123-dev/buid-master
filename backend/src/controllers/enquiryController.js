const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');
const Project = require('../models/Project');

// @desc    Submit a new enquiry
// @route   POST /api/enquiries
// @access  Public (Optional Customer Token)
const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message, enquiryType, propertyId, projectId } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name, email, phone number, and message.',
      });
    }

    let propertyTitle = '';
    let projectTitle = '';

    if (propertyId) {
      const prop = await Property.findById(propertyId);
      if (prop) propertyTitle = prop.title;
    }

    if (projectId) {
      const proj = await Project.findById(projectId);
      if (proj) projectTitle = proj.title;
    }

    const enquiry = await Enquiry.create({
      name,
      email: email.toLowerCase(),
      phone,
      message,
      enquiryType: enquiryType || (propertyId ? 'Property' : projectId ? 'Project' : 'General'),
      propertyId: propertyId || null,
      projectId: projectId || null,
      propertyTitle,
      projectTitle,
      status: 'New',
      customerId: req.user ? req.user._id : null,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received. Our team will contact you shortly.',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enquiries for currently logged-in customer
// @route   GET /api/enquiries/my
// @access  Private
const getMyEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({
      $or: [
        { customerId: req.user._id },
        { email: req.user.email.toLowerCase() },
      ],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries (Admin)
// @route   GET /api/enquiries
// @access  Private/Admin
const getAllEnquiries = async (req, res, next) => {
  try {
    const { status, type, search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (type && type !== 'All') {
      query.enquiryType = type;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { propertyTitle: { $regex: search, $options: 'i' } },
        { projectTitle: { $regex: search, $options: 'i' } },
      ];
    }

    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status & notes (Admin)
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.',
      });
    }

    const updated = await Enquiry.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Enquiry status updated successfully!',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete enquiry (Admin)
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.',
      });
    }

    await Enquiry.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Enquiry deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnquiry,
  getMyEnquiries,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
};
