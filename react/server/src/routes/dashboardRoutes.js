const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { auth, checkRole } = require('../middleware/auth'); 

// Route này yêu cầu đăng nhập và là admin
router.get('/stats', auth, checkRole(['admin']), DashboardController.getStats);

// router.get('/stats', DashboardController.getStats);


module.exports = router;