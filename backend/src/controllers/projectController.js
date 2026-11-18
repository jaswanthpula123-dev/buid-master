const Project = require('../models/Project');

// Helper to make slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .concat('-', Math.random().toString(36).substring(2, 6));
};

// @desc    Get all projects (with filtering by status, search, category)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res, next) => {
  try {
    const { status, category, search, featured, page = 1, limit = 20 } = req.query;

    const query = {};

    if (status && ['Completed', 'Ongoing', 'Upcoming'].includes(status)) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: projects.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID or Slug
// @route   GET /api/projects/:idOrSlug
// @access  Public
const getProjectById = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let project = await Project.findOne({
      $or: [{ _id: idOrSlug }, { slug: idOrSlug }],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found with the requested identifier.',
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res, next) => {
  try {
    const {
      title,
      status,
      category,
      location,
      address,
      totalFloors,
      totalUnits,
      availableUnits,
      soldUnits,
      completionDate,
      estimatedStartDate,
      expectedCompletionDate,
      progressPercentage,
      priceRange,
      coverImage,
      images,
      description,
      features,
      amenities,
      specifications,
      floorPlans,
      builderDetails,
      featured,
    } = req.body;

    if (!title || !status || !location || !coverImage) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, status, location, and cover image.',
      });
    }

    const slug = slugify(title);

    const project = await Project.create({
      title,
      slug,
      status,
      category: category || 'Residential',
      location,
      address: address || '',
      totalFloors: Number(totalFloors) || 1,
      totalUnits: Number(totalUnits) || 1,
      availableUnits: Number(availableUnits) || 0,
      soldUnits: Number(soldUnits) || 0,
      completionDate: completionDate || '',
      estimatedStartDate: estimatedStartDate || '',
      expectedCompletionDate: expectedCompletionDate || '',
      progressPercentage: Number(progressPercentage) || (status === 'Completed' ? 100 : 0),
      priceRange: priceRange || '',
      coverImage,
      images: Array.isArray(images) ? images : (images ? [images] : []),
      description: description || '',
      features: Array.isArray(features) ? features : [],
      amenities: Array.isArray(amenities) ? amenities : [],
      specifications: Array.isArray(specifications) ? specifications : [],
      floorPlans: Array.isArray(floorPlans) ? floorPlans : [],
      builderDetails: builderDetails || undefined,
      milestones: Array.isArray(req.body.milestones) ? req.body.milestones : [],
      siteMetrics: req.body.siteMetrics || undefined,
      siteCameras: Array.isArray(req.body.siteCameras) ? req.body.siteCameras : [],
      timelinePhotos: Array.isArray(req.body.timelinePhotos) ? req.body.timelinePhotos : [],
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully!',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    const updated = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Project updated successfully!',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    await Project.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get summary / counts by project status
// @route   GET /api/projects/status-summary
// @access  Public
const getStatusSummary = async (req, res, next) => {
  try {
    const completed = await Project.countDocuments({ status: 'Completed' });
    const ongoing = await Project.countDocuments({ status: 'Ongoing' });
    const upcoming = await Project.countDocuments({ status: 'Upcoming' });

    res.json({
      success: true,
      summary: {
        completed,
        ongoing,
        upcoming,
        total: completed + ongoing + upcoming,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getStatusSummary,
};
