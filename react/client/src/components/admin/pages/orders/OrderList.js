import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './OrderList.css';
import OrderForm from './OrderForm';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/orders');
      if (response.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
        setFilteredOrders(response.data.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Swal.fire('Lỗi', 'Không thể tải danh sách đơn hàng', 'error');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = () => {
    if (showForm) {
      setIsClosing(true);
      setTimeout(() => {
        setShowForm(false);
        setIsClosing(false);
      }, 500);
    } else {
      setShowForm(true);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleSetCompleted = async (orderId) => {
    try {
      await axios.put(`http://localhost:5001/api/orders/${orderId}/complete`);
      fetchOrders();
      Swal.fire('Thành công', 'Đã cập nhật trạng thái đơn hàng', 'success');
    } catch (error) {
      Swal.fire('Lỗi', 'Không thể cập nhật trạng thái đơn hàng', 'error');
    }
  };

  const handleSetPending = async (orderId) => {
    try {
      await axios.put(`http://localhost:5001/api/orders/${orderId}/pending`);
      fetchOrders();
      Swal.fire('Thành công', 'Đã cập nhật trạng thái đơn hàng', 'success');
    } catch (error) {
      Swal.fire('Lỗi', 'Không thể cập nhật trạng thái đơn hàng', 'error');
    }
  };

  const handleUpdateOrder = async (updatedData) => {
    try {
      await axios.put(`http://localhost:5001/api/orders/${selectedOrder.id}`, updatedData);
      setShowEditModal(false);
      fetchOrders();
      Swal.fire('Thành công', 'Đã cập nhật đơn hàng', 'success');
    } catch (error) {
      Swal.fire('Lỗi', 'Không thể cập nhật đơn hàng', 'error');
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const searchValue = value.toLowerCase();
    const filtered = orders.filter(order => 
      order.order_code.toLowerCase().includes(searchValue) ||
      order.table_number.toString().includes(searchValue) ||
      order.total_amount.toString().includes(searchValue) ||
      order.status.toLowerCase().includes(searchValue) ||
      (order.product_details && order.product_details.some(detail => 
        detail.toLowerCase().includes(searchValue)
      )) ||
      new Date(order.created_at).toLocaleString('vi-VN').toLowerCase().includes(searchValue)
    );
    setFilteredOrders(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedOrders = [...filteredOrders].sort((a, b) => {
      if (key === 'order_code') {
        return direction === 'asc' 
          ? a.order_code.localeCompare(b.order_code)
          : b.order_code.localeCompare(a.order_code);
      }
      if (key === 'table_number') {
        return direction === 'asc'
          ? a.table_number.localeCompare(b.table_number)
          : b.table_number.localeCompare(a.table_number);
      }
      if (key === 'total_amount') {
        return direction === 'asc'
          ? a.total_amount - b.total_amount
          : b.total_amount - a.total_amount;
      }
      if (key === 'status') {
        return direction === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      if (key === 'created_at') {
        return direction === 'asc'
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    });

    setFilteredOrders(sortedOrders);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);
    return date.toLocaleString('vi-VN');
  };

  if (loading) return <div className="text-center p-5">Đang tải...</div>;

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h2>Quản lý đơn hàng</h2>
        <div className="header-actions">
          <div className={`search-container ${showSearch ? 'show' : ''}`}>
            <button 
              className="search-btn"
              onClick={() => setShowSearch(!showSearch)}
            >
              <i className="fas fa-search"></i>
            </button>
            {showSearch && (
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            )}
          </div>
          <button className="add-order-btn" onClick={handleAddOrder}>
            {showForm ? (
              <>
                <i className="fas fa-minus"></i> Ẩn form
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i> Thêm đơn hàng
              </>
            )}
          </button>
        </div>
      </div>

      {showForm && (
        <div className={`order-form-container ${isClosing ? 'form-exit' : 'form-enter'}`}>
          <OrderForm onClose={handleAddOrder} />
        </div>
      )}

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('order_code')} className="sortable">
                Mã đơn
                {sortConfig.key === 'order_code' && (
                  <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th onClick={() => handleSort('table_number')} className="sortable">
                Bàn
                {sortConfig.key === 'table_number' && (
                  <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th>Sản phẩm</th>
              <th onClick={() => handleSort('total_amount')} className="sortable">
                Tổng tiền
                {sortConfig.key === 'total_amount' && (
                  <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Trạng thái
                {sortConfig.key === 'status' && (
                  <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th onClick={() => handleSort('created_at')} className="sortable">
                Thời gian
                {sortConfig.key === 'created_at' && (
                  <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">Không có đơn hàng nào</td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_code}</td>
                  <td>Bàn {order.table_number}</td>
                  <td>
                    {order.product_details && Array.isArray(order.product_details) ? (
                      order.product_details.map((detail, index) => {
                        const cleanDetail = detail
                          .replace(/\[|\]/g, '')
                          .replace(/"/g, '')
                          .replace(/\\/g, '');

                        return (
                          <div key={index} className="product-detail-item">
                            {cleanDetail}
                          </div>
                        );
                      })
                    ) : (
                      <div>Không có thông tin sản phẩm</div>
                    )}
                  </td>
                  <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}</td>
                  <td>
                    <span className={`status-tag ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{formatDateTime(order.created_at)}</td>
                  <td className="action-buttons">
                    <button className="edit-btn" onClick={() => handleViewOrder(order)}>
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="update-btn" onClick={() => handleSetCompleted(order.id)}>
                      <i className="fas fa-check text-success"></i>
                    </button>
                    <button className="delete-btn" onClick={() => handleSetPending(order.id)}>
                      <i className="fas fa-times text-danger"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showEditModal && selectedOrder && (
        <div className="modal" onClick={(e) => {
          if (e.target.className === 'modal') {
            setShowEditModal(false);
          }
        }}>
          <div className={`modal-content ${showEditModal ? 'modal-enter' : 'modal-exit'}`}>
            <h3>Chỉnh sửa đơn hàng</h3>
            <div className="form-group">
              <label>Mã đơn: {selectedOrder.order_code}</label>
            </div>
            <div className="form-group">
              <label>Bàn: {selectedOrder.table_number}</label>
            </div>
            <div className="form-group">
              <label>Sản phẩm: {selectedOrder.product_name}</label>
            </div>
            <div className="form-group">
              <label>Số lượng:</label>
              <input 
                type="number" 
                value={selectedOrder.quantity}
                onChange={(e) => setSelectedOrder({
                  ...selectedOrder,
                  quantity: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Ghi chú:</label>
              <textarea
                value={selectedOrder.note || ''}
                onChange={(e) => setSelectedOrder({
                  ...selectedOrder,
                  note: e.target.value
                })}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => handleUpdateOrder(selectedOrder)}>
                Lưu thay đổi
              </button>
              <button onClick={() => setShowEditModal(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderList;