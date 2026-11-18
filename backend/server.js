const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB, getStatus } = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const propertyRoutes = require('./src/routes/propertyRoutes');
const enquiryRoutes = require('./src/routes/enquiryRoutes');
const wishlistRoutes = require('./src/routes/wishlistRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const statsRoutes = require('./src/routes/statsRoutes');

const Project = require('./src/models/Project');
const seedAll = require('./src/seed/seedData');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root & Health check
app.get('/api/health', (req, res) => {
  const dbStatus = getStatus();
  res.json({
    status: 'ok',
    service: 'BuildMaster API',
    database: dbStatus.isConnected ? 'MongoDB Connected' : 'In-Memory Persistence Fallback Active',
    timestamp: new Date().toISOString(),
  });
});

// Re-seed endpoint for quick testing
app.post('/api/seed', async (req, res) => {
  try {
    await seedAll();
    res.json({ success: true, message: 'Database re-seeded successfully with sample projects and properties!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

// Initialize Server
const startServer = async () => {
  try {
    await connectDB();

    // Check if initial seeding is needed
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log('[Init] No existing projects found. Auto-seeding initial sample data...');
      await seedAll();
    }

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  BuildMaster Backend Server running on port ${PORT}`);
      console.log(`  Health API: http://localhost:${PORT}/api/health`);
      console.log(`  Projects:   http://localhost:${PORT}/api/projects`);
      console.log(`  Properties: http://localhost:${PORT}/api/properties`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start BuildMaster server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
