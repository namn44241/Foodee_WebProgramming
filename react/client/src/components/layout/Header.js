// src/components/layout/Header.js
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Header() {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        // Giảm ngưỡng xuống 50px để header dính nhanh hơn
        if (window.scrollY > 50) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  return (
    <div className={`top-header-area ${isSticky ? 'stick' : ''}`}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-sm-12 text-center">
            <div className="main-menu-wrap">
              <div className="site-logo">
                <Link to="/">
                  <img src="assets/img/logo.png" alt="" />
                </Link>
              </div>
              <nav className="main-menu">
                <ul>
                  <li><NavLink to="/" className={({isActive}) => isActive ? "current-list-item" : ""}>
                    Trang chủ
                  </NavLink></li>
                  <li><NavLink to="/about" className={({isActive}) => isActive ? "current-list-item" : ""}>
                    Về chúng tôi
                  </NavLink></li>						
                  <li><NavLink to="/contact" className={({isActive}) => isActive ? "current-list-item" : ""}>
                    Thông tin liên hệ
                  </NavLink></li>
                  <li><NavLink to="/menu" className={({isActive}) => isActive ? "current-list-item" : ""}>
                    Menu
                  </NavLink></li>
                  <li>
                    <div className="header-icons">
                      <Link className="shopping-cart" to="/cart">
                        <i className="fas fa-shopping-cart"></i>
                      </Link>
                      <a className="mobile-hide search-bar-icon" href="#">
                        <i className="fas fa-search"></i>
                      </a>
                    </div>
                  </li>
                </ul>
              </nav>
              <a className="mobile-show search-bar-icon" href="#">
                <i className="fas fa-search"></i>
              </a>
              <div className="mobile-menu"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;