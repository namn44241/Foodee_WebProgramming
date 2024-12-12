import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function CartTable({ cartItems, setCartItems }) {
  const calculateToppingTotal = (toppings) => {
    try {
      if (!toppings) return 0;
      
      const toppingArray = typeof toppings === 'string' ? JSON.parse(toppings) : toppings;
      
      if (!Array.isArray(toppingArray)) return 0;
      
      return toppingArray.reduce((total, topping) => {
        const price = parseFloat(topping.price_adjustment || topping.price || 0);
        return total + price;
      }, 0);
    } catch (error) {
      console.error('Error calculating topping total:', error);
      return 0;
    }
  };

  const calculateItemTotal = (item) => {
    const basePrice = Number(item.base_price) || 0;
    const toppingTotal = calculateToppingTotal(item.order_toppings);
    const quantity = Number(item.quantity) || 0;
    return (basePrice + toppingTotal) * quantity;
  };

  const handleQuantityChange = async (orderId, quantity) => {
    try {
      const newQuantity = parseInt(quantity) || 1;
      
      await axios.put('http://localhost:5001/api/cart/update', {
        orderId,
        quantity: newQuantity
      });
      
      const updatedItems = cartItems.map(item => {
        if (item.id === orderId) {
          const baseTotal = Number(item.base_price) || 0;
          const toppingTotal = calculateToppingTotal(item.order_toppings);
          return { 
            ...item, 
            quantity: newQuantity,
            total_price: (baseTotal + toppingTotal) * newQuantity
          };
        }
        return item;
      });
      
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5001/api/cart/item/${orderId}`);
      setCartItems(cartItems.filter(item => item.id !== orderId));
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa sản phẩm',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <div className="cart-table-wrap">
      <table className="cart-table">
        <thead className="cart-table-head">
          <tr className="table-head-row">
            <th className="product-remove"></th>
            <th className="product-image">Hình ảnh</th>
            <th className="product-name">Tên món</th>
            <th className="product-price">Đơn giá</th>
            <th className="product-quantity">Số lượng</th>
            <th className="product-total">Tổng</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => {
            let toppings = [];
            try {
              toppings = typeof item.order_toppings === 'string' 
                ? JSON.parse(item.order_toppings) 
                : (Array.isArray(item.order_toppings) ? item.order_toppings : []);
            } catch (e) {
              console.error('Error parsing toppings:', e);
            }

            const basePrice = Number(item.base_price) || 0;
            const toppingTotal = calculateToppingTotal(item.order_toppings);
            const unitPrice = basePrice + toppingTotal;

            console.log('Raw toppings data:', item.toppings);

            return (
              <tr key={item.id} className="table-body-row">
                <td className="product-remove">
                  <button onClick={() => handleRemoveItem(item.id)}>
                    <i className="far fa-window-close"></i>
                  </button>
                </td>
                <td className="product-image">
                  <img 
                    src={`http://localhost:5001/uploads/products/${item.image_name}`} 
                    alt={item.name} 
                  />
                </td>
                <td className="product-name">
                  {item.name}
                  {toppings.length > 0 && (
                    <div className="product-toppings">
                      <small>
                        Toppings: {toppings.map(t => {
                          const price = Number(t.price) || 0;
                          return `${t.name} (+${price.toLocaleString('vi-VN')}đ)`;
                        }).join(', ')}
                      </small>
                    </div>
                  )}
                </td>
                <td className="product-price">
                  {unitPrice.toLocaleString('vi-VN')}đ
                </td>
                <td className="product-quantity">
                  <input 
                    type="number" 
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  />
                </td>
                <td className="product-total">
                  {calculateItemTotal(item).toLocaleString('vi-VN')}đ
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CartTable;