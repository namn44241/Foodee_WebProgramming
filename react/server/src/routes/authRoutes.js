const express = require('express');
const router = express.Router();
const db = require('../config/database');
const crypto = require('crypto');

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Mã hóa password để so sánh với database
        const hashedPassword = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        // Truy vấn database
        const [rows] = await db.execute(
            'SELECT username, role FROM users WHERE username = ? AND password = ?',
            [username, hashedPassword]
        );

        if (rows.length > 0) {
            res.json({
                success: true,
                message: 'Đăng nhập thành công',
                role: rows[0].role,
                username: rows[0].username
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Tài khoản hoặc mật khẩu không chính xác'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;