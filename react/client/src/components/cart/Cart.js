import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BreadcrumbSection from '../about/CartSection';  
import CartTable from './CartTable';
import CartTotal from './CartTotal';
import LogoCarousel from '../home/LogoCarousel'; 

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const tableId = 1;

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/cart/${tableId}`);
      if (response.data.success) {
        setCartItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <>
      <BreadcrumbSection 
        title="Giỏ hàng" 
        subtitle="Sạch & Tươi ngon"
      />

      <div className="cart-section mt-150 mb-150">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12">
              <CartTable cartItems={cartItems} setCartItems={setCartItems} />
            </div>
            <div className="col-lg-4">
              <CartTotal cartItems={cartItems} />
            </div>
          </div>
        </div>
      </div>

      <LogoCarousel />
    </>
  );
}

export default Cart;