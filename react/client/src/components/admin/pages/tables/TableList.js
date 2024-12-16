import React, { useState, useEffect } from 'react';
import './TableList.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { QRCodeCanvas } from 'qrcode.react';

function TableList() {
  const emptySlots = Array(16).fill(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [newTable, setNewTable] = useState({
    table_number: '',
    status: 'available',
    position: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/tables', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setTables(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tables:', error);
      Swal.fire('Lỗi', 'Không thể tải danh sách bàn', 'error');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Tìm vị trí trống đầu tiên
      const positions = tables.map(t => t.position);
      const firstEmptyPosition = emptySlots.findIndex((_, index) => 
        !positions.includes(index)
      );

      const tableData = {
        ...newTable,
        position: firstEmptyPosition >= 0 ? firstEmptyPosition : tables.length
      };

      const response = await axios.post(
        'http://localhost:5001/api/tables',
        tableData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        Swal.fire('Thành công', 'Thêm bàn mới thành công', 'success');
        fetchTables();
        handleAddTable();
      }
    } catch (error) {
      console.error('Error creating table:', error);
      Swal.fire('Lỗi', 'Không thể thêm bàn mới', 'error');
    }
  };

  const handleDragStart = (e, table) => {
    e.dataTransfer.setData('tableId', table.id.toString());
  };

  const handleDrop = async (e, newPosition) => {
    e.preventDefault();
    const tableId = parseInt(e.dataTransfer.getData('tableId'));
    const draggedTable = tables.find(t => t.id === tableId);
    
    if (!draggedTable) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            `http://localhost:5001/api/tables/${tableId}`,
            {
                table_number: draggedTable.table_number,
                status: draggedTable.status,
                position: newPosition
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data.success) {
            fetchTables();
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error updating table position:', error);
        Swal.fire('Lỗi', 'Không thể cập nhật vị trí bàn', 'error');
    }
  };

  const renderSlot = (index) => {
    const table = tables.find(t => t.position === index);
    
    if (table) {
        return (
            <div key={`table-${table.id}`}>
                {renderTableItem(table)}
            </div>
        );
    }

    return (
        <div 
            key={`empty-${index}`}
            className="empty-slot"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
        >
            <div className="empty-slot-text">Ô trống {index + 1}</div>
        </div>
    );
  };

  const renderTableItem = (table) => {
    return (
      <div 
        className={`table-item ${table.status} ${table.table_number === 'CASH' ? 'cashier' : ''}`}
        draggable={true}
        onDragStart={(e) => handleDragStart(e, table)}
      >
        <div className="table-number">{table.table_number}</div>
        <div className="table-status">
          {table.status === 'available' ? 'Hoạt động' : 'Bảo trì'}
        </div>
        <div className="table-actions">
          <button className="edit-btn" onClick={() => handleEdit(table)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="qr-btn" onClick={() => handleShowQR(table.id)}>
            <i className="fas fa-qrcode"></i>
          </button>
        </div>
      </div>
    );
  };

  const handleAddTable = () => {
    if (showForm) {
      setIsClosing(true);
      setTimeout(() => {
        setShowForm(false);
        setIsClosing(false);
        setNewTable({
          table_number: '',
          status: 'available',
          position: null
        });
      }, 300);
    } else {
      setShowForm(true);
    }
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5001/api/tables/${editingTable.id}`,
        {
          table_number: editingTable.table_number,
          status: editingTable.status,
          position: editingTable.position
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        Swal.fire('Thành công', 'Cập nhật bàn thành công', 'success');
        fetchTables();
        handleCloseForm();
      }
    } catch (error) {
      console.error('Error updating table:', error);
      Swal.fire('Lỗi', 'Không thể cập nhật bàn', 'error');
    }
  };

  const handleCloseForm = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowForm(false);
      setIsClosing(false);
      setIsEditing(false);
      setEditingTable(null);
    }, 300);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận xóa?',
        text: "Bạn không thể hoàn tác sau khi xóa!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/tables/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        Swal.fire('Đã xóa!', 'Bàn đã được xóa thành công.', 'success');
        fetchTables();
      }
    } catch (error) {
      console.error('Error deleting table:', error);
      Swal.fire('Lỗi', 'Không thể xóa bàn', 'error');
    }
  };

  const handleShowQR = (tableId) => {
    setSelectedTableId(tableId);
    setShowQRModal(true);
  };

  const handleCloseQR = () => {
    setShowQRModal(false);
    setSelectedTableId(null);
  };

  const QRModal = () => {
    if (!showQRModal || !selectedTableId) return null;
    
    const qrValue = `http://localhost:6868/table_id=${selectedTableId}`;
    
    return (
        <div className="qr-modal-overlay" key="qr-modal">
            <div className="qr-modal">
                <div className="qr-modal-header">
                    <h3>Mã QR cho bàn</h3>
                    <button onClick={handleCloseQR}>&times;</button>
                </div>
                <div className="qr-modal-body">
                    <QRCodeCanvas value={qrValue} size={256} level="H" />
                    <p className="qr-link">{qrValue}</p>
                </div>
                <div className="qr-modal-footer">
                    <button className="download-btn" onClick={() => {
                        const canvas = document.querySelector('.qr-modal canvas');
                        if (canvas) {
                            const link = document.createElement('a');
                            link.download = `table-qr-${selectedTableId}.png`;
                            link.href = canvas.toDataURL();
                            link.click();
                        }
                    }}>
                        Tải QR Code
                    </button>
                    <button className="close-btn" onClick={handleCloseQR}>Đóng</button>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="table-management">
      <div className="table-header">
        <h2>Quản lý bàn ăn</h2>
        <button className="add-table-btn" onClick={() => {
          setIsEditing(false);
          setEditingTable(null);
          setShowForm(!showForm);
        }}>
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
          <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Số bàn</label>
                <input
                  type="text"
                  value={isEditing ? editingTable.table_number : newTable.table_number}
                  onChange={(e) => {
                    if (isEditing) {
                      setEditingTable({
                        ...editingTable,
                        table_number: e.target.value
                      });
                    } else {
                      setNewTable({
                        ...newTable,
                        table_number: e.target.value
                      });
                    }
                  }}
                  placeholder="Nhập số bàn"
                  required
                />
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={isEditing ? editingTable.status : newTable.status}
                  onChange={(e) => {
                    if (isEditing) {
                      setEditingTable({
                        ...editingTable,
                        status: e.target.value
                      });
                    } else {
                      setNewTable({
                        ...newTable,
                        status: e.target.value
                      });
                    }
                  }}
                >
                  <option value="available">Hoạt động</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                {isEditing ? 'Cập nhật' : 'Thêm mới'}
              </button>
              <button type="button" className="cancel-btn" onClick={handleCloseForm}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-layout">
        <div className="table-grid">
          {emptySlots.map((_, index) => (
            <React.Fragment key={`slot-${index}`}>
                {renderSlot(index)}
            </React.Fragment>
          ))}
        </div>
      </div>
      {showQRModal && <QRModal />}
    </div>
  );
}

export default TableList;