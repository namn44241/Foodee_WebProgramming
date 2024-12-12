import React from 'react';
import { Link } from 'react-router-dom';

function CartTotal({ cartItems }) {
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
              <td><strong>Tổng tiền: </strong></td>
              <td>{calculateTotal().toLocaleString('vi-VN')}đ</td>
            </tr>
          </tbody>
        </table>
        <div className="cart-buttons">
          <Link to="/menu" className="boxed-btn">Tiếp tục đặt món</Link>
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