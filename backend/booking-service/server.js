const express = require('express');
const mysql = require('mysql2/promise');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tour_bookings',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Get user bookings
app.get('/user/:userId', async (req, res) => {
    try {
        const [bookings] = await pool.execute(
            'SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC',
            [req.params.userId]
        );
        
        // Fetch tour details for each booking
        const bookingsWithTours = await Promise.all(
            bookings.map(async (booking) => {
                try {
                    const tourResponse = await axios.get(`http://localhost:8082/tours/${booking.tour_id}`);
                    return { ...booking, tour: tourResponse.data };
                } catch (error) {
                    return { ...booking, tour: null };
                }
            })
        );
        
        res.json(bookingsWithTours);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Create booking
app.post('/', async (req, res) => {
    try {
        const { user_id, tour_id, number_of_people, total_price, booking_date } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO bookings (user_id, tour_id, number_of_people, total_price, booking_date, status) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, tour_id, number_of_people, total_price, booking_date, 'confirmed']
        );
        
        const [newBooking] = await pool.execute('SELECT * FROM bookings WHERE id = ?', [result.insertId]);
        res.status(201).json(newBooking[0]);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to create booking' });
    }
});

// Cancel booking
app.put('/:id/cancel', async (req, res) => {
    try {
        await pool.execute('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', req.params.id]);
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to cancel booking' });
    }
});

// Get all bookings (admin)
app.get('/admin/all', async (req, res) => {
    try {
        const [bookings] = await pool.execute('SELECT * FROM bookings ORDER BY created_at DESC');
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

const PORT = 8083;
app.listen(PORT, () => {
    console.log(`Booking Service running on port ${PORT}`);
});