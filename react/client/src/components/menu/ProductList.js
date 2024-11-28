import React from 'react';
import ProductItem from './ProductItem';

function ProductList({ filter }) {
  // Giả lập dữ liệu sản phẩm, sau này sẽ lấy từ API
  const products = [
    {
      id: 1,
      name: 'Strawberry',
      price: 85,
      category: 'strawberry',
      image: 'assets/img/products/product-img-1.jpg'
    },
    // Thêm các sản phẩm khác...
  ];

  const filteredProducts = filter === '*' 
    ? products 
    : products.filter(product => product.category === filter);

  return (
    <div className="row product-lists">
      {filteredProducts.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;