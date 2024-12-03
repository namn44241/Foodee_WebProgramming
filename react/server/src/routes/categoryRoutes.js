const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth } = require('../middleware/auth');

// Route lấy danh sách danh mục
router.get('/', auth, categoryController.getCategories);

module.exports = router;