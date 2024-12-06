import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: '',
        description: '',
        category_id: '',
        image: null,
        is_available: true
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [productOptions, setProductOptions] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/products', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(response.data.data);
            } catch (error) {
                console.error('Error loading products:', error);
            }
        };

        fetchProducts();
    }, []);

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

    return (
        <div>
            {/* Render your products and form here */}
        </div>
    );
};

export default AdminProducts; 