const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Get all tables' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Create table' });
});

module.exports = router;