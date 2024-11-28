const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Get all products' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Create product' });
});

module.exports = router;