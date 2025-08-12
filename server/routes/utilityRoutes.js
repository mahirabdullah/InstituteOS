const express = require('express');
const router = express.Router();
const { getDashboardStats, searchDirectory, generateCertificate } = require('../controllers/utilityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.get('/search', protect, searchDirectory);
router.post('/generate-certificate', generateCertificate); // Public route

module.exports = router;