import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Import các components
import Loader from './components/common/Loader.js';
import Header from './components/layout/Header.js';
import SearchArea from './components/common/SearchArea.js';
import Home from './components/home/Home.js';
import About from './components/about/About.js';
import Footer from './components/layout/Footer.js';

function App() {
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  // Effect cho việc khởi tạo plugins
  useEffect(() => {
    const initPlugins = () => {
      if (window.jQuery) {
        window.jQuery('.main-menu').meanmenu({
          meanMenuContainer: '.mobile-menu',
          meanScreenWidth: "992"
        });
        
        setLoading(false);
      } else {
        setTimeout(initPlugins, 100);
      }
    };

    initPlugins();
  }, []);

  // Effect cho việc xử lý chuyển trang
  useEffect(() => {
    if (!loading) { // Chỉ xử lý khi không phải lần load đầu tiên
      setIsNavigating(true);
      window.scrollTo(0, 0);
      
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, loading]);

  return (
    <div>
      {(loading || isNavigating) && <Loader />}
      <div className={!loading && !isNavigating ? 'content-wrapper' : ''}>
        {!loading && !isNavigating && (
          <>
            <Header />
            <SearchArea />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
            </Routes>
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}

export default App;