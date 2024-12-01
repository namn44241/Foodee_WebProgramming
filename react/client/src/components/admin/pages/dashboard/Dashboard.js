import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
    const username = localStorage.getItem('username');
    const [stats, setStats] = useState({
        users: 0,
        categories: 0,
        products: 0,
        tables: 0,
        orders: 0,
        revenue: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Using token:', token); // Thêm log token
    
                const response = await axios.get('http://localhost:5001/api/dashboard/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                console.log('Stats response:', response.data); // Thêm log response
                
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                console.log('Error response:', error.response); // Thêm log error
            }
        };
    
        fetchStats();
    }, []);
    
    // Format số tiền thành VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h2>Bảng điều khiển</h2>
                <p>Xin chào, {username}!</p>
            </div>
            
            <div className="dashboard-stats">
                <div className="stat-card">
                    <i className="fas fa-users"></i>
                    <h3>Người dùng</h3>
                    <p>{stats.users}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-list"></i>
                    <h3>Danh mục</h3>
                    <p>{stats.categories}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-utensils"></i>
                    <h3>Món ăn</h3>
                    <p>{stats.products}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-chair"></i>
                    <h3>Bàn</h3>
                    <p>{stats.tables}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-receipt"></i>
                    <h3>Đơn hàng</h3>
                    <p>{stats.orders}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-dollar-sign"></i>
                    <h3>Doanh thu</h3>
                    <p>{formatCurrency(stats.revenue)}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;