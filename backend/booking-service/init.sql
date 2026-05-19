CREATE DATABASE IF NOT EXISTS tour_bookings;
USE tour_bookings;

CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    tour_id INT NOT NULL,
    number_of_people INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    booking_date DATE NOT NULL,
    status ENUM('confirmed', 'cancelled', 'pending') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_tour_id (tour_id)
);