import React from 'react';
import BreadcrumbSection from '../about/BreadcrumbSection';  // Sửa đường dẫn
import CartTable from './CartTable';
import CartTotal from './CartTotal';
import LogoCarousel from '../home/LogoCarousel';  // Sửa đường dẫn

function Cart() {
  return (
    <>
      <BreadcrumbSection 
        title="Cart" 
        subtitle="Sạch & Tươi ngon"
      />

      <div className="cart-section mt-150 mb-150">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12">
              <CartTable />
            </div>
            <div className="col-lg-4">
              <CartTotal />
            </div>
          </div>
        </div>
      </div>

      <LogoCarousel />
    </>
  );
}

export default Cart;