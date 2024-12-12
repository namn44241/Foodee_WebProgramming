const db = require('../config/database');

const orderModel = {
    addToCart: async (tableId, productId, quantity, toppings = []) => {
        try {

            const [product] = await db.execute(
                'SELECT * FROM products WHERE id = ?',
                [productId]
            );

            if (!product || product.length === 0) {
                throw new Error('Sản phẩm không tồn tại');
            }

            const toppingTotalPrice = Array.isArray(toppings) 
                ? toppings.reduce((sum, topping) => sum + (Number(topping.price_adjustment) || 0), 0)
                : 0;

            const [existingOrders] = await db.execute(
                `SELECT * FROM orders 
                WHERE table_id = ? 
                AND product_id = ? 
                AND status = 'pending'`,
                [tableId, productId]
            );

            // Tìm order có topping giống hệt
            const matchingOrder = existingOrders.find(order => {

                const existingToppings = order.order_toppings || [];
                
                // So sánh từng topping
                if (existingToppings.length !== toppings.length) {
                    return false;
                }
                
                return existingToppings.every(existingTopping => 
                    toppings.some(newTopping => 
                        existingTopping.id === newTopping.id &&
                        existingTopping.name === newTopping.name &&
                        existingTopping.price_adjustment === newTopping.price_adjustment
                    )
                );
            });

            if (matchingOrder) {
                // Nếu tìm thấy order trùng, update quantity
                const newQuantity = matchingOrder.quantity + quantity;
                
                await db.execute(
                    `UPDATE orders 
                    SET quantity = ?
                    WHERE id = ?`,
                    [newQuantity, matchingOrder.id]
                );

                return { updated: true, orderId: matchingOrder.id };
            } else {
                // Nếu không tìm thấy, tạo order mới
                const orderCode = `ORD${Date.now()}`;
                
                const [result] = await db.execute(
                    `INSERT INTO orders (
                        table_id, 
                        order_code, 
                        product_id, 
                        quantity, 
                        base_price,
                        topping_price,
                        order_toppings
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        tableId,
                        orderCode,
                        productId,
                        quantity,
                        product[0].price,
                        toppingTotalPrice,
                        JSON.stringify(toppings)
                    ]
                );

                return { updated: false, orderId: result.insertId };
            }
        } catch (error) {
            throw error;
        }
    },

    getCartItems: async (tableId) => {
        try {
            const [items] = await db.execute(
                `SELECT o.*, p.name, p.image_name, 
                        o.base_price as price,
                        o.total_price as total_amount,
                        o.order_toppings
                FROM orders o
                JOIN products p ON o.product_id = p.id
                WHERE o.table_id = ? AND o.status = 'pending'
                ORDER BY o.created_at DESC`,
                [tableId]
            );
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