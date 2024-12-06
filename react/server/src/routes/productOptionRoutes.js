const express = require('express');
const router = express.Router();
const productOptionController = require('../controllers/productOptionController');
const { auth, checkRole } = require('../middleware/auth');

// Public routes
router.get('/all', productOptionController.getAllOptions);
router.get('/:product_id', productOptionController.getProductOptions);

// Protected routes
router.use(auth);
router.use(checkRole(['admin']));

router.post('/create', productOptionController.createOption);
router.post('/add-to-product', productOptionController.addOptionToProduct);
router.delete('/:product_id/:option_id', productOptionController.removeOptionFromProduct);

module.exports = router;