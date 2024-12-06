import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductFilters from '../menu/ProductFilters';

function ProductSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('*');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/products/public');
        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (filterId) => {
    setCurrentFilter(filterId);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  
  const filteredProducts = currentFilter === '*' 
    ? products 
    : products.filter(product => product.category_id.toString() === currentFilter);

  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= Math.min(3, totalPages); i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (e, pageNumber) => {
    e.preventDefault();
    if (pageNumber === 'prev') {
      setCurrentPage(prev => Math.max(prev - 1, 1));
    } else if (pageNumber === 'next') {
      setCurrentPage(prev => Math.min(prev + 1, totalPages));
    } else {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <div className="product-section mt-150 mb-150">
      <div className="container">
        {/* Title Section */}
        <div className="row">
          <div className="col-lg-8 offset-lg-2 text-center">
            <div className="section-title">	
              <h3><span className="orange-text">Mời bạn</span> Đặt món</h3>
              <p>Món ăn của chúng tôi được chế biến từ những nguyên liệu tươi mới, đảm bảo chất lượng và hương vị ngon miệng.</p>
            </div>
          </div>
        </div>

        {/* Product Filters */}
        <ProductFilters 
          currentFilter={currentFilter} 
          onFilterChange={handleFilterChange} 
        />

        {/* Products Grid */}
        <div className="row">
          {currentProducts.map(product => (
            <div key={product.id} className="col-lg-4 col-md-6 text-center">
              <div className="single-product-item">
                <div className="product-image">
                  <Link to={`/product/${product.id}`}>
                    <img 
                      src={`http://localhost:5001/uploads/products/${product.image_name}`}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/img/products/default-product.jpg';
                      }}
                    />
                  </Link>
                </div>
                <h3>{product.name}</h3>
                <p className="product-price">
                  <span> </span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </p>
                <Link to="/cart" className="cart-btn">
                  <i className="fas fa-shopping-cart"></i> Thêm vào Giỏ
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="pagination-wrap">
              <ul>
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => handlePageClick(e, 'prev')}
                    style={{ 
                      opacity: currentPage === 1 ? 0.5 : 1,
                      pointerEvents: currentPage === 1 ? 'none' : 'auto'
                    }}
                  >
                    Prev
                  </a>
                </li>
                
                {pageNumbers.map(number => (
                  <li key={number}>
                    <a 
                      href="#" 
                      onClick={(e) => handlePageClick(e, number)}
                      className={currentPage === number ? 'active' : ''}
                      style={{ 
                        opacity: number <= totalPages ? 1 : 0.5,
                        pointerEvents: number <= totalPages ? 'auto' : 'none'
                      }}
                    >
                      {number}
                    </a>
                  </li>
                ))}

                <li>
                  <a 
                    href="#" 
                    onClick={(e) => handlePageClick(e, 'next')}
                    style={{ 
                      opacity: currentPage >= totalPages ? 0.5 : 1,
                      pointerEvents: currentPage >= totalPages ? 'none' : 'auto'
                    }}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </div>
            <div className="menu-button-wrap" style={{ marginTop: '30px' }}>
              <Link 
                to="/menu" 
                className="boxed-btn"
                style={{
                  background: '#F28123',
                  color: '#fff',
                  padding: '10px 30px',
                  borderRadius: '50px',
                  display: 'inline-block',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = '#051922'}
                onMouseOut={(e) => e.target.style.background = '#F28123'}
              >
                Xem toàn bộ Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSection;