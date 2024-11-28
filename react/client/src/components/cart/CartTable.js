import React from 'react';

function CartTable() {
  return (
    <div className="cart-table-wrap">
      <table className="cart-table">
        <thead className="cart-table-head">
          <tr className="table-head-row">
            <th className="product-remove"></th>
            <th className="product-image">Product Image</th>
            <th className="product-name">Name</th>
            <th className="product-price">Price</th>
            <th className="product-quantity">Quantity</th>
            <th className="product-total">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr className="table-body-row">
            <td className="product-remove">
              <a href="#"><i className="far fa-window-close"></i></a>
            </td>
            <td className="product-image">
              <img src="assets/img/products/product-img-1.jpg" alt="" />
            </td>
            <td className="product-name">Strawberry</td>
            <td className="product-price">$85</td>
            <td className="product-quantity">
              <input type="number" placeholder="0" />
            </td>
            <td className="product-total">1</td>
          </tr>
          {/* Thêm các sản phẩm khác tương tự */}
        </tbody>
      </table>
    </div>
  );
}

export default CartTable;