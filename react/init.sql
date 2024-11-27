CREATE DATABASE IF NOT EXISTS foodee_app;

-- Grant privileges
GRANT ALL PRIVILEGES ON foodee_app.* TO 'baitap'@'%';
FLUSH PRIVILEGES;

USE foodee_app;

-- Bảng Users
CREATE TABLE users (
    username VARCHAR(50) NOT NULL PRIMARY KEY,
    password VARCHAR(64) NOT NULL,
    role ENUM('admin', 'staff', 'kitchen') NOT NULL DEFAULT 'staff'
);

-- Bảng Categories
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Bảng Products
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_name VARCHAR(255),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Bảng Tables
CREATE TABLE tables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_number VARCHAR(20) UNIQUE NOT NULL,
    qr_code VARCHAR(255) UNIQUE,
    status ENUM('available', 'occupied') DEFAULT 'available',
    is_active BOOLEAN DEFAULT true
);

-- Bảng Orders
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_id INT NOT NULL,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (quantity * price) STORED,
    status ENUM('pending', 'cooking', 'served', 'completed', 'cancelled') DEFAULT 'pending',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES tables(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Initial Data
INSERT INTO users (username, password, role) 
VALUES 
('admin', '1', 'admin'),
('staff1', '1', 'staff'),
('kitchen1', '1', 'kitchen');

INSERT INTO categories (name, description) VALUES
('Món chính', 'Các món ăn chính'),
('Món phụ', 'Các món ăn phụ'),
('Đồ uống', 'Các loại đồ uống');

INSERT INTO tables (table_number, qr_code) VALUES
('T001', 'qr_code_t001'),
('T002', 'qr_code_t002'),
('T003', 'qr_code_t003');