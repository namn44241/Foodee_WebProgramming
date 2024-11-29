import React from 'react';
import './Dashboard.css';

function Dashboard() {
    const username = localStorage.getItem('username');

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h2>Bảng điều khiển</h2>
                <p>Xin chào, {username}!</p>
            </div>
            
            <div className="dashboard-stats">
                <div className="stat-card">
                    <i className="fas fa-shopping-cart"></i>
                    <h3>Đơn hàng</h3>
                    <p>24</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-users"></i>
                    <h3>Khách hàng</h3>
                    <p>156</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-dollar-sign"></i>
                    <h3>Doanh thu</h3>
                    <p>$2,345</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-utensils"></i>
                    <h3>Món ăn</h3>
                    <p>48</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;