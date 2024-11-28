import React from 'react';

function OrderSummary() {
  return (
    <div className="order-details-wrap">
      <table className="order-details">
        <thead>
          <tr>
            <th>Your order Details</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody className="order-details-body">
          <tr>
            <td>Product</td>
            <td>Total</td>
          </tr>
          <tr>
            <td>Strawberry</td>
            <td>$85.00</td>
          </tr>
          <tr>
            <td>Berry</td>
            <td>$70.00</td>
          </tr>
          <tr>
            <td>Lemon</td>
            <td>$35.00</td>
          </tr>
        </tbody>
        <tbody className="checkout-details">
          <tr>
            <td>Subtotal</td>
            <td>$190</td>
          </tr>
          <tr>
            <td>Shipping</td>
            <td>$50</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>$240</td>
          </tr>
        </tbody>
      </table>
      <a href="#" className="boxed-btn">Place Order</a>
    </div>
  );
}

export default OrderSummary;