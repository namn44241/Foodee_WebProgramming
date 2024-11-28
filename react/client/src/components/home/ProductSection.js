// src/components/home/ProductSection.js
import React from 'react';

function ProductSection() {
  return (
    <div className="product-section mt-150 mb-150">
      <div className="container">
        {/* Title Section */}
        <div className="row">
          <div className="col-lg-8 offset-lg-2 text-center">
            <div className="section-title">	
              <h3><span className="orange-text">Mời bạn</span> Đặt món</h3>
              <p>Món ăn của chúng tôi được chế biến từ những nguyên liệu tươi mới, đảm bảo chất lượng và hương vị ngon miệng.</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="row">
          {/* Product 1 */}
          <div className="col-lg-4 col-md-6 text-center">
            <div className="single-product-item">
              <div className="product-image">
                <a href="single-product">
                  <img src="assets/img/products/product-img-1.jpg" alt="Strawberry" />
                </a>
              </div>
              <h3>Strawberry</h3>
              <p className="product-price"><span>Per Kg</span> 85$ </p>
              <a href="cart" className="cart-btn">
                <i className="fas fa-shopping-cart"></i> Thêm vào Giỏ
              </a>
            </div>
          </div>

          {/* Product 2 */}
          <div className="col-lg-4 col-md-6 text-center">
            <div className="single-product-item">
              <div className="product-image">
                <a href="single-product">
                  <img src="assets/img/products/product-img-2.jpg" alt="Berry" />
                </a>
              </div>
              <h3>Berry</h3>
              <p className="product-price"><span>Per Kg</span> 70$ </p>
              <a href="cart" className="cart-btn">
                <i className="fas fa-shopping-cart"></i> Thêm vào Giỏ
              </a>
            </div>
          </div>

          {/* Product 3 */}
          <div className="col-lg-4 col-md-6 offset-md-3 offset-lg-0 text-center">
            <div className="single-product-item">
              <div className="product-image">
                <a href="single-product">
                  <img src="assets/img/products/product-img-3.jpg" alt="Lemon" />
                </a>
              </div>
              <h3>Lemon</h3>
              <p className="product-price"><span>Per Kg</span> 35$ </p>
              <a href="cart" className="cart-btn">
                <i className="fas fa-shopping-cart"></i> Thêm vào Giỏ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSection;