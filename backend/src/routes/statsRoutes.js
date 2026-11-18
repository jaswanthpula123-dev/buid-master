const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/dashboard', verifyToken, isAdmin, getDashboardStats);

module.exports = router;
