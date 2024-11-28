import React from 'react';

function Pagination({ currentPage, onPageChange }) {
  return (
    <div className="row">
      <div className="col-lg-12 text-center">
        <div className="pagination-wrap">
          <ul>
            <li>
              <a href="#" onClick={() => onPageChange(currentPage - 1)}>
                Prev
              </a>
            </li>
            <li>
              <a 
                className={currentPage === 1 ? 'active' : ''} 
                onClick={() => onPageChange(1)}
              >
                1
              </a>
            </li>
            <li>
              <a 
                className={currentPage === 2 ? 'active' : ''} 
                onClick={() => onPageChange(2)}
              >
                2
              </a>
            </li>
            <li>
              <a 
                className={currentPage === 3 ? 'active' : ''} 
                onClick={() => onPageChange(3)}
              >
                3
              </a>
            </li>
            <li>
              <a href="#" onClick={() => onPageChange(currentPage + 1)}>
                Next
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Pagination;