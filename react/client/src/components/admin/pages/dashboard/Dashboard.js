import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function Dashboard() {
    const username = localStorage.getItem('username');
    const [stats, setStats] = useState({
        users: 0,
        categories: 0,
        products: 0,
        tables: 0,
        orders: 0,
        revenue: 0,
        revenueByMonth: [],
        topProducts: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Fetching stats with token:', token);

                const response = await axios.get('http://localhost:5001/api/dashboard/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                console.log('Raw response:', response);
                
                if (response.data.success) {
                    console.log('Setting stats:', response.data.data);
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                if (error.response) {
                    console.log('Error response:', error.response.data);
                }
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

    const revenueChartData = {
        labels: stats.revenueByMonth?.map(item => item.month) || [],
        datasets: [{
            label: 'Doanh thu theo tháng',
            data: stats.revenueByMonth?.map(item => item.revenue) || [],
            backgroundColor: 'rgba(242, 129, 35, 0.5)',
            borderColor: 'rgb(242, 129, 35)',
            borderWidth: 1
        }]
    };

    const topProductsData = {
        labels: stats.topProducts?.map(item => item.name) || [],
        datasets: [{
            label: 'Sản phẩm bán chạy',
            data: stats.topProducts?.map(item => item.total_sold) || [],
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF'
            ]
        }]
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
            
            <div className="dashboard-charts">
                <div className="chart-container">
                    <h3>Doanh thu theo tháng</h3>
                    <Bar 
                        data={revenueChartData} 
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Biểu đồ doanh thu'
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function(value) {
                                            return new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                                maximumFractionDigits: 0
                                            }).format(value);
                                        }
                                    }
                                }
                            }
                        }} 
                    />
                </div>
                
                <div className="chart-container">
                    <h3>Top sản phẩm bán chạy</h3>
                    <Pie 
                        data={topProductsData} 
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'right',
                                }
                            }
                        }} 
                    />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;