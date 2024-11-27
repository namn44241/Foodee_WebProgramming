// src/components/layout/Header.js
import React, { useEffect } from 'react';

function Header() {
  useEffect(() => {
    const initHeader = () => {
      if (window.jQuery) {
        // Khởi tạo mean menu cho mobile
        window.jQuery('.main-menu').meanmenu({
          meanMenuContainer: '.mobile-menu',
          meanScreenWidth: "992"
        });

        // Khởi tạo sticky header
        window.jQuery(window).on('scroll', function() {
          if (window.jQuery(window).scrollTop() > 200) {
            window.jQuery('#sticker').addClass('stick');
          } else {
            window.jQuery('#sticker').removeClass('stick');
          }
        });

        // Khởi tạo search popup
        window.jQuery('.search-bar-icon').on('click', function() {
          window.jQuery('.search-area').addClass('search-active');
        });
      } else {
        setTimeout(initHeader, 100);
      }
    };

    initHeader();
  }, []);

  return (
    <div className="top-header-area" id="sticker">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-sm-12 text-center">
            <div className="main-menu-wrap">
              <div className="site-logo">
                <a href="index.html">
                  <img src="assets/img/logo.png" alt="" />
                </a>
              </div>
              <nav className="main-menu">
                <ul>
                  <li className="current-list-item"><a href="index.html">Trang chủ</a></li>
                  <li><a href="about.html">Về chúng tôi</a></li>						
                  <li><a href="contact.html">Thông tin liên hệ</a></li>
                  <li><a href="shop.html">Menu</a></li>
                  <li>
                    <div className="header-icons">
                      <a className="shopping-cart" href="cart.html"><i className="fas fa-shopping-cart"></i></a>
                      <a className="mobile-hide search-bar-icon" href="#"><i className="fas fa-search"></i></a>
                    </div>
                  </li>
                </ul>
              </nav>
              <a className="mobile-show search-bar-icon" href="#"><i className="fas fa-search"></i></a>
              <div className="mobile-menu"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;