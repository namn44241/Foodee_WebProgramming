import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ToppingModal({ product, onClose, onSave }) {
  const [toppings, setToppings] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);

  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/products/check-toppings/${product.id}`);
        setToppings(response.data.toppings);
      } catch (error) {
        console.error('Lỗi khi lấy topping:', error);
      }
    };
    fetchToppings();
  }, [product.id]);

  return (
    <div className="topping-modal">
      <div className="modal-content">
        <h3>Chọn Topping cho {product.name}</h3>
        
        <div className="toppings-list">
          {toppings.map(topping => (
            <div key={topping.id} className="topping-item">
              <input
                type="checkbox"
                id={`topping-${topping.id}`}
                checked={selectedToppings.includes(topping.id)}
                onChange={() => {
                  setSelectedToppings(prev => {
                    if (prev.includes(topping.id)) {
                      return prev.filter(id => id !== topping.id);
                    }
                    return [...prev, topping.id];
                  });
                }}
              />
              <label htmlFor={`topping-${topping.id}`}>
                {topping.name} - {topping.price}đ
              </label>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button 
            className="save-btn"
            onClick={() => onSave(product.id, selectedToppings)}
          >
            Lưu
          </button>
          <button 
            className="cancel-btn"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToppingModal;