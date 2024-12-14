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
    <div className="topping-modal-overlay">
      <div className="topping-modal">
        <h3>{product.name}</h3>
        <div className="quantity-selector">
          <label>Số lượng:</label>
          <div className="quantity-controls">
            <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>

        {toppings.length > 0 && (
          <div className="toppings-section">
            <h4>Tùy chọn thêm:</h4>
            <div className="toppings-grid">
              {toppings.map(topping => (
                <div 
                  key={topping.id} 
                  className={`topping-item ${selectedToppings.some(t => t.id === topping.id) ? 'selected' : ''}`}
                  onClick={() => handleToppingToggle(topping)}
                >
                  <span>{topping.name}</span>
                  <span>+{new Intl.NumberFormat('vi-VN').format(topping.price_adjustment)}đ</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="total-section">
          <span>Tổng cộng:</span>
          <span className="total-price">
            {new Intl.NumberFormat('vi-VN').format(calculateTotal())}đ
          </span>
        </div>

        <div className="modal-buttons">
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