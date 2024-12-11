const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Thêm sản phẩm vào giỏ hàng
router.post('/add', cartController.addToCart);

// Lấy thông tin giỏ hàng của một bàn
router.get('/:tableId', cartController.getCartItems);

// Cập nhật số lượng sản phẩm
router.put('/update', cartController.updateQuantity);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/item/:orderId', cartController.removeItem);

// Xóa toàn bộ giỏ hàng của một bàn
router.delete('/clear/:tableId', cartController.clearCart);

module.exports = router;