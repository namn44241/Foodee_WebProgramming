import React from 'react';

function CartTotal() {
  return (
    <>
      <div className="total-section">
        <table className="total-table">
          <thead className="total-table-head">
            <tr className="table-total-row">
              <th>Total</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="total-data">
              <td><strong>Subtotal: </strong></td>
              <td>$500</td>
            </tr>
            <tr className="total-data">
              <td><strong>Shipping: </strong></td>
              <td>$45</td>
            </tr>
            <tr className="total-data">
              <td><strong>Total: </strong></td>
              <td>$545</td>
            </tr>
          </tbody>
        </table>
        <div className="cart-buttons">
          <a href="cart" className="boxed-btn">Update Cart</a>
          <a href="checkout" className="boxed-btn black">Check Out</a>
        </div>
      </div>

      <div className="coupon-section">
        <h3>Apply Coupon</h3>
        <div className="coupon-form-wrap">
          <form action="index.html">
            <p><input type="text" placeholder="Coupon" /></p>
            <p><input type="submit" value="Apply" /></p>
          </form>
        </div>
      </div>
    </>
  );
}

export default CartTotal;