// src/components/home/CartBanner.js
import React from 'react';

function CartBanner() {
  return (
    <section className="cart-banner pt-100 pb-100">
      <div className="container">
        <div className="row clearfix">
          {/* Image Column */}
          <div className="image-column col-lg-6">
            <div className="image">
              <div className="price-box">
                <div className="inner-price">
                  <span className="price">
                    <strong>-30%</strong> <br /> cho 01 cốc
                  </span>
                </div>
              </div>
              <img src="assets/img/a.jpg" alt="" />
            </div>
          </div>

          {/* Content Column */}
          <div className="content-column col-lg-6">
            <h3 className="promo-text">
              Đồ uống ngon <br />
              <span className="orange-text">Giảm giá mạnh</span>
            </h3>
            <h4>Trà sữa dâu</h4>
            <div className="text">
              Trà sữa dâu là sự hòa quyện hoàn hảo giữa vị ngọt dịu của trà sữa béo thơm 
              và hương dâu tươi mát, từng ngụm như một làn gió mát lành mang theo chút 
              ngọt ngào tan chảy nơi đầu lưỡi, khiến bạn khó lòng cưỡng lại.
            </div>

            {/* Countdown Timer */}
            <div className="time-counter">
              <div className="time-countdown clearfix" data-countdown="2020/2/01">
                <div className="counter-column">
                  <div className="inner">
                    <span className="count">00</span>Ngày
                  </div>
                </div>
                <div className="counter-column">
                  <div className="inner">
                    <span className="count">00</span>Giờ
                  </div>
                </div>
                <div className="counter-column">
                  <div className="inner">
                    <span className="count">00</span>Phút
                  </div>
                </div>
                <div className="counter-column">
                  <div className="inner">
                    <span className="count">00</span>Giây
                  </div>
                </div>
              </div>
            </div>

            <a href="cart" className="cart-btn mt-3">
              <i className="fas fa-shopping-cart"></i> Thêm vào Giỏ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CartBanner;