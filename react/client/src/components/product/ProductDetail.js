import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/products/public/${id}`);
        if (response.data.success) {
          setProduct(response.data.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Xem sản phẩm ${product.name} tại Foodee`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      default:
        break;
    }
  };

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;
  if (!product) return <div className="text-center">Không tìm thấy sản phẩm</div>;

  return (
    <div className="row">
      <div className="col-md-5">
        <div className="single-product-img">
          <img 
            src={`http://localhost:5001/uploads/products/${product.image_name}`}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/img/products/default-product.jpg';
            }}
          />
        </div>
      </div>
      <div className="col-md-7">
        <div className="single-product-content">
          <h3>{product.name}</h3>
          <p className="single-product-pricing">
            <span>Per Kg</span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </p>
          <p>{product.description}</p>
          <div className="single-product-form">
            <form action="index.html">
              <input 
                type="number" 
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
              />
            </form>
            <Link to="/cart" className="cart-btn">
              <i className="fas fa-shopping-cart"></i> Thêm vào Giỏ
            </Link>
            <p><strong>Danh mục: </strong>{product.category_name}</p>
          </div>
          <h4>Chia sẻ:</h4>
          <ul className="product-share">
            <li>
              <button onClick={() => handleShare('facebook')} className="share-btn">
                <i className="fab fa-facebook-f"></i>
              </button>
            </li>
            <li>
              <button onClick={() => handleShare('twitter')} className="share-btn">
                <i className="fab fa-twitter"></i>
              </button>
            </li>
            <li>
              <button onClick={() => handleShare('linkedin')} className="share-btn">
                <i className="fab fa-linkedin"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;