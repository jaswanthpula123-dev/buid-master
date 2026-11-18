const Project = require('../models/Project');
const Property = require('../models/Property');
const Enquiry = require('../models/Enquiry');
const User = require('../models/User');

// @desc    Get dashboard metrics & statistical overview
// @route   GET /api/stats/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProjects,
      completedProjects,
      ongoingProjects,
      upcomingProjects,
      totalProperties,
      availableProperties,
      bookedProperties,
      soldProperties,
      totalEnquiries,
      newEnquiries,
      totalUsers,
      recentEnquiries,
      recentProjects,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'Completed' }),
      Project.countDocuments({ status: 'Ongoing' }),
      Project.countDocuments({ status: 'Upcoming' }),
      Property.countDocuments(),
      Property.countDocuments({ status: 'Available' }),
      Property.countDocuments({ status: 'Booked' }),
      Property.countDocuments({ status: 'Sold' }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'New' }),
      User.countDocuments({ role: 'customer' }),
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
      Project.find().sort({ createdAt: -1 }).limit(4),
    ]);

    res.json({
      success: true,
      data: {
        projects: {
          total: totalProjects,
          completed: completedProjects,
          ongoing: ongoingProjects,
          upcoming: upcomingProjects,
        },
        properties: {
          total: totalProperties,
          available: availableProperties,
          booked: bookedProperties,
          sold: soldProperties,
        },
        enquiries: {
          total: totalEnquiries,
          new: newEnquiries,
        },
        users: {
          totalCustomers: totalUsers,
        },
        recentEnquiries,
        recentProjects,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
