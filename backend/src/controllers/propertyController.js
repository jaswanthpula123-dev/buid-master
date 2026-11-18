const Property = require('../models/Property');
const { formatINR } = require('../utils/formatCurrency');

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

// @desc    Get all properties with comprehensive filters
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
  try {
    const {
      type,
      status,
      location,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      search,
      featured,
      projectId,
      sort = 'newest',
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (type && type !== 'All') {
      query.type = type;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (bedrooms && bedrooms !== 'All') {
      query.bedrooms = Number(bedrooms);
    }

    if (bathrooms && bathrooms !== 'All') {
      query.bathrooms = Number(bathrooms);
    }

    if (projectId) {
      query.projectId = projectId;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort options
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-high') {
      sortOptions = { price: -1 };
    } else if (sort === 'area-high') {
      sortOptions = { areaSqFt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: properties.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property by ID or Slug
// @route   GET /api/properties/:idOrSlug
// @access  Public
const getPropertyById = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const property = await Property.findOne({
      $or: [{ _id: idOrSlug }, { slug: idOrSlug }],
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found with the requested identifier.',
      });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private/Admin
const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      type,
      status,
      price,
      priceDisplay,
      location,
      address,
      bedrooms,
      bathrooms,
      areaSqFt,
      furnishing,
      facing,
      parking,
      floorNo,
      totalFloors,
      coverImage,
      images,
      description,
      amenities,
      projectId,
      projectTitle,
      featured,
    } = req.body;

    if (!title || !type || !price || !location || !coverImage) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, type, price, location, and cover image.',
      });
    }

    const slug = slugify(title);

    const property = await Property.create({
      title,
      slug,
      type,
      status: status || 'Available',
      price: Number(price),
      priceDisplay: priceDisplay || formatINR(price),
      location,
      address: address || '',
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      areaSqFt: Number(areaSqFt) || 800,
      furnishing: furnishing || 'Semi-Furnished',
      facing: facing || 'East',
      parking: Number(parking) || 1,
      floorNo: Number(floorNo) || 1,
      totalFloors: Number(totalFloors) || 1,
      coverImage,
      images: Array.isArray(images) ? images : (images ? [images] : []),
      description: description || '',
      amenities: Array.isArray(amenities) ? amenities : [],
      projectId: projectId || null,
      projectTitle: projectTitle || '',
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      message: 'Property added successfully!',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/Admin
const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Auto calculate priceDisplay if price is updated
    if (req.body.price && !req.body.priceDisplay) {
      req.body.priceDisplay = formatINR(req.body.price);
    }

    const updated = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Property updated successfully!',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property status only (Available, Booked, Sold)
// @route   PATCH /api/properties/:id/status
// @access  Private/Admin
const updatePropertyStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Available', 'Booked', 'Sold'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Available, Booked, or Sold.',
      });
    }

    const updated = await Property.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    res.json({
      success: true,
      message: `Property status changed to ${status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    await Property.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Property deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  updatePropertyStatus,
  deleteProperty,
};
