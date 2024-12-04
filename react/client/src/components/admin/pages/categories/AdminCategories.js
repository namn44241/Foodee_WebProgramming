import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AdminCategories.css';

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_active: true
    });

    // Fetch categories
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5001/api/categories', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            Swal.fire('Lỗi', 'Không thể tải danh mục', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            // Log để debug
            console.log('Form data being sent:', formData);
            
            if (formData.id) {
                // Cập nhật danh mục
                const response = await axios.put(
                    `http://localhost:5001/api/categories/${formData.id}`,
                    {
                        name: formData.name,
                        description: formData.description,
                        is_active: formData.is_active
                    },
                    {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                // Log response để debug
                console.log('Update response:', response);
                
                if (!response.data.success) {
                    throw new Error(response.data.message || 'Cập nhật thất bại');
                }
                
                Swal.fire('Thành công', 'Cập nhật danh mục thành công', 'success');
            } else {
                // Thêm danh mục mới
                const response = await axios.post(
                    'http://localhost:5001/api/categories',
                    {
                        name: formData.name,
                        description: formData.description,
                        is_active: formData.is_active
                    },
                    {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                // Log response để debug
                console.log('Create response:', response);
                
                if (!response.data.success) {
                    throw new Error(response.data.message || 'Thêm mới thất bại');
                }
                
                Swal.fire('Thành công', 'Thêm danh mục thành công', 'success');
            }
            
            handleCloseForm();
            await fetchCategories(); // Refresh danh sách sau khi thêm/sửa thành công
            
        } catch (error) {
            console.error('Error submitting category:', error);
            Swal.fire('Lỗi', error.message || 'Không thể lưu danh mục', 'error');
        }
    };

    const handleEdit = (category) => {
        setFormData({
            id: category.id,
            name: category.name,
            description: category.description || '',
            is_active: category.is_active
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
                await axios.delete(`http://localhost:5001/api/categories/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire('Đã xóa!', 'Danh mục đã được xóa thành công.', 'success');
                fetchCategories();
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            Swal.fire('Lỗi!', 'Không thể xóa danh mục, có thể do đã có sản phẩm liên kết.', 'error');
        }
    };

    const handleCloseForm = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowForm(false);
            setIsClosing(false);
            setFormData({ name: '', description: '', is_active: true });
        }, 500);
    };

    return (
        <div className="admin-categories">
            <div className="categories-header">
                <h2>Quản lý danh mục</h2>
                <button 
                    onClick={() => showForm ? handleCloseForm() : setShowForm(true)}
                    className="add-category-btn"
                >
                    <i className="fas fa-plus"></i> {showForm ? 'Ẩn form' : 'Thêm danh mục'}
                </button>
            </div>

            {showForm && (
                <div className={`category-form-container ${isClosing ? 'form-exit' : 'form-enter'}`}>
                    <div className="category-form">
                        <h3>{formData.id ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Tên danh mục</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
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
                                    <label>Trạng thái hoạt động</label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                    <span className="toggle-label">
                                        {formData.is_active ? 'Đang hoạt động' : 'Tạm ngưng'}
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

            <div className="categories-table">
                <table>
                    <thead>
                        <tr>
                            <th>Tên danh mục</th>
                            <th>Mô tả</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td>{category.name}</td>
                                <td>{category.description}</td>
                                <td>
                                    <span className={`status-tag ${category.is_active ? 'active' : 'inactive'}`}>
                                        {category.is_active ? 'Đang hoạt động' : 'Tạm ngưng'}
                                    </span>
                                </td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(category)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(category.id)}>
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

export default AdminCategories; 