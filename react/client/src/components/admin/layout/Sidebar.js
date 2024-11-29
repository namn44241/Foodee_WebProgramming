import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Sidebar() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        Swal.fire({
            title: 'Đăng xuất?',
            text: "Bạn có chắc muốn đăng xuất?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đăng xuất',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('role');
                localStorage.removeItem('username');
                navigate('/');
                
            }
        });
    };

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <h3>FOODEE ADMIN</h3>
                <p>Xin chào, {username}!</p>
            </div>
            
            <nav className="sidebar-nav">
                <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? 'active' : ''}>
                    <i className="fas fa-home"></i>
                    <span>Dashboard</span>
                </NavLink>
                
                <NavLink to="/admin/orders" className={({isActive}) => isActive ? 'active' : ''}>
                    <i className="fas fa-shopping-cart"></i>
                    <span>Đơn hàng</span>
                </NavLink>
                
                <NavLink to="/admin/products" className={({isActive}) => isActive ? 'active' : ''}>
                    <i className="fas fa-utensils"></i>
                    <span>Sản phẩm</span>
                </NavLink>
                
                <NavLink to="/admin/categories" className={({isActive}) => isActive ? 'active' : ''}>
                    <i className="fas fa-tags"></i>
                    <span>Danh mục</span>
                </NavLink>
                
                <NavLink to="/admin/customers" className={({isActive}) => isActive ? 'active' : ''}>
                    <i className="fas fa-users"></i>
                    <span>Khách hàng</span>
                </NavLink>
                
                <NavLink to="/admin/settings" className={({isActive}) => isActive ? 'active' : ''}>
                    <i className="fas fa-cog"></i>
                    <span>Cài đặt</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;