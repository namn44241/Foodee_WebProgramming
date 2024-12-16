import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTable } from '../../contexts/TableContext';

function TableRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCurrentTableId } = useTable();

  useEffect(() => {
    // Set tableId vào context
    setCurrentTableId(id);
    
    // Redirect về trang chủ
    navigate('/', { replace: true });
  }, [id, setCurrentTableId, navigate]);

  return null; // Component này không render gì cả
}

export default TableRedirect;