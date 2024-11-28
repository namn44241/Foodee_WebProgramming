import React from 'react';

function CheckoutForm() {
  return (
    <div className="checkout-accordion-wrap">
      <div className="accordion" id="accordionExample">
        <div className="card single-accordion">
          <div className="card-header" id="headingOne">
            <h5 className="mb-0">
              <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Billing Address
              </button>
            </h5>
          </div>

          <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
            <div className="card-body">
              <div className="billing-address-form">
                <form action="index.html">
                  <p><input type="text" placeholder="Name" /></p>
                  <p><input type="email" placeholder="Email" /></p>
                  <p><input type="text" placeholder="Address" /></p>
                  <p><input type="tel" placeholder="Phone" /></p>
                  <p><textarea name="bill" id="bill" cols="30" rows="10" placeholder="Say Something"></textarea></p>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address Section */}
        <div className="card single-accordion">
          <div className="card-header" id="headingTwo">
            <h5 className="mb-0">
              <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Shipping Address
              </button>
            </h5>
          </div>
          <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
            <div className="card-body">
              <div className="shipping-address-form">
                <p>Your shipping address form is here.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Details Section */}
        <div className="card single-accordion">
          <div className="card-header" id="headingThree">
            <h5 className="mb-0">
              <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                Card Details
              </button>
            </h5>
          </div>
          <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
            <div className="card-body">
              <div className="card-details">
                <p>Your card details goes here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutForm;