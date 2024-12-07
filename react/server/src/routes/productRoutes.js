const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { upload, processImage } = require('../middleware/upload');
const { auth, checkRole } = require('../middleware/auth');

// Public routes - không cần auth
router.get('/public', productController.getProducts);
router.get('/public/:id', productController.getProductById);
router.get('/related/:id', productController.getRelatedProducts);

// Protected routes - yêu cầu auth và quyền admin
router.get('/', auth, checkRole(['admin']), productController.getAdminProducts);

// Middleware cho các routes admin
router.use(auth);
router.use(checkRole(['admin']));

// Routes quản lý sản phẩm (CRUD)
router.post('/', upload.single('image'), processImage, productController.addProduct);
router.put('/:id', upload.single('image'), processImage, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;