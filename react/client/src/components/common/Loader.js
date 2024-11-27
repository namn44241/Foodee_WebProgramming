import React, { useEffect, useState } from 'react';
// Xóa dòng import './Loader.css' vì CSS đã có trong theme

function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giữ loader hiển thị ít nhất 1.5 giây
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="loader">
      <div className="loader-inner">
        <div className="circle"></div>
      </div>
    </div>
  );
}

export default Loader;