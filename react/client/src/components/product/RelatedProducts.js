import React from 'react';
import ProductItem from '../menu/ProductItem';

function RelatedProducts() {
  // Mock data - sau này có thể lấy từ API
  const relatedProducts = [
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
    <div className="more-products mb-150">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2 text-center">
            <div className="section-title">	
              <h3><span className="orange-text">Related</span> Products</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
                 Aliquid, fuga quas itaque eveniet beatae optio.</p>
            </div>
          </div>
        </div>
        <div className="row">
          {relatedProducts.map(product => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RelatedProducts;