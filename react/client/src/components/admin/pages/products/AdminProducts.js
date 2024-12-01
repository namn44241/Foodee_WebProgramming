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
        image: null
    });

    // Fetch products và categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/products', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:5001/api/categories', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setProducts(productsRes.data.data);
                setCategories(categoriesRes.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire('Lỗi', 'Không thể tải dữ liệu', 'error');
            }
        };

        fetchData();
    }, []);

    const handleEdit = (product) => {
        setFormData({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            category_id: product.category_id,
            image: null
        });
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
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            await axios.post('http://localhost:5001/api/products', formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            Swal.fire('Thành công', 'Thêm sản phẩm thành công', 'success');
            setShowForm(false);
            // Refresh products list
            const response = await axios.get('http://localhost:5001/api/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error adding product:', error);
            Swal.fire('Lỗi', 'Không thể thêm sản phẩm', 'error');
        }
    };

    // Hàm xử lý đóng form với animation
    const handleCloseForm = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowForm(false);
            setIsClosing(false);
        }, 500); // Thời gian bằng với thời gian animation
    };

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
                                        {categories && categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
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
                                    <input
                                        type="file"
                                        onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                                        accept="image/*"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    required
                                />
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
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img src={product.image_url} alt={product.name} className="product-image" />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.category_name}</td>
                                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
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