import React, { useState } from 'react';
import './ToppingModal.css';

function ToppingModal({ product, toppings, onConfirm, onClose }) {
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const handleToppingToggle = (topping) => {
    const exists = selectedToppings.find(t => t.id === topping.id);
    if (exists) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const calculateTotal = () => {
    const toppingTotal = selectedToppings.reduce((sum, t) => sum + t.price_adjustment, 0);
    return (product.price + toppingTotal) * quantity;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{product.name}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="quantity-section">
            <label>Số lượng:</label>
            <div className="quantity-controls">
              <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          {toppings.length > 0 && (
            <div className="topping-section">
              <h4>Tùy chọn thêm:</h4>
              <div className="topping-list">
                {toppings.map(topping => (
                  <div 
                    key={topping.id} 
                    className={`topping-item ${selectedToppings.some(t => t.id === topping.id) ? 'selected' : ''}`}
                    onClick={() => handleToppingToggle(topping)}
                  >
                    <div className="topping-info">
                      <span className="topping-name">{topping.name}</span>
                      <span className="topping-price">+{new Intl.NumberFormat('vi-VN').format(topping.price_adjustment)}đ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="price-summary">
            <div className="base-price">
              <span>Giá gốc:</span>
              <span>{new Intl.NumberFormat('vi-VN').format(product.price)}đ</span>
            </div>
            <div className="total">
              <strong>Tổng cộng:</strong>
              <strong>{new Intl.NumberFormat('vi-VN').format(calculateTotal())}đ</strong>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="confirm-btn" onClick={() => onConfirm(quantity, selectedToppings)}>
            Xác nhận
          </button>
          <button className="cancel-btn" onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

export default ToppingModal;