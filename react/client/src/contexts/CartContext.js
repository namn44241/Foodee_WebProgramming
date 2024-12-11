import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const addToCart = async (tableId, productId, quantity, toppings = [], note = '') => {
    try {
      await axios.post('http://localhost:5001/api/cart/add', {
        tableId,
        productId,
        quantity,
        toppings,
        note
      });

      // Refresh cart data
      const response = await axios.get(`http://localhost:5001/api/cart/${tableId}`);
      setCartItems(response.data.data);
      
      // Cập nhật số lượng và tổng tiền
      const newCount = response.data.data.reduce((total, item) => total + item.quantity, 0);
      const newTotal = response.data.data.reduce((total, item) => {
        const itemTotal = item.price * item.quantity;
        const toppingTotal = item.toppings?.reduce((t, top) => t + top.price_adjustment * top.quantity, 0) || 0;
        return total + itemTotal + toppingTotal;
      }, 0);

      setCartCount(newCount);
      setTotalAmount(newTotal);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, totalAmount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);