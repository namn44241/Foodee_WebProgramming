// src/App.js
import React, { useEffect } from 'react';
import './App.css';

// Import các components
import Loader from './components/common/Loader.js';
import Header from './components/layout/Header.js';
import SearchArea from './components/common/SearchArea.js';
import HomeSlider from './components/home/HomeSlider.js';
import FeaturesList from './components/home/FeaturesList.js';
import ProductSection from './components/home/ProductSection.js';
import CartBanner from './components/home/CartBanner.js';
import TestimonialSection from './components/home/TestimonialSection.js';
import LogoCarousel from './components/home/LogoCarousel.js';
import Footer from './components/layout/Footer.js';


function App() {
  useEffect(() => {
    // Khởi tạo các plugins jQuery
    const initPlugins = () => {
      if (window.jQuery) {
        // Các cấu hình carousel đã được chuyển vào các component tương ứng
        
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
      } else {
        setTimeout(initPlugins, 100);
      }
    };

    initPlugins();
  }, []);

  return (
    <div>
      <Loader />
      <Header />
      <SearchArea />
      <HomeSlider />
      <FeaturesList />
      <ProductSection />
      <CartBanner />
      <TestimonialSection />
      <LogoCarousel />
      <Footer />
      {/* Bỏ component Copyright vì đã được gộp vào Footer */}
    </div>
  );
}

export default App;