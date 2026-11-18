const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getStatusSummary,
} = require('../controllers/projectController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', getProjects);
router.get('/status-summary', getStatusSummary);
router.get('/:idOrSlug', getProjectById);

// Admin-only routes
router.post('/', verifyToken, isAdmin, createProject);
router.put('/:id', verifyToken, isAdmin, updateProject);
router.delete('/:id', verifyToken, isAdmin, deleteProject);

module.exports = router;
