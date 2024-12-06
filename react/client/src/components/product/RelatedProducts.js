import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function RelatedProducts() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Giả sử API trả về các sản phẩm cùng danh mục
        const response = await axios.get(`http://localhost:5001/api/products/related/${id}`);
        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
        setError('Không thể tải sản phẩm liên quan');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [id]);

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;
  if (products.length === 0) return null;

  return (
    <div className="more-products mb-150">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2 text-center">
            <div className="section-title">	
              <h3><span className="orange-text">Sản phẩm</span> Liên quan</h3>
              <p>Các sản phẩm cùng danh mục có thể bạn quan tâm</p>
            </div>
          </div>
        </div>
        <div className="row">
          {products.map(product => (
            <div key={product.id} className="col-lg-4 col-md-6 text-center">
              <div className="single-product-item">
                <div className="product-image">
                  <img 
                    src={`http://localhost:5001/uploads/products/${product.image_name}`}
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/img/products/default-product.jpg';
                    }}
                  />
                </div>
                <h3>{product.name}</h3>
                <p className="product-price">
                  <span> </span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </p>
                <Link to={`/product/${product.id}`} className="cart-btn">
                  <i className="fas fa-shopping-cart"></i> Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RelatedProducts;