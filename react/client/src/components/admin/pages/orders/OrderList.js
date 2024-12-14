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
              <th>Số lượng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thời gian</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">Không có đơn hàng nào</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_code}</td>
                  <td>Bàn {order.table_number}</td>
                  <td>{order.product_name}</td>
                  <td>{order.quantity}</td>
                  <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_price)}</td>
                  <td>
                    <span className={`status-tag ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleString('vi-VN')}</td>
                  <td className="action-buttons">
                    <button className="edit-btn">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="update-btn">
                      <i className="fas fa-check"></i>
                    </button>
                    {order.status === 'pending' && (
                      <button className="delete-btn">
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderList;