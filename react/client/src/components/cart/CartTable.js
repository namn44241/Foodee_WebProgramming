import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function CartTable({ cartItems, setCartItems }) {
  const handleQuantityChange = async (orderId, quantity) => {
    try {
      await axios.put('http://localhost:5001/api/cart/update', {
        orderId,
        quantity: parseInt(quantity)
      });
      
      // Cập nhật state ngay lập tức với giá tiền mới
      const updatedItems = cartItems.map(item => {
        if (item.id === orderId) {
          return { 
            ...item, 
            quantity: parseInt(quantity),
            total_amount: item.price * parseInt(quantity) // Cập nhật tổng tiền của item
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
          {cartItems.map(item => (
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
                {item.order_toppings?.length > 0 && (
                  <div className="product-toppings">
                    <small>Toppings: {item.order_toppings.map(t => t.name).join(', ')}</small>
                  </div>
                )}
              </td>
              <td className="product-price">{item.price.toLocaleString('vi-VN')}đ</td>
              <td className="product-quantity">
                <input 
                  type="number" 
                  value={item.quantity}
                  min="1"
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                />
              </td>
              <td className="product-total">
                {(item.price * item.quantity).toLocaleString('vi-VN')}đ
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CartTable;