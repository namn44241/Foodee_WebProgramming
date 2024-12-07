const db = require('../config/database');

const productOptionController = {
    // Lấy tất cả options có sẵn
    getAllOptions: async (req, res) => {
        try {
            const [rows] = await db.execute('SELECT * FROM options ORDER BY name');
            res.json({
                success: true,
                data: rows
            });
        } catch (error) {
            console.error('Error getting options:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách tùy chọn'
            });
        }
    },

    // Lấy options của một sản phẩm
    getProductOptions: async (req, res) => {
        try {
            const { product_id } = req.params;
            const [rows] = await db.execute(`
                SELECT o.*, 
                       CASE WHEN po.product_id IS NOT NULL THEN 1 ELSE 0 END as is_selected
                FROM options o
                LEFT JOIN product_options po ON o.id = po.option_id AND po.product_id = ?
                ORDER BY o.name
            `, [product_id]);
            
            res.json({
                success: true,
                data: rows
            });
        } catch (error) {
            console.error('Error getting product options:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy tùy chọn sản phẩm'
            });
        }
    },

    // Thêm option cho sản phẩm
    addOptionToProduct: async (req, res) => {
        try {
            const { product_id, option_id } = req.body;
            
            // Kiểm tra xem đã có liên kết này chưa
            const [existing] = await db.execute(
                'SELECT * FROM product_options WHERE product_id = ? AND option_id = ?',
                [product_id, option_id]
            );

            if (existing.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Sản phẩm đã có tùy chọn này'
                });
            }

            await db.execute(
                'INSERT INTO product_options (product_id, option_id) VALUES (?, ?)',
                [product_id, option_id]
            );

            res.json({
                success: true,
                message: 'Thêm tùy chọn thành công'
            });
        } catch (error) {
            console.error('Error adding option to product:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm tùy chọn'
            });
        }
    },

    // Tạo option mới
    createOption: async (req, res) => {
        try {
            const { name, price_adjustment } = req.body;
            
            const [result] = await db.execute(
                'INSERT INTO options (name, price_adjustment) VALUES (?, ?)',
                [name, price_adjustment]
            );

            res.json({
                success: true,
                message: 'Tạo tùy chọn mới thành công',
                data: {
                    id: result.insertId,
                    name,
                    price_adjustment
                }
            });
        } catch (error) {
            console.error('Error creating option:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo tùy chọn mới'
            });
        }
    },

    // Xóa option khỏi sản phẩm
    removeOptionFromProduct: async (req, res) => {
        try {
            const { product_id, option_id } = req.params;
            
            await db.execute(
                'DELETE FROM product_options WHERE product_id = ? AND option_id = ?',
                [product_id, option_id]
            );

            res.json({
                success: true,
                message: 'Xóa tùy chọn thành công'
            });
        } catch (error) {
            console.error('Error removing option from product:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa tùy chọn'
            });
        }
    },

    // Thêm method mới để quản lý options của sản phẩm
    updateProductOptions: async (req, res) => {
        try {
            const { product_id, option_ids } = req.body;
            
            // Xóa tất cả options hiện tại của sản phẩm
            await db.execute('DELETE FROM product_options WHERE product_id = ?', [product_id]);
            
            // Thêm các options mới
            for (const option_id of option_ids) {
                await db.execute(
                    'INSERT INTO product_options (product_id, option_id) VALUES (?, ?)',
                    [product_id, option_id]
                );
            }
            
            res.json({
                success: true,
                message: 'Cập nhật tùy chọn thành công'
            });
        } catch (error) {
            console.error('Error updating product options:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật tùy chọn'
            });
        }
    }
};

module.exports = productOptionController;