const db = require('../config/database');

const orderModel = {
    addToCart: async (tableId, productId, quantity, toppings = [], note = null) => {
        try {
            // Kiểm tra order pending
            const [existingOrders] = await db.execute(
                'SELECT * FROM orders WHERE table_id = ? AND product_id = ? AND status = "pending"',
                [tableId, productId]
            );

            // Lấy giá sản phẩm
            const [product] = await db.execute(
                'SELECT price FROM products WHERE id = ?',
                [productId]
            );

            // Tính tổng giá topping
            let toppingTotalPrice = 0;
            if (toppings.length > 0) {
                const toppingIds = toppings.map(t => t.id);
                const [toppingPrices] = await db.execute(
                    'SELECT id, price_adjustment FROM options WHERE id IN (?)',
                    [toppingIds]
                );
                
                toppingTotalPrice = toppings.reduce((total, topping) => {
                    const toppingPrice = toppingPrices.find(t => t.id === topping.id);
                    return total + (toppingPrice?.price_adjustment || 0) * topping.quantity;
                }, 0);
            }

            if (existingOrders.length > 0) {
                // Cập nhật order cũ
                await db.execute(
                    'UPDATE orders SET quantity = quantity + ?, order_toppings = ?, note = ? WHERE table_id = ? AND product_id = ? AND status = "pending"',
                    [quantity, JSON.stringify(toppings), note, tableId, productId]
                );
            } else {
                // Tạo order mới
                const orderCode = `ORD${Date.now()}`;
                await db.execute(
                    'INSERT INTO orders (table_id, order_code, product_id, quantity, price, order_toppings, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [tableId, orderCode, productId, quantity, product[0].price + toppingTotalPrice, JSON.stringify(toppings), note]
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
                SELECT o.*, p.name, p.image_name,
                       o.order_toppings,
                       (o.price * o.quantity) as total_amount
                FROM orders o
                JOIN products p ON o.product_id = p.id
                WHERE o.table_id = ? AND o.status = "pending"
            `, [tableId]);

            // Parse topping JSON
            return items.map(item => ({
                ...item,
                order_toppings: JSON.parse(item.order_toppings || '[]')
            }));
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