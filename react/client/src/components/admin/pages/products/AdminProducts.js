import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AdminProducts.css';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category_id: '',
        image: null,
        is_available: true
    });
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch products và categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const categoriesRes = await axios.get('http://localhost:5001/api/categories/active', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (categoriesRes.data.success) {
                    setCategories(categoriesRes.data.data);
                } else {
                    throw new Error(categoriesRes.data.message);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                Swal.fire('Lỗi', 'Không thể tải danh mục', 'error');
            }
        };

        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const productsRes = await axios.get('http://localhost:5001/api/products', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                console.log('Products Response:', productsRes.data); // Kiểm tra response

                if (productsRes.data.success) {
                    setProducts(productsRes.data.data);
                } else {
                    throw new Error(productsRes.data.message);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                Swal.fire('Lỗi', 'Không thể tải sản phẩm', 'error');
            }
        };

        fetchCategories();
        fetchProducts();
    }, []);

    const handleEdit = (product) => {
        setFormData({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            category_id: product.category_id,
            image: null,
            is_available: product.is_available
        });
        
        if (product.image_name) {
            setImagePreview(`http://localhost:5001/uploads/products/${product.image_name}`);
        } else {
            setImagePreview(null);
        }
        
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Xác nhận xóa?',
                text: "Bạn không thể hoàn tác sau khi xóa!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5001/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Refresh danh sách sản phẩm
                const response = await axios.get('http://localhost:5001/api/products', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(response.data.data);

                Swal.fire(
                    'Đã xóa!',
                    'Sản phẩm đã được xóa thành công.',
                    'success'
                );
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            Swal.fire(
                'Lỗi!',
                'Không thể xóa sản phẩm.',
                'error'
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            
            // Thêm các trường dữ liệu vào FormData
            Object.keys(formData).forEach(key => {
                if (key !== 'image' || formData[key] !== null) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            if (formData.id) {
                // Cập nhật sản phẩm
                await axios.put(
                    `http://localhost:5001/api/products/${formData.id}`, 
                    formDataToSend,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                Swal.fire('Thành công', 'Cập nhật sản phẩm thành công', 'success');
            } else {
                // Thêm sản phẩm mới
                await axios.post(
                    'http://localhost:5001/api/products', 
                    formDataToSend,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                Swal.fire('Thành công', 'Thêm sản phẩm thành công', 'success');
            }

            setShowForm(false);
            // Refresh products list
            const productsResponse = await axios.get('http://localhost:5001/api/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(productsResponse.data.data);
        } catch (error) {
            console.error('Error submitting product:', error);
            Swal.fire('Lỗi', 'Không thể lưu sản phẩm', 'error');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({...formData, image: file});
            // Tạo URL preview cho ảnh
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    // Hàm xử lý đóng form với animation
    const handleCloseForm = () => {
        setIsClosing(true);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
        setTimeout(() => {
            setShowForm(false);
            setIsClosing(false);
            setFormData({
                name: '',
                price: '',
                description: '',
                category_id: '',
                image: null,
                is_available: true
            });
        }, 500); // Thời gian bằng với thời gian animation
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <div className="admin-products">
            <div className="products-header">
                <h2>Quản lý sản phẩm</h2>
                <button 
                    onClick={() => showForm ? handleCloseForm() : setShowForm(true)} 
                    className="add-product-btn"
                >
                    <i className="fas fa-plus"></i> {showForm ? 'Ẩn form' : 'Thêm sản phẩm'}
                </button>
            </div>

            {/* Form thêm sản phẩm */}
            {showForm && (
                <div className={`product-form-container ${isClosing ? 'form-exit' : 'form-enter'}`}>
                    <div className="product-form">
                        <h3>Thêm sản phẩm mới</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tên sản phẩm</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Danh mục</label>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                        required
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories && categories.length > 0 ? (
                                            categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name} {/* Thêm console.log để kiểm tra */}
                                                    {console.log('Rendering category:', category)}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="" disabled>Không có danh mục nào</option>
                                        )}
                                    </select>
                                    {/* Thêm thông báo debug */}
                                    {console.log('Current categories state:', categories)}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Giá</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Hình ảnh</label>
                                    <div className="image-upload-container">
                                        {imagePreview && (
                                            <div className="image-preview">
                                                <img src={imagePreview} alt="Preview" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            required={!formData.id && !imagePreview} // Chỉ bắt buộc khi thêm mới và chưa có ảnh
                                        />
                                        {formData.id && !formData.image && (
                                            <small className="text-muted">
                                                Để trống nếu không muốn thay đổi ảnh
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="form-group">
                                <div className="toggle-container">
                                    <label>Trạng thái sản phẩm</label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_available}
                                            onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                    <span className="toggle-label">
                                        {formData.is_available ? 'Đang bán' : 'Ngừng bán'}
                                    </span>
                                </div>
                            </div>

                            <div className="form-buttons">
                                <button type="submit" className="submit-btn">
                                    <i className="fas fa-save"></i> Lưu
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleCloseForm} 
                                    className="cancel-btn"
                                >
                                    <i className="fas fa-times"></i> Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bảng sản phẩm */}
            <div className="products-table">
                <table>
                    <thead>
                        <tr>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Danh mục</th>
                            <th>Giá</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <div className="table-image-container">
                                        {product.image_name ? (
                                            <img 
                                                src={`http://localhost:5001/uploads/products/${product.image_name}`}
                                                alt={product.name} 
                                                className="product-image"
                                                onError={(e) => {
                                                    console.log('Image load error:', e);
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/80'; // Ảnh placeholder
                                                }}
                                            />
                                        ) : (
                                            <div className="no-image">No Image</div>
                                        )}
                                    </div>
                                </td>
                                <td>{product.name}</td>
                                <td>{product.category_name}</td>
                                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
                                <td>
                                    <span className={`status-tag ${product.is_available ? 'active' : 'inactive'}`}>
                                        {product.is_available ? 'Đang bán' : 'Ngừng bán'}
                                    </span>
                                </td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(product)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminProducts;