import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  // Mock data - sau này sẽ lấy từ API dựa vào id
  const product = {
    id: id,
    name: "Green apples have polyphenols",
    price: 50,
    image: "assets/img/products/product-img-5.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta sint dignissimos, rem commodi cum voluptatem quae reprehenderit repudiandae ea tempora incidunt ipsa, quisquam animi perferendis eos eum modi! Tempora, earum.",
    categories: ["Fruits", "Organic"]
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  return (
    <div className="row">
      <div className="col-md-5">
        <div className="single-product-img">
          <img src={product.image} alt={product.name} />
        </div>
      </div>
      <div className="col-md-7">
        <div className="single-product-content">
          <h3>{product.name}</h3>
          <p className="single-product-pricing">
            <span>Per Kg</span> ${product.price}
          </p>
          <p>{product.description}</p>
          <div className="single-product-form">
            <form action="index.html">
              <input 
                type="number" 
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
              />
            </form>
            <Link to="/cart" className="cart-btn">
              <i className="fas fa-shopping-cart"></i> Thêm vào Giỏ
            </Link>
            <p><strong>Categories: </strong>{product.categories.join(", ")}</p>
          </div>
          <h4>Share:</h4>
          <ul className="product-share">
            <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
            <li><a href="#"><i className="fab fa-twitter"></i></a></li>
            <li><a href="#"><i className="fab fa-google-plus-g"></i></a></li>
            <li><a href="#"><i className="fab fa-linkedin"></i></a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;