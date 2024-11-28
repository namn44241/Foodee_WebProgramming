import React from 'react';
import BreadcrumbSection from '../about/BreadcrumbSection';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import LogoCarousel from '../home/LogoCarousel';

function Checkout() {
  return (
    <>
      <BreadcrumbSection 
        title="Check Out Product" 
        subtitle="Sạch & Tươi ngon"
      />

      <div className="checkout-section mt-150 mb-150">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <CheckoutForm />
            </div>
            <div className="col-lg-4">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>

      <LogoCarousel />
    </>
  );
}

export default Checkout;