import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    // Đợi jQuery và các plugin load xong
    const initPlugins = () => {
      if (window.jQuery) {
        // Khởi tạo owl carousel cho slider
        window.jQuery('.homepage-slider').owlCarousel({
          items: 1,
          loop: true,
          nav: true,
          dots: false,
          autoplay: true,
          autoplayTimeout: 5000,
          smartSpeed: 1500,
          navText: ["<i class='fas fa-angle-left'></i>","<i class='fas fa-angle-right'></i>"]
        });

        // Khởi tạo owl carousel cho testimonials
        window.jQuery('.testimonial-sliders').owlCarousel({
          items: 1,
          loop: true,
          nav: false,
          dots: true,
          autoplay: true,
          autoplayTimeout: 6000,
          smartSpeed: 1000
        });

        // Khởi tạo owl carousel cho logo carousel
        window.jQuery('.logo-carousel-inner').owlCarousel({
          items: 5,
          loop: true,
          autoplay: true,
          autoplayTimeout: 5000,
          margin: 30,
          responsive: {
            0: { items: 1 },
            480: { items: 2 },
            768: { items: 3 },
            992: { items: 4 },
            1200: { items: 5 }
          }
        });

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
        window.jQuery('.close-btn').on('click', function() {
          window.jQuery('.search-area').removeClass('search-active');
        });
      } else {
        // Nếu jQuery chưa load xong, đợi thêm 100ms và thử lại
        setTimeout(initPlugins, 100);
      }
    };

    initPlugins();
  }, []);

  return (
        <div>
      
        {/* <!--PreLoader--> */}
          <div className="loader">
              <div className="loader-inner">
                  <div className="circle"></div>
              </div>
          </div>
          {/* <!--PreLoader Ends--> */}
        
        {/* <!-- header --> */}
        <div className="top-header-area" id="sticker">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-sm-12 text-center">
                <div className="main-menu-wrap">
                  {/* <!-- logo --> */} 
                  <div className="site-logo">
                    <a href="index.html">
                      <img src="assets/img/logo.png" alt="" />
                    </a>
                  </div>
                  {/* <!-- logo --> */}

                  {/* <!-- menu start --> */}
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
                  {/* <!-- menu end --> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- end header --> */}
        
        {/* <!-- search area --> */}
        <div className="search-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <span className="close-btn"><i className="fas fa-window-close"></i></span>
                <div className="search-bar">
                  <div className="search-bar-tablecell">
                    <h3>Search For:</h3>
                    <input type="text" placeholder="Keywords" />
                    <button type="submit">Search <i className="fas fa-search"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- end search area --> */}

        {/* <!-- home page slider --> */}
        <div className="homepage-slider">
          {/* <!-- single home slider --> */}
          <div className="single-homepage-slider homepage-bg-1">
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-lg-7 offset-lg-1 offset-xl-0">
                  <div className="hero-text">
                    <div className="hero-text-tablecell">
                      <p className="subtitle">Sạch & Tươi ngon</p>
                      <h1>Mừng Bạn Đã Tới Nhà Hàng </h1>
                      <div className="hero-btns">
                        <a href="shop.html" className="boxed-btn">Đặt món</a>
                        <a href="contact.html" className="bordered-btn">Cần trợ giúp?</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- single home slider --> */}
          <div className="single-homepage-slider homepage-bg-2">
            <div className="container">
              <div className="row">
                <div className="col-lg-10 offset-lg-1 text-center">
                  <div className="hero-text">
                    <div className="hero-text-tablecell">
                      <p className="subtitle">Giảm Giá Sốc Tháng 12</p>
                      <h1>Chuẩn "Cơm Mẹ Nấu" Với Các Đầu Bếp Hàng Đầu</h1>
                      <div className="hero-btns">
                        <a href="shop.html" className="boxed-btn">Đặt món</a>
                        <a href="contact.html" className="bordered-btn">Cần trợ giúp?</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- single home slider --> */}
          <div className="single-homepage-slider homepage-bg-3">
            <div className="container">
              <div className="row">
                <div className="col-lg-10 offset-lg-1 text-right">
                  <div className="hero-text">
                    <div className="hero-text-tablecell">
                      <p className="subtitle">Tươi mới - Mỗi ngày</p>
                      <h1>100% Nguyên Liệu Chuẩn OCOP 4 Sao</h1>
                      <div className="hero-btns">
                        <a href="shop.html" className="boxed-btn">Đặt món</a>
                        <a href="contact.html" className="bordered-btn">Cần trợ giúp?</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- end home page slider --> */}

        {/* <!-- features list section --> */}
        <div className="list-section pt-80 pb-80">
          <div className="container">

            <div className="row">
              <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                <div className="list-box d-flex align-items-center">
                  <div className="list-icon">
                    <i className="fas fa-shipping-fast"></i>
                  </div>
                  <div className="content">
                    <h3>Không lo "Bê - Vác"</h3>
                    <p>Đặt trực tuyến - Phục vụ trực tiếp</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                <div className="list-box d-flex align-items-center">
                  <div className="list-icon">
                    <i className="fas fa-phone-volume"></i>
                  </div>
                  <div className="content">
                    <h3>Không cần nghĩ ngợi</h3>
                    <p>Đội ngũ chuyên nghiệp, nhanh gọn</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="list-box d-flex justify-content-start align-items-center">
                  <div className="list-icon">
                    <i className="fas fa-sync"></i>
                  </div>
                  <div className="content">
                    <h3>Không lo về giá</h3>
                    <p>Ăn không ngon - Không thanh toán</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        {/* <!-- end features list section --> */}

        {/* <!-- product section --> */}
        <div className="product-section mt-150 mb-150">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2 text-center">
                <div className="section-title">	
                  <h3><span className="orange-text">Mời bạn</span> Đặt món</h3>
                  <p>Món ăn của chúng tôi được chế biến từ những nguyên liệu tươi mới, đảm bảo chất lượng và hương vị ngon miệng.</p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-4 col-md-6 text-center">
                <div className="single-product-item">
                  <div className="product-image">
                    <a href="single-product.html"><img src="assets/img/products/product-img-1.jpg" alt="" /></a>
                  </div>
                  <h3>Strawberry</h3>
                  <p className="product-price"><span>Per Kg</span> 85$ </p>
                  <a href="cart.html" className="cart-btn"><i className="fas fa-shopping-cart"></i> Thêm vào Giỏ</a>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 text-center">
                <div className="single-product-item">
                  <div className="product-image">
                    <a href="single-product.html"><img src="assets/img/products/product-img-2.jpg" alt="" /></a>
                  </div>
                  <h3>Berry</h3>
                  <p className="product-price"><span>Per Kg</span> 70$ </p>
                  <a href="cart.html" className="cart-btn"><i className="fas fa-shopping-cart"></i> Thêm vào Giỏ</a>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 offset-md-3 offset-lg-0 text-center">
                <div className="single-product-item">
                  <div className="product-image">
                    <a href="single-product.html"><img src="assets/img/products/product-img-3.jpg" alt="" /></a>
                  </div>
                  <h3>Lemon</h3>
                  <p className="product-price"><span>Per Kg</span> 35$ </p>
                  <a href="cart.html" className="cart-btn"><i className="fas fa-shopping-cart"></i> Thêm vào Giỏ</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*   <!-- end product section --> */}

        {/* <!-- cart banner section --> */}
        <section className="cart-banner pt-100 pb-100">
            <div className="container">
                <div className="row clearfix">
                    {/* <!--Image Column--> */}
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
                      {/* <!--Content Column--> */}
                      <div className="content-column col-lg-6">
                <h3 className="promo-text">Đồ uống ngon <br /><span className="orange-text">Giảm giá mạnh</span></h3>
                          <h4>Trà sữa dâu</h4>
                          <div className="text">Trà sữa dâu là sự hòa quyện hoàn hảo giữa vị ngọt dịu của trà sữa béo thơm và hương dâu tươi mát, từng ngụm như một làn gió mát lành mang theo chút ngọt ngào tan chảy nơi đầu lưỡi, khiến bạn khó lòng cưỡng lại.</div>
                          {/* <!--Countdown Timer--> */}
                          <div className="time-counter"><div className="time-countdown clearfix" data-countdown="2020/2/01"><div className="counter-column"><div className="inner"><span className="count">00</span>Ngày</div></div> <div className="counter-column"><div className="inner"><span className="count">00</span>Giờ</div></div>  <div className="counter-column"><div className="inner"><span className="count">00</span>Phút</div></div>  <div className="counter-column"><div className="inner"><span className="count">00</span>Giây</div></div></div></div>
                        <a href="cart.html" className="cart-btn mt-3"><i className="fas fa-shopping-cart"></i> Thêm vào Giỏ</a>
                      </div>
                  </div>
              </div>
          </section>
          {/*   <!-- end cart banner section --> */}

        {/* <!-- testimonail-section --> */}
        <div className="testimonail-section mt-150 mb-150">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 offset-lg-1 text-center">
                <div className="testimonial-sliders">
                  <div className="single-testimonial-slider">
                    <div className="client-avater">
                      <img src="assets/img/avaters/avatar1.png" alt="" />
                    </div>
                    <div className="client-meta">
                      <h3>Trần Thị Hạnh <span>Giáo viên, Hà Nam</span></h3>
                      <p className="testimonial-body">
                        " Món ăn ngon, đội ngũ phục vụ nhanh nhẹn, giá cả phải chăng. Đặc biệt là các đầu bếp rất chuyên nghiệp, biết cách phục vụ khách hàng. "
                      </p>
                      <div className="last-icon">
                        <i className="fas fa-quote-right"></i>
                      </div>
                    </div>
                  </div>
                  <div className="single-testimonial-slider">
                    <div className="client-avater">
                      <img src="assets/img/avaters/avatar2.png" alt="" />
                    </div>
                    <div className="client-meta">
                      <h3>Nguyễn Văn Hải <span>Nhân viên giao hàng, Hà Nội</span></h3>
                      <p className="testimonial-body">
                        " Không gian nhà hàng thoáng mát, sạch sẽ. Menu đa dạng với nhiều món ăn hấp dẫn. Nhân viên thân thiện, chu đáo. Chắc chắn sẽ quay lại lần sau. "
                      </p>
                      <div className="last-icon">
                        <i className="fas fa-quote-right"></i>
                      </div>
                    </div>
                  </div>
                  <div className="single-testimonial-slider">
                    <div className="client-avater">
                      <img src="assets/img/avaters/avatar3.png" alt="" />
                    </div>
                    <div className="client-meta">
                      <h3>Nguyễn Phú Hưng <span>Nhân viên văn phòng, Hà Nội </span></h3>
                      <p className="testimonial-body">
                        " Tôi rất ấn tượng với cách bày trí món ăn ở đây. Không chỉ ngon miệng mà còn đẹp mắt. Giá thành hợp lý cho chất lượng món ăn. Đặc biệt là các món đặc sản rất đậm đà, đúng vị. "								</p>
                      <div className="last-icon">
                        <i className="fas fa-quote-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- end testimonail-section --> */}

        {/* <!-- logo carousel --> */}
        <div className="logo-carousel-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="logo-carousel-inner">
                  <div className="single-logo-item">
                    <img src="assets/img/company-logos/1.png" alt="" />
                  </div>
                  <div className="single-logo-item">
                    <img src="assets/img/company-logos/2.png" alt="" />
                  </div>
                  <div className="single-logo-item">
                    <img src="assets/img/company-logos/3.png" alt="" />
                  </div>
                  <div className="single-logo-item">
                    <img src="assets/img/company-logos/4.png" alt="" />
                  </div>
                  <div className="single-logo-item">
                    <img src="assets/img/company-logos/5.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- end logo carousel --> */}

        {/* <!-- footer --> */}
        <div className="footer-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="footer-box about-widget">
                  <h2 className="widget-title">Về chúng tôi</h2>
                    <p>Foodee - nơi hội tụ tinh hoa ẩm thực Việt Nam và quốc tế. Với hơn 20 năm kinh nghiệm, chúng tôi tự hào mang đến những trải nghiệm ẩm thực tuyệt vời nhất thông qua những món ăn được chế biến từ nguyên liệu tươi ngon, đảm bảo vệ sinh an toàn thực phẩm.</p>					</div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-box get-in-touch">
                  <h2 className="widget-title">Thông tin liên hệ</h2>
                  <ul>
                    <li>122 Hoàng Quốc Việt, Cổ Nhuế, Cầu Giấy, Hà Nội.</li>
                    <li>support@Foodee.com</li>
                    <li>+00 111 222 3333</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-box pages">
                  <h2 className="widget-title">Pages</h2>
                  <ul>
                    <li><a href="index.html">Trang chủ</a></li>
                    <li><a href="about.html">Về chúng tôi</a></li>
                    <li><a href="contact.html">Thông tin liên hệ</a></li>
                    <li><a href="shop.html">Menu</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-box Đăng ký nhận tin">
                  <h2 className="widget-title">Đăng ký nhận tin</h2>
                  <p>Đăng ký nhận thông báo để cập nhật những tin tức mới nhất từ chúng tôi.</p>
                  <form action="index.html">
                    <input type="email" placeholder="Email" />
                    <button type="submit"><i className="fas fa-paper-plane"></i></button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- end footer --> */}
        
        {/* <!-- copyright --> */}
        <div className="copyright">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-12">
                <p>Copyrights &copy; 2024 - <a href="https://imransdesign.com/">Nam Nguyễn</a>,  All Rights Reserved.<br />
                  Distributed By - Nam Nguyễn
                </p>
              </div>
              <div className="col-lg-6 text-right col-md-12">
                <div className="social-icons">
                  <ul>
                    <li><a href="#" target="_blank"><i className="fab fa-facebook-f"></i></a></li>
                    <li><a href="#" target="_blank"><i className="fab fa-twitter"></i></a></li>
                    <li><a href="#" target="_blank"><i className="fab fa-instagram"></i></a></li>
                    <li><a href="#" target="_blank"><i className="fab fa-linkedin"></i></a></li>
                    <li><a href="#" target="_blank"><i className="fab fa-dribbble"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- end copyright --> */}
        
        

      </div>
  );
}

export default App;
