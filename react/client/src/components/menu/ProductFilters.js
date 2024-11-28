import React from 'react';

function ProductFilters({ currentFilter, onFilterChange }) {
  const filters = [
    { id: '*', name: 'All' },
    { id: 'strawberry', name: 'Strawberry' },
    { id: 'berry', name: 'Berry' },
    { id: 'lemon', name: 'Lemon' }
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="product-filters">
          <ul>
            {filters.map(filter => (
              <li
                key={filter.id}
                className={currentFilter === filter.id ? 'active' : ''}
                onClick={() => onFilterChange(filter.id)}
              >
                {filter.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;