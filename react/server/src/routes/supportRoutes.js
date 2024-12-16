// server/src/routes/supportRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../config/database');

const BOT_TOKEN = '7496594083:AAGq0mKoLFP6o6gdVVYNBN7LoICGYPuM5NE';
const CHAT_ID = '-1002296514978';

router.post('/request-help', async (req, res) => {
    try {
        const { tableId } = req.body;
        
        // Lấy thông tin bàn từ database
        const [table] = await db.execute(
            'SELECT table_number FROM tables WHERE id = ?',
            [tableId]
        );

        if (!table || table.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Không tìm thấy thông tin bàn' 
            });
        }

        const message = `Khách hàng ${table[0].table_number} cần trợ giúp!`;
        
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Telegram notification error:', error);
        res.status(500).json({ success: false });
    }
});

module.exports = router;