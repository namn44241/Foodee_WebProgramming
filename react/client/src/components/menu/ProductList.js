import React from 'react';
import ProductItem from './ProductItem';

function ProductList({ filter }) {
  // Dữ liệu mẫu cho 6 sản phẩm
  const products = [
    {
      id: 1,
      name: 'Strawberry',
      price: 85,
      category: 'strawberry',
      image: 'assets/img/products/product-img-1.jpg'
    },
    {
      id: 2,
      name: 'Berry',
      price: 70,
      category: 'berry', 
      image: 'assets/img/products/product-img-2.jpg'
    },
    {
      id: 3,
      name: 'Lemon',
      price: 35,
      category: 'lemon',
      image: 'assets/img/products/product-img-3.jpg'
    },
    {
      id: 4,
      name: 'Avocado',
      price: 50,
      category: 'avocado',
      image: 'assets/img/products/product-img-4.jpg'
    },
    {
      id: 5,
      name: 'Green Apple',
      price: 45,
      category: 'apple',
      image: 'assets/img/products/product-img-5.jpg'
    },
    {
      id: 6,
      name: 'Strawberry',
      price: 80,
      category: 'strawberry',
      image: 'assets/img/products/product-img-6.jpg'
    }
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