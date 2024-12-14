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
    },

    createOrder: async (tableId, products) => {
        try {
            const orderCode = `ORD${Date.now()}`;
            const connection = await db.getConnection();
            await connection.beginTransaction();

            try {
                console.log('Creating order with products:', products);

                if (!Array.isArray(products)) {
                    products = [products];
                }

                // Thêm từng sản phẩm vào đơn hàng
                for (const product of products) {
                    const { 
                        product_id, 
                        quantity, 
                        base_price, 
                        topping_price = 0, 
                        note = '', 
                        order_toppings = null 
                    } = product;

                    await connection.execute(
                        `INSERT INTO orders (
                            table_id, 
                            order_code, 
                            product_id, 
                            quantity, 
                            base_price, 
                            topping_price, 
                            note, 
                            order_toppings,
                            status
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
                        [
                            tableId,
                            orderCode,
                            product_id,
                            quantity,
                            base_price,
                            topping_price,
                            note,
                            order_toppings ? JSON.stringify(order_toppings) : null
                        ]
                    );
                }

                // Cập nhật trạng thái bàn
                await connection.execute(
                    'UPDATE tables SET status = "occupied" WHERE id = ?',
                    [tableId]
                );

                await connection.commit();
                connection.release();
                return { order_code: orderCode };
            } catch (err) {
                await connection.rollback();
                connection.release();
                throw err;
            }
        } catch (error) {
            throw error;
        }
    },

    getAllOrders: async () => {
        try {
            console.log('Executing getAllOrders query...');
            
            const [orders] = await db.execute(`
                SELECT 
                    o.id,
                    o.order_code,
                    o.table_id,
                    o.product_id,
                    o.quantity,
                    o.base_price,
                    o.topping_price,
                    o.total_price,
                    o.status,
                    o.note,
                    o.order_toppings,
                    o.created_at,
                    p.name as product_name,
                    t.table_number,
                    p.image_name
                FROM orders o
                LEFT JOIN products p ON o.product_id = p.id
                LEFT JOIN tables t ON o.table_id = t.id
                ORDER BY o.created_at DESC
            `);

            // Format lại dữ liệu một cách an toàn
            const formattedOrders = orders.map(order => {
                let parsedToppings = [];
                if (order.order_toppings && order.order_toppings !== '[]') {
                    try {
                        parsedToppings = JSON.parse(order.order_toppings);
                    } catch (e) {
                        console.log('Invalid order_toppings format:', order.order_toppings);
                    }
                }

                return {
                    ...order,
                    order_toppings: parsedToppings
                };
            });
            
            return formattedOrders;
        } catch (error) {
            console.error('Database error in getAllOrders:', error);
            throw error;
        }
    },

    updateStatus: async (orderId, status) => {
        try {
            await db.execute(
                'UPDATE orders SET status = ? WHERE id = ?',
                [status, orderId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    },

    updateOrder: async (orderId, data) => {
        try {
            const { quantity, note } = data;
            await db.execute(
                'UPDATE orders SET quantity = ?, note = ? WHERE id = ?',
                [quantity, note, orderId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    },

    deleteOrder: async (orderId) => {
        try {
            await db.execute(
                'DELETE FROM orders WHERE id = ?',
                [orderId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    },

    exportOrder: async (orderId) => {
        try {
            const [order] = await db.execute(`
                SELECT 
                    o.*,
                    p.name as product_name,
                    t.table_number
                FROM orders o
                LEFT JOIN products p ON o.product_id = p.id
                LEFT JOIN tables t ON o.table_id = t.id
                WHERE o.id = ?
            `, [orderId]);
            
            return order[0];
        } catch (error) {
            throw error;
        }
    },

    setOrderCompleted: async (orderId) => {
        try {
            await db.execute(
                'UPDATE orders SET status = ? WHERE id = ?',
                ['completed', orderId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    },

    setOrderPending: async (orderId) => {
        try {
            await db.execute(
                'UPDATE orders SET status = ? WHERE id = ?',
                ['pending', orderId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = orderModel;