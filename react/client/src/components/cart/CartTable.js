import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useCart } from '../../contexts/CartContext';

function CartTable() {
  const { cartItems, setCartItems } = useCart();

  const calculateToppingTotal = (toppings) => {
    try {
      if (!toppings) return 0;
      
      const toppingArray = typeof toppings === 'string' ? JSON.parse(toppings) : toppings;
      
      if (!Array.isArray(toppingArray)) return 0;
      
      return toppingArray.reduce((total, topping) => {
        const price = parseFloat(topping.price_adjustment || 0);
        return total + price;
      }, 0);
    } catch (error) {
      console.error('Error calculating topping total:', error);
      return 0;
    }
  };

  const calculateItemTotal = (item) => {
    const basePrice = parseFloat(item.price);
    const toppingTotal = calculateToppingTotal(item.toppings);
    const unitPrice = basePrice + toppingTotal;
    return unitPrice * item.quantity;
  };

  const consolidateItems = (items) => {
    const consolidated = {};
    
    items.forEach(item => {
      const toppingsKey = JSON.stringify(item.toppings || []);
      const key = `${item.productId}-${toppingsKey}`;
      
      if (consolidated[key]) {
        consolidated[key].quantity += item.quantity;
      } else {
        consolidated[key] = { ...item };
      }
    });

    return Object.values(consolidated);
  };

  const handleQuantityChange = async (productId, quantity, itemToppings) => {
    try {
      const newQuantity = parseInt(quantity) || 1;
      
      const updatedItems = cartItems.map(item => {
        if (item.productId === productId && 
            JSON.stringify(item.toppings) === JSON.stringify(itemToppings)) {
          return { 
            ...item, 
            quantity: newQuantity
          };
        }
        return item;
      });
      
      setCartItems(consolidateItems(updatedItems));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:5001/api/cart/item/${productId}`);
      setCartItems(cartItems.filter(item => item.productId !== productId));
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
          {consolidateItems(cartItems).map(item => {
            let toppings = item.toppings || [];
            if (typeof toppings === 'string') {
              try {
                toppings = JSON.parse(toppings);
              } catch (e) {
                console.error('Error parsing toppings:', e);
                toppings = [];
              }
            }

            const basePrice = parseFloat(item.price);
            const toppingTotal = calculateToppingTotal(toppings);
            const unitPrice = basePrice + toppingTotal;

            return (
              <tr key={item.productId + JSON.stringify(toppings)} className="table-body-row">
                <td className="product-remove">
                  <button onClick={() => handleRemoveItem(item.productId)}>
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
                          const price = Number(t.price_adjustment) || 0;
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
                    onChange={(e) => handleQuantityChange(item.productId, e.target.value, toppings)}
                  />
                </td>
                <td className="product-total">
                  {(unitPrice * item.quantity).toLocaleString('vi-VN')}đ
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