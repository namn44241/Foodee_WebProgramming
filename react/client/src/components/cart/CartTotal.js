import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CartTotal() {
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    shipping: 45000, // Phí ship cố định
    total: 0
  });
  const tableId = 1; // Tạm thời hard-code tableId = 1

  useEffect(() => {
    fetchCartSummary();
  }, []);

  const fetchCartSummary = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/cart/${tableId}`);
      if (response.data.success) {
        const items = response.data.data;
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCartSummary({
          subtotal,
          shipping: 45000,
          total: subtotal + 45000
        });
      }
    } catch (error) {
      console.error('Error fetching cart summary:', error);
    }
  };

  return (
    <>
      <div className="total-section">
        <table className="total-table">
          <thead className="total-table-head">
            <tr className="table-total-row">
              <th>Tổng cộng</th>
              <th>Giá tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr className="total-data">
              <td><strong>Tạm tính: </strong></td>
              <td>{cartSummary.subtotal.toLocaleString('vi-VN')}đ</td>
            </tr>
            <tr className="total-data">
              <td><strong>Phí giao hàng: </strong></td>
              <td>{cartSummary.shipping.toLocaleString('vi-VN')}đ</td>
            </tr>
            <tr className="total-data">
              <td><strong>Tổng cộng: </strong></td>
              <td>{cartSummary.total.toLocaleString('vi-VN')}đ</td>
            </tr>
          </tbody>
        </table>
        <div className="cart-buttons">
          <Link to="/cart" className="boxed-btn">Cập nhật giỏ hàng</Link>
          <Link to="/checkout" className="boxed-btn black">Thanh toán</Link>
        </div>
      </div>

      <div className="coupon-section">
        <h3>Mã giảm giá</h3>
        <div className="coupon-form-wrap">
          <form>
            <p><input type="text" placeholder="Nhập mã giảm giá" /></p>
            <p><input type="submit" value="Áp dụng" /></p>
          </form>
        </div>
      </div>
    </>
  );
}

export default CartTotal;