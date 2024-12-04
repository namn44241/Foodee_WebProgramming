const db = require('../config/database');
const path = require('path');
const fs = require('fs');

const productController = {
    // Lấy danh sách sản phẩm
    getProducts: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id
                ORDER BY p.created_at DESC
            `);
            
            res.json({
                success: true,
                data: rows
            });
        } catch (error) {
            console.error('Error getting products:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách sản phẩm'
            });
        }
    },

    // Thêm sản phẩm mới
    addProduct: async (req, res) => {
        try {
            const { name, price, description, category_id } = req.body;
            let image_name = null;

            // Kiểm tra file upload
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng chọn ảnh sản phẩm'
                });
            }

            image_name = req.file.filename;

            const [result] = await db.execute(
                'INSERT INTO products (name, price, description, category_id, image_name) VALUES (?, ?, ?, ?, ?)',
                [name, price, description, category_id, image_name]
            );

            // Kiểm tra kết quả insert
            if (result.affectedRows === 0) {
                // Xóa file nếu insert thất bại
                const filePath = path.join(__dirname, '../../public/uploads/products', image_name);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                throw new Error('Không thể thêm sản phẩm vào database');
            }

            res.json({
                success: true,
                message: 'Thêm sản phẩm thành công',
                data: {
                    id: result.insertId,
                    name,
                    price,
                    description,
                    category_id,
                    image_name
                }
            });
        } catch (error) {
            // Xử lý lỗi và xóa file nếu c��
            if (req.file) {
                const filePath = path.join(__dirname, '../../public/uploads/products', req.file.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            console.error('Error adding product:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm sản phẩm: ' + error.message
            });
        }
    },

    // Cập nhật sản phẩm
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, price, description, category_id, is_available } = req.body;
            
            let updateQuery = 'UPDATE products SET name = ?, price = ?, description = ?, category_id = ?, is_available = ?';
            let params = [name, price, description, category_id, is_available === 'true' || is_available === true ? 1 : 0];

            // Nếu có upload ảnh mới
            if (req.file) {
                // Xóa ảnh cũ nếu có
                const [oldProduct] = await db.execute('SELECT image_name FROM products WHERE id = ?', [id]);
                if (oldProduct[0]?.image_name) {
                    const oldImagePath = path.join(__dirname, '../../public/uploads/products', oldProduct[0].image_name);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }

                updateQuery += ', image_name = ?';
                params.push(req.file.filename);
            }

            updateQuery += ' WHERE id = ?';
            params.push(id);

            await db.execute(updateQuery, params);

            res.json({
                success: true,
                message: 'Cập nhật sản phẩm thành công'
            });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật sản phẩm'
            });
        }
    },

    // Xóa sản phẩm (hard delete)
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Lấy thông tin ảnh trước khi xóa
            const [product] = await db.execute(
                'SELECT image_name FROM products WHERE id = ?',
                [id]
            );

            // Xóa sản phẩm khỏi database
            await db.execute(
                'DELETE FROM products WHERE id = ?',
                [id]
            );

            // Xóa file ảnh nếu có
            if (product[0]?.image_name) {
                const imagePath = path.join(__dirname, '../../public/uploads/products', product[0].image_name);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            res.json({
                success: true,
                message: 'Xóa sản phẩm thành công'
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa sản phẩm'
            });
        }
    },

    // Thêm method mới để lấy sản phẩm cho user
    getPublicProducts: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.is_available = 1
                ORDER BY p.created_at DESC
            `);
            
            res.json({
                success: true,
                data: rows
            });
        } catch (error) {
            console.error('Error getting products:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách sản phẩm'
            });
        }
    }
};

module.exports = productController;