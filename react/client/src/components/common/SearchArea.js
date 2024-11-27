// src/components/common/SearchArea.js
import React, { useEffect } from 'react';

function SearchArea() {
  useEffect(() => {
    // Khởi tạo sự kiện cho search popup nếu jQuery đã sẵn sàng
    if (window.jQuery) {
      // Mở search popup
      window.jQuery('.search-bar-icon').on('click', function(e) {
        e.preventDefault();
        window.jQuery('.search-area').addClass('search-active');
      });

      // Đóng search popup
      window.jQuery('.close-btn').on('click', function() {
        window.jQuery('.search-area').removeClass('search-active');
      });

      // Đóng khi click ra ngoài
      window.jQuery(document).on('click', function(e) {
        if (!window.jQuery(e.target).closest('.search-bar-tablecell, .search-bar-icon').length) {
          window.jQuery('.search-area').removeClass('search-active');
        }
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic tìm kiếm ở đây
    console.log('Đang tìm kiếm...');
  };

  return (
    <div className="search-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <span className="close-btn">
              <i className="fas fa-window-close"></i>
            </span>
            <div className="search-bar">
              <div className="search-bar-tablecell">
                <h3>Tìm kiếm:</h3>
                <form onSubmit={handleSubmit}>
                  <input 
                    type="text" 
                    placeholder="Nhập từ khóa..." 
                    aria-label="Search input"
                  />
                  <button type="submit">
                    Tìm kiếm <i className="fas fa-search"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchArea;