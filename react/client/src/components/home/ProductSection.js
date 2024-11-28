import React from 'react';
import { Link } from 'react-router-dom';

function ProductSection() {
  // Mock data - sau này có thể lấy từ API
  const products = [
    {
      id: 1,
      name: "Strawberry",
      price: 85,
      image: "assets/img/products/product-img-1.jpg",
      category: "fruits"
    },
    {
      id: 2,
      name: "Berry",
      price: 70,
      image: "assets/img/products/product-img-2.jpg",
      category: "fruits"
    },
    {
      id: 3,
      name: "Lemon",
      price: 35,
      image: "assets/img/products/product-img-3.jpg",
      category: "fruits"
    }
  ];

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
          {products.map(product => (
            <div key={product.id} className="col-lg-4 col-md-6 text-center">
              <div className="single-product-item">
                <div className="product-image">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                </div>
                <h3>{product.name}</h3>
                <p className="product-price">
                  <span>Per Kg</span> {product.price}$
                </p>
                <Link to="/cart" className="cart-btn">
                  <i className="fas fa-shopping-cart"></i> Thêm vào Giỏ
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductSection;