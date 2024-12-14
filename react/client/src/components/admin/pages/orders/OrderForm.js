import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import OrderProductCard from './OrderProductCard';
import ToppingModal from './ToppingModal';
import './OrderForm.css';

function OrderForm({ onClose }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showToppingModal, setShowToppingModal] = useState(false);
  const [toppings, setToppings] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [orderItems, setOrderItems] = useState([]);

  // Lấy token từ localStorage
  const token = localStorage.getItem('token');

  // Config cho axios với headers
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/products/public');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      Swal.fire('Lỗi', 'Không thể tải danh sách sản phẩm', 'error');
    }
  };

  const handleProductSelect = async (product) => {
    setSelectedProduct(product);
    try {
      // Thêm config vào request
      const response = await axios.get(
        `http://localhost:5001/api/products/toppings/${product.id}`,
        config
      );
      
      if (response.data.data.hasToppings) {
        setToppings(response.data.data.toppings);
        setShowToppingModal(true);
      } else {
        // Nếu không có topping, thêm trực tiếp vào orderItems
        const newItem = {
          product: product,
          quantity: 1,
          toppings: [],
          total: product.price
        };
        setOrderItems([...orderItems, newItem]);
      }
    } catch (error) {
      console.error('Error fetching toppings:', error);
      Swal.fire('Lỗi', 'Không thể tải thông tin topping', 'error');
    }
  };

  const handleToppingConfirm = (quantity, selectedToppings) => {
    const newItem = {
      product: selectedProduct,
      quantity,
      toppings: selectedToppings,
      total: calculateItemTotal(selectedProduct, quantity, selectedToppings)
    };
    setOrderItems([...orderItems, newItem]);
    setShowToppingModal(false);
  };

  const calculateItemTotal = (product, quantity, toppings) => {
    const toppingTotal = toppings.reduce((sum, t) => sum + t.price_adjustment, 0);
    return (product.price + toppingTotal) * quantity;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tableNumber || orderItems.length === 0) {
      Swal.fire('Lỗi', 'Vui lòng chọn số bàn và ít nhất một món', 'error');
      return;
    }

    try {
      // Gửi từng món một
      for (const item of orderItems) {
        await axios.post('http://localhost:5001/api/orders/add', {
          tableId: tableNumber,
          productId: item.product.id,
          quantity: item.quantity,
          toppings: item.toppings
        });
      }

      Swal.fire('Thành công', 'Đã thêm đơn hàng mới', 'success');
      onClose();
    } catch (error) {
      console.error('Error adding order:', error);
      Swal.fire('Lỗi', 'Không thể thêm đơn hàng', 'error');
    }
  };

  return (
    <div className="order-form">
      <h3>Thêm đơn hàng mới</h3>
      
      <div className="form-group">
        <label>Số bàn</label>
        <input
          type="number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          required
          min="1"
        />
      </div>

      <div className="products-grid">
        {products.map(product => (
          <OrderProductCard
            key={product.id}
            product={product}
            onSelect={handleProductSelect}
          />
        ))}
      </div>

      {orderItems.length > 0 && (
        <div className="selected-items">
          <h4>Món đã chọn:</h4>
          {orderItems.map((item, index) => (
            <div key={index} className="selected-item">
              <span>{item.product.name} x {item.quantity}</span>
              {item.toppings.length > 0 && (
                <div className="item-toppings">
                  {item.toppings.map(t => t.name).join(', ')}
                </div>
              )}
              <span>{new Intl.NumberFormat('vi-VN').format(item.total)}đ</span>
            </div>
          ))}
          <div className="order-total">
            <strong>Tổng cộng: </strong>
            <span>
              {new Intl.NumberFormat('vi-VN').format(
                orderItems.reduce((sum, item) => sum + item.total, 0)
              )}đ
            </span>
          </div>
        </div>
      )}

      <div className="form-buttons">
        <button type="button" className="submit-btn" onClick={handleSubmit}>
          Xác nhận đơn hàng
        </button>
        <button type="button" className="cancel-btn" onClick={onClose}>
          Hủy
        </button>
      </div>

      {showToppingModal && (
        <ToppingModal
          product={selectedProduct}
          toppings={toppings}
          onConfirm={handleToppingConfirm}
          onClose={() => setShowToppingModal(false)}
        />
      )}
    </div>
  );
}

export default OrderForm;