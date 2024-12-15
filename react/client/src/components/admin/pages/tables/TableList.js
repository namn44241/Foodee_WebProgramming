import React, { useState, useEffect } from 'react';
import './TableList.css';

function TableList() {
  const emptySlots = Array(16).fill(null);
  
  const initialTables = [
    { id: 0, table_number: 'CASH', status: 'active', qr_code: 'qr_cash', position: 0, isCashier: true },
    { id: 1, table_number: '101', status: 'active', qr_code: 'qr_101', position: 4 },
    { id: 2, table_number: '102', status: 'active', qr_code: 'qr_102', position: 5 },
    { id: 3, table_number: '103', status: 'maintenance', qr_code: 'qr_103', position: 6 },
    { id: 4, table_number: '104', status: 'active', qr_code: 'qr_104', position: 7 },
    { id: 5, table_number: '105', status: 'active', qr_code: 'qr_105', position: 8 },
    { id: 6, table_number: '106', status: 'active', qr_code: 'qr_106', position: 9 }
  ];

  // Lấy dữ liệu từ localStorage hoặc dùng dữ liệu mặc định
  const [tables, setTables] = useState(() => {
    const savedTables = localStorage.getItem('tables');
    return savedTables ? JSON.parse(savedTables) : initialTables;
  });

  // Lưu vào localStorage mỗi khi tables thay đổi
  useEffect(() => {
    localStorage.setItem('tables', JSON.stringify(tables));
  }, [tables]);

  const [showForm, setShowForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [newTable, setNewTable] = useState({
    table_number: '',
    qr_code: 'Tự động tạo khi lưu',
    status: 'active',
    note: ''
  });

  const handleDragStart = (e, table) => {
    e.dataTransfer.setData('tableId', table.id.toString());
  };

  const handleDrop = (e, newPosition) => {
    e.preventDefault();
    const tableId = parseInt(e.dataTransfer.getData('tableId'));
    const draggedTable = tables.find(t => t.id === tableId);
    const targetTable = tables.find(t => t.position === newPosition);

    // Nếu có bàn ở vị trí đích, hoán đổi vị trí
    if (targetTable) {
      const updatedTables = tables.map(table => {
        if (table.id === tableId) {
          return { ...table, position: newPosition };
        }
        if (table.id === targetTable.id) {
          return { ...table, position: draggedTable.position };
        }
        return table;
      });
      setTables(updatedTables);
    } else {
      // Nếu vị trí đích trống, chỉ di chuyển bàn được kéo
      const updatedTables = tables.map(table => {
        if (table.id === tableId) {
          return { ...table, position: newPosition };
        }
        return table;
      });
      setTables(updatedTables);
    }
  };

  const handleAddTable = () => {
    if (showForm) {
      setIsClosing(true);
      setTimeout(() => {
        setShowForm(false);
        setIsClosing(false);
        setNewTable({
          table_number: '',
          qr_code: 'Tự động tạo khi lưu',
          status: 'active',
          note: ''
        });
      }, 300);
    } else {
      setShowForm(true);
    }
  };

  const renderSlot = (index) => {
    const table = tables.find(t => t.position === index);
    
    if (table) {
      return (
        <div 
          key={index} 
          className={`table-item ${table.status} ${table.isCashier ? 'cashier' : ''}`}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, table)}
        >
          <div className="table-number">
            {table.isCashier ? 'Thu ngân' : `Bàn ${table.table_number}`}
          </div>
          <div className="table-status">
            {table.status === 'active' ? 'Hoạt động' : 'Bảo trì'}
          </div>
          <div className="table-actions">
            <button className="edit-btn" title="Sửa">
              <i className="fas fa-edit"></i>
            </button>
            {!table.isCashier && (
              <button className="qr-btn" title="Mã QR">
                <i className="fas fa-qrcode"></i>
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div 
        key={index} 
        className="empty-slot"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, index)}
      >
        <div className="empty-slot-text">Ô trống {index + 1}</div>
      </div>
    );
  };

  return (
    <div className="table-management">
      <div className="table-header">
        <h2>Quản lý bàn ăn</h2>
        <button className="add-table-btn" onClick={handleAddTable}>
          {showForm ? (
            <>
              <i className="fas fa-minus"></i> Ẩn form
            </>
          ) : (
            <>
              <i className="fas fa-plus"></i> Thêm bàn ăn
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className={`table-form-container ${isClosing ? 'form-exit' : 'form-enter'}`}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label>Số bàn</label>
                <input
                  type="text"
                  value={newTable.table_number}
                  onChange={(e) => setNewTable({...newTable, table_number: e.target.value})}
                  placeholder="Nhập số bàn"
                  required
                />
              </div>
              <div className="form-group">
                <label>Mã QR</label>
                <input
                  type="text"
                  value={newTable.qr_code}
                  disabled
                  placeholder="Tự động tạo khi lưu"
                />
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={newTable.status}
                  onChange={(e) => setNewTable({...newTable, status: e.target.value})}
                >
                  <option value="active">Hoạt động</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Ghi chú</label>
              <textarea
                value={newTable.note}
                onChange={(e) => setNewTable({...newTable, note: e.target.value})}
                placeholder="Nhập ghi chú nếu có"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">Lưu</button>
              <button type="button" className="cancel-btn" onClick={handleAddTable}>Hủy</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-layout">
        <div className="table-grid">
          {emptySlots.map((_, index) => renderSlot(index))}
        </div>
      </div>
    </div>
  );
}

export default TableList;