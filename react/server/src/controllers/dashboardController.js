const db = require('../config/database');

const DashboardController = {
    getStats: async (req, res) => {
        try {
            console.log('Starting getStats...');

            // Đếm số người dùng
            const [userCount] = await db.query(
                'SELECT COUNT(*) as total FROM users'
            );
            console.log('Users count:', userCount);

            // Đếm số danh mục đang active
            const [categoryCount] = await db.query(
                'SELECT COUNT(*) as total FROM categories WHERE is_active = true'
            );
            console.log('Categories count:', categoryCount);

            // Đếm số món ăn đang available
            const [productCount] = await db.query(
                'SELECT COUNT(*) as total FROM products WHERE is_available = true'
            );
            console.log('Products count:', productCount);

            // Đếm số bàn đang available
            const [tableCount] = await db.query(
                'SELECT COUNT(*) as total FROM tables WHERE status = "available"'
            );
            console.log('Tables count:', tableCount);

            // Đếm tổng số đơn hàng
            const [orderCount] = await db.query(
                'SELECT COUNT(*) as total FROM orders'
            );
            console.log('Orders count:', orderCount);

            // Tính tổng doanh thu
            const [revenue] = await db.query(`
                SELECT COALESCE(SUM(total_amount), 0) as total 
                FROM orders 
                WHERE status = 'completed'
            `);
            console.log('Revenue:', revenue);

            // Sửa lại query thống kê doanh thu theo tháng
            const [revenueByMonth] = await db.query(`
                SELECT 
                    month,
                    SUM(revenue) as revenue
                FROM (
                    SELECT 
                        DATE_FORMAT(created_at, '%m/%Y') as month,
                        total_amount as revenue
                    FROM orders 
                    WHERE status = 'completed'
                        AND created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
                ) as monthly_data
                GROUP BY month
                ORDER BY STR_TO_DATE(CONCAT('01/', month), '%d/%m/%Y') ASC
            `);
            console.log('Revenue by month:', revenueByMonth);

            // Sửa lại query top sản phẩm
            const [topProducts] = await db.query(`
                SELECT 
                    p.name,
                    COALESCE(SUM(oi.quantity), 0) as total_sold
                FROM products p
                LEFT JOIN order_items oi ON p.id = oi.product_id
                LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
                GROUP BY p.id, p.name
                HAVING total_sold > 0
                ORDER BY total_sold DESC
                LIMIT 5
            `);
            console.log('Top products:', topProducts);

            // Sửa lại query đếm số đơn hàng theo tháng
            const [ordersByMonth] = await db.query(`
                SELECT 
                    DATE_FORMAT(created_at, '%m/%Y') as month,
                    COUNT(*) as count
                FROM orders 
                WHERE status = 'completed'
                    AND created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
                GROUP BY month
                ORDER BY month ASC
            `);
            console.log('Orders by month:', ordersByMonth);

            const responseData = {
                users: userCount[0].total,
                categories: categoryCount[0].total,
                products: productCount[0].total,
                tables: tableCount[0].total,
                orders: orderCount[0].total,
                revenue: revenue[0].total,
                revenueByMonth: revenueByMonth,
                topProducts: topProducts,
                ordersByMonth: ordersByMonth
            };

            console.log('Final response data:', responseData);

            res.json({
                success: true,
                data: responseData
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