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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/orders');
      if (response.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
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

  if (loading) return <div className="text-center p-5">Đang tải...</div>;

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h2>Quản lý đơn hàng</h2>
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

      {showForm && (
        <div className={`order-form-container ${isClosing ? 'form-exit' : 'form-enter'}`}>
          <OrderForm onClose={handleAddOrder} />
        </div>
      )}

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Bàn</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thời gian</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">Không có đơn hàng nào</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_code}</td>
                  <td>Bàn {order.table_number}</td>
                  <td>
                    {order.product_details && Array.isArray(order.product_details) ? (
                      order.product_details.map((detail, index) => (
                        <div key={index}>{detail}</div>
                      ))
                    ) : (
                      <div>
                        {order.product_names && Array.isArray(order.product_names) ? 
                          order.product_names.map((name, idx) => (
                            <div key={idx}>
                              {name} x{order.quantities[idx]}
                            </div>
                          )) : 'Không có thông tin sản phẩm'
                        }
                      </div>
                    )}
                  </td>
                  <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}</td>
                  <td>
                    <span className={`status-tag ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleString('vi-VN')}</td>
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