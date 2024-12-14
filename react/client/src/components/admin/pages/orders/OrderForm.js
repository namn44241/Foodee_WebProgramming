import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function OrderForm({ onClose }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [toppings, setToppings] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [tableNumber, setTableNumber] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/products/public');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductSelect = async (product) => {
    setSelectedProduct(product);
    try {
      const response = await axios.get(`http://localhost:5001/api/products/toppings/${product.id}`);
      if (response.data.data.hasToppings) {
        setToppings(response.data.data.toppings);
      } else {
        setToppings([]);
      }
    } catch (error) {
      console.error('Error fetching toppings:', error);
    }
  };

  const handleToppingToggle = (topping) => {
    const exists = selectedToppings.find(t => t.id === topping.id);
    if (exists) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !tableNumber) {
      Swal.fire('Lỗi', 'Vui lòng chọn sản phẩm và số bàn', 'error');
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/orders/add', {
        tableId: tableNumber,
        productId: selectedProduct.id,
        quantity: quantity,
        toppings: selectedToppings
      });

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
      <form onSubmit={handleSubmit}>
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

        <div className="form-group">
          <label>Chọn món</label>
          <select 
            onChange={(e) => handleProductSelect(products.find(p => p.id === parseInt(e.target.value)))}
            required
          >
            <option value="">Chọn món</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - {new Intl.NumberFormat('vi-VN').format(product.price)}đ
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Số lượng</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min="1"
            required
          />
        </div>

        {toppings.length > 0 && (
          <div className="form-group">
            <label>Tùy chọn thêm</label>
            <div className="toppings-list">
              {toppings.map(topping => (
                <div key={topping.id} className="topping-item">
                  <input
                    type="checkbox"
                    id={`topping-${topping.id}`}
                    checked={selectedToppings.some(t => t.id === topping.id)}
                    onChange={() => handleToppingToggle(topping)}
                  />
                  <label htmlFor={`topping-${topping.id}`}>
                    {topping.name} (+{new Intl.NumberFormat('vi-VN').format(topping.price_adjustment)}đ)
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-buttons">
          <button type="submit" className="submit-btn">Thêm đơn</button>
          <button type="button" className="cancel-btn" onClick={onClose}>Hủy</button>
        </div>
      </form>
    </div>
  );
}

export default OrderForm;