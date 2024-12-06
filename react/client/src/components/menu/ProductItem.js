import React from 'react';
import { Link } from 'react-router-dom';

function ProductItem({ product }) {
  return (
    <div className={`col-lg-4 col-md-6 text-center ${product.category}`}>
      <div className="single-product-item">
        <div className="product-image">
          <Link to={`/product/${product.id}`}>
            <img src={product.image} alt={product.name} />
          </Link>
        </div>
        <h3>{product.name}</h3>
        <p className="product-price">
          <span> </span> {product.price}$
        </p>
        <Link to="/cart" className="cart-btn">
          <i className="fas fa-shopping-cart"></i> Thêm vào Giỏ
        </Link>
      </div>
    </div>
  );
}

export default ProductItem;