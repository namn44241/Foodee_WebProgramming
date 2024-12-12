const db = require('../config/database');

const DashboardController = {
    getStats: async (req, res) => {
        try {
            // Đếm số người dùng
            const [userCount] = await db.query(
                'SELECT COUNT(*) as total FROM users'
            );

            // Đếm số danh mục đang active
            const [categoryCount] = await db.query(
                'SELECT COUNT(*) as total FROM categories WHERE is_active = true'
            );

            // Đếm số món ăn đang available
            const [productCount] = await db.query(
                'SELECT COUNT(*) as total FROM products WHERE is_available = true'
            );

            // Đếm số bàn đang active
            const [tableCount] = await db.query(
                'SELECT COUNT(*) as total FROM tables WHERE is_active = true'
            );

            // Đếm tổng số đơn hàng
            const [orderCount] = await db.query(
                'SELECT COUNT(*) as total FROM orders'
            );

            // Tính tổng doanh thu từ đơn hàng completed - sửa thành total_price
            const [revenue] = await db.query(
                'SELECT SUM(total_price) as total FROM orders WHERE status = "completed"'
            );

            res.json({
                success: true,
                data: {
                    users: userCount[0].total,
                    categories: categoryCount[0].total,
                    products: productCount[0].total,
                    tables: tableCount[0].total,
                    orders: orderCount[0].total,
                    revenue: revenue[0].total || 0
                }
            });

        } catch (error) {
            console.error('Error in getStats:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thống kê',
                error: error.message
            });
        }
    }
};

module.exports = DashboardController;