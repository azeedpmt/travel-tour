CREATE DATABASE IF NOT EXISTS tour_auth;
USE tour_auth;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, password, name, role) VALUES 
('admin@tour.com', '$2a$10$YourHashedPasswordHere', 'Admin User', 'admin');