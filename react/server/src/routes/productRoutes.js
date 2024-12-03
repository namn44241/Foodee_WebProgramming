const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { upload, processImage } = require('../middleware/upload');
const { auth, checkRole } = require('../middleware/auth');

// Lấy danh sách sản phẩm (public)
router.get('/', productController.getProducts);

// Các routes yêu cầu đăng nhập và quyền admin
router.use(auth);
router.use(checkRole(['admin']));

// Thêm sản phẩm mới
router.post('/', upload.single('image'), processImage, productController.addProduct);

// Cập nhật sản phẩm 
router.put('/:id', upload.single('image'), processImage, productController.updateProduct);

// Xóa sản phẩm
router.delete('/:id', productController.deleteProduct);

module.exports = router;