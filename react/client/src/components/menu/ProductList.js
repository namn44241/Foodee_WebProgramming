import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ProductList({ filter }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/products/public');
        if (response.data.success) {
          let filteredProducts = response.data.data;
          
          // Áp dụng filter nếu không phải '*'
          if (filter !== '*') {
            filteredProducts = filteredProducts.filter(product => 
              product.category_id.toString() === filter
            );
          }
          
          setProducts(filteredProducts);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter]);

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <div className="row product-lists">
      {products.map(product => (
        <div key={product.id} className="col-lg-4 col-md-6 text-center">
          <div className="single-product-item">
            <div className="product-image">
              <Link to={`/product/${product.id}`}>
                <img 
                  src={`http://localhost:5001/uploads/products/${product.image_name}`}
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/img/products/default-product.jpg';
                  }}
                />
              </Link>
            </div>
            <h3>{product.name}</h3>
            <p className="product-price">
              <span>Per Kg</span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </p>
            <Link to="/cart" className="cart-btn">
              <i className="fas fa-shopping-cart"></i> Thêm vào Giỏ
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;