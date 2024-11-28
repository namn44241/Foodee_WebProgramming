import React, { useState } from 'react';
import ProductList from './ProductList';
import ProductFilters from './ProductFilters';
import Pagination from './Pagination';

function Menu() {
  const [currentFilter, setCurrentFilter] = useState('*');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      {/* breadcrumb section */}
      <div className="breadcrumb-section breadcrumb-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 text-center">
              <div className="breadcrumb-text">
                <p>Sạch & Tươi ngon</p>
                <h1>Menu</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* products section */}
      <div className="product-section mt-150 mb-150">
        <div className="container">
          <ProductFilters 
            currentFilter={currentFilter} 
            onFilterChange={setCurrentFilter} 
          />
          <ProductList filter={currentFilter} />
          <Pagination 
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}

export default Menu;