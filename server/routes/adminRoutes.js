// In routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');

router.post('/register', registerAdmin); // This line defines the POST route
router.post('/login', loginAdmin);

module.exports = router;