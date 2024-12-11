import React, { useState } from 'react';
import './ToppingModal.css';

function ToppingModal({ show, onClose, toppings, onConfirm, product }) {
  console.log('Product in modal:', product);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const handleToppingChange = (topping) => {
    const exists = selectedToppings.find(t => t.id === topping.id);
    if (exists) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, { ...topping, quantity: 1 }]);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Chọn Topping</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="product-info">
            <div className="product-image">
              <img 
                src={`http://localhost:5001/uploads/products/${product?.image_name}`}
                alt={product?.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/img/products/default-product.jpg';
                }}
              />
            </div>
            <div className="product-details">
              <h4>{product?.name}</h4>
              <p className="price">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product?.price)}
              </p>
            </div>
          </div>

          <div className="quantity-section">
            <label>Số lượng:</label>
            <input 
              type="number" 
              min="1" 
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="toppings-list">
            {toppings.map(topping => (
              <div key={topping.id} className="topping-item">
                <div className="topping-checkbox">
                  <input
                    type="checkbox"
                    id={`topping-${topping.id}`}
                    checked={selectedToppings.some(t => t.id === topping.id)}
                    onChange={() => handleToppingChange(topping)}
                  />
                </div>
                <div className="topping-info">
                  <label htmlFor={`topping-${topping.id}`}>
                    {topping.name}
                  </label>
                  <span className="topping-price">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(topping.price_adjustment)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
          <button 
            className="btn-confirm"
            onClick={() => onConfirm(quantity, selectedToppings)}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToppingModal;