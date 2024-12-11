const db = require('../config/database');

const orderModel = {
    addToCart: async (tableId, productId, quantity, note = null) => {
        try {
            // Kiểm tra xem có order pending nào cho bàn này chưa
            const [existingOrders] = await db.execute(
                'SELECT * FROM orders WHERE table_id = ? AND product_id = ? AND status = "pending"',
                [tableId, productId]
            );

            // Lấy giá sản phẩm
            const [product] = await db.execute(
                'SELECT price FROM products WHERE id = ?',
                [productId]
            );

            if (existingOrders.length > 0) {
                // Cập nhật số lượng nếu sản phẩm đã có trong giỏ
                await db.execute(
                    'UPDATE orders SET quantity = quantity + ? WHERE table_id = ? AND product_id = ? AND status = "pending"',
                    [quantity, tableId, productId]
                );
            } else {
                // Tạo order code mới
                const orderCode = `ORD${Date.now()}`;
                
                // Thêm order mới
                await db.execute(
                    'INSERT INTO orders (table_id, order_code, product_id, quantity, price, note) VALUES (?, ?, ?, ?, ?, ?)',
                    [tableId, orderCode, productId, quantity, product[0].price, note]
                );
            }
            return true;
        } catch (error) {
            throw error;
        }
    },

    getCartItems: async (tableId) => {
        try {
            const [items] = await db.execute(`
                SELECT o.*, p.name, p.image_name 
                FROM orders o
                JOIN products p ON o.product_id = p.id
                WHERE o.table_id = ? AND o.status = "pending"
            `, [tableId]);
            return items;
        } catch (error) {
            throw error;
        }
    },

    updateQuantity: async (orderId, quantity) => {
        try {
            await db.execute(
                'UPDATE orders SET quantity = ? WHERE id = ? AND status = "pending"',
                [quantity, orderId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    },

    removeItem: async (orderId) => {
        try {
            await db.execute(
                'DELETE FROM orders WHERE id = ? AND status = "pending"',
                [orderId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    },

    clearCart: async (tableId) => {
        try {
            await db.execute(
                'DELETE FROM orders WHERE table_id = ? AND status = "pending"',
                [tableId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = orderModel;