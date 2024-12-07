import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AdminProducts.css';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
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
    const [allOptions, setAllOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [showOptionModal, setShowOptionModal] = useState(false);
    const [newOption, setNewOption] = useState({ name: '', price_adjustment: 0 });

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

    useEffect(() => {
        const fetchAllOptions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/product-options/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setAllOptions(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };
        fetchAllOptions();
    }, []);

    useEffect(() => {
        const fetchProductToppings = async (productId) => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5001/api/product-options/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setSelectedToppings(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching product toppings:', error);
            }
        };

        if (formData.id) {
            fetchProductToppings(formData.id);
        }
    }, [formData.id]);

    const handleEdit = async (product) => {
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
    
        // Load product options
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5001/api/product-options/${product.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setProductOptions(response.data.data);
            }
        } catch (error) {
            console.error('Error loading product options:', error);
            Swal.fire('Lỗi', 'Không thể tải tùy chọn sản phẩm', 'error');
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
            
            Object.keys(formData).forEach(key => {
                if (key !== 'image' || formData[key] !== null) {
                    formDataToSend.append(key, formData[key]);
                }
            });
    
            let productId;
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
                productId = formData.id;
            } else {
                // Thêm sản phẩm mới
                const response = await axios.post(
                    'http://localhost:5001/api/products', 
                    formDataToSend,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                productId = response.data.data.id;
            }
    
            // Lưu các tùy chọn
            await axios.delete(`http://localhost:5001/api/product-options/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            for (const option of productOptions) {
                if (option.name && option.price_adjustment) {
                    await axios.post('http://localhost:5001/api/product-options', {
                        product_id: productId,
                        name: option.name,
                        price_adjustment: option.price_adjustment
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }
            }
    
            Swal.fire('Thành công', 'Lưu sản phẩm thành công', 'success');
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
        }, 500); 
    };
    const handleAddOption = () => {
        setProductOptions([...productOptions, { name: '', price_adjustment: 0 }]);
    };
    
    const handleOptionChange = (index, field, value) => {
        const newOptions = [...productOptions];
        newOptions[index][field] = value;
        setProductOptions(newOptions);
    };
    
    const handleRemoveOption = (index) => {
        const newOptions = productOptions.filter((_, i) => i !== index);
        setProductOptions(newOptions);
    };

    const handleOptionSelect = (optionId) => {
        const option = allOptions.find(opt => opt.id === optionId);
        if (!selectedOptions.find(opt => opt.id === optionId)) {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const handleRemoveSelectedOption = (optionId) => {
        setSelectedOptions(selectedOptions.filter(opt => opt.id !== optionId));
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleAddNewOption = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5001/api/product-options/create',
                newOption,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                // Cập nhật danh sách options
                setAllOptions([...allOptions, response.data.data]);
                // Reset form và đóng modal
                setNewOption({ name: '', price_adjustment: 0 });
                setShowOptionModal(false);
                Swal.fire('Thành công', 'Thêm tùy chọn mới thành công', 'success');
            }
        } catch (error) {
            console.error('Error adding new option:', error);
            Swal.fire('Lỗi', 'Không thể thêm tùy chọn mới', 'error');
        }
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
                            <div className="form-group">
                                <label>Tùy chọn sản phẩm</label>
                                <div className="options-container">
                                    <div className="options-header">
                                        <h4>Toppings và Size có sẵn</h4>
                                        <button 
                                            type="button" 
                                            className="add-option-btn"
                                            onClick={() => setShowOptionModal(true)}
                                        >
                                            <i className="fas fa-plus"></i> Thêm tùy chọn mới
                                        </button>
                                    </div>

                                    <div className="options-grid">
                                        {allOptions.map(option => (
                                            <div key={option.id} className="option-card">
                                                <div className="option-card-content">
                                                    <span className="option-name">{option.name}</span>
                                                    <span className="option-price">
                                                        +{new Intl.NumberFormat('vi-VN').format(option.price_adjustment)} đ
                                                    </span>
                                                </div>
                                                <label className="option-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedToppings.some(t => t.id === option.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedToppings([...selectedToppings, option]);
                                                            } else {
                                                                setSelectedToppings(selectedToppings.filter(t => t.id !== option.id));
                                                            }
                                                        }}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="selected-options-summary">
                                        <h4>Tùy chọn đã chọn:</h4>
                                        <div className="selected-options-list">
                                            {selectedToppings.map(option => (
                                                <div key={option.id} className="selected-option-tag">
                                                    {option.name}
                                                    <button 
                                                        type="button"
                                                        onClick={() => setSelectedToppings(
                                                            selectedToppings.filter(t => t.id !== option.id)
                                                        )}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
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

            {showOptionModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Thêm tùy chọn mới</h3>
                        <div className="form-group">
                            <label>Tên tùy chọn</label>
                            <input
                                type="text"
                                value={newOption.name}
                                onChange={(e) => setNewOption({...newOption, name: e.target.value})}
                                placeholder="Nhập tên tùy chọn"
                            />
                        </div>
                        <div className="form-group">
                            <label>Giá</label>
                            <input
                                type="number"
                                value={newOption.price_adjustment}
                                onChange={(e) => setNewOption({...newOption, price_adjustment: Number(e.target.value)})}
                                placeholder="Nhập giá"
                            />
                        </div>
                        <div className="modal-buttons">
                            <button 
                                type="button" 
                                className="submit-btn"
                                onClick={handleAddNewOption}
                            >
                                Thêm
                            </button>
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={() => {
                                    setShowOptionModal(false);
                                    setNewOption({ name: '', price_adjustment: 0 });
                                }}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;