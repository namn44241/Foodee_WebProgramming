import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import ToppingModal from '../common/ToppingModal';
import Swal from 'sweetalert2';

function ProductItem({ product }) {
  const [showToppingModal, setShowToppingModal] = useState(false);
  const [toppings, setToppings] = useState([]);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      // Kiểm tra sản phẩm có topping không
      const response = await axios.get(`http://localhost:5001/api/products/toppings/${product.id}`);
      
      if (response.data.data.hasToppings) {
        setToppings(response.data.data.toppings);
        setShowToppingModal(true);
      } else {
        // Thêm trực tiếp vào giỏ nếu không có topping
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image_name: product.image_name
        }, 1);
        
        // Hiển thị thông báo thành công
        Swal.fire({
          icon: 'success',
          title: 'Đã thêm vào giỏ',
          text: 'Sản phẩm đã được thêm vào giỏ hàng',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể thêm sản phẩm vào giỏ hàng'
      });
    }
  };

  const handleToppingConfirm = async (quantity, selectedToppings) => {
    try {
      await addToCart(1, product.id, quantity, selectedToppings);
      
      // Hiển thị thông báo thành công
      Swal.fire({
        icon: 'success',
        title: 'Đã thêm vào giỏ',
        text: 'Sản phẩm đã được thêm vào giỏ hàng',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể thêm sản phẩm vào giỏ hàng'
      });
    }
  };

  return (
    <div className="col-lg-4 col-md-6 text-center">
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
          <span> </span> 
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
        </p>
        <button onClick={handleAddToCart} className="cart-btn">
          <i className="fas fa-shopping-cart"></i> Thêm vào Giỏ
        </button>
      </div>

      <ToppingModal 
        show={showToppingModal}
        onClose={() => setShowToppingModal(false)}
        toppings={toppings}
        onConfirm={handleToppingConfirm}
      />
    </div>
  );
}

export default ProductItem;