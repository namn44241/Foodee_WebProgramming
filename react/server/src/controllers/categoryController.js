const db = require('../config/database');

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT * FROM categories 
                WHERE is_active = 1 
                ORDER BY name ASC
            `);
            
            // Log để debug
            console.log('Categories from DB:', rows);
            
            res.json({
                success: true,
                data: rows
            });
        } catch (error) {
            console.error('Error getting categories:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách danh mục'
            });
        }
    }
};

module.exports = categoryController;