const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get all screen types
router.get('/screen-types', async (req, res) => {
    try {
        const [screenTypes] = await db.query('SELECT * FROM screens');
        res.json(screenTypes);
    } catch (error) {
        console.error('Error fetching screen types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get food items
router.get('/food-items', async (req, res) => {
    try {
        const [foodItems] = await db.query('SELECT * FROM food_items');
        res.json(foodItems);
    } catch (error) {
        console.error('Error fetching food items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create booking with food order
router.post('/create', authenticateToken, async (req, res) => {
    const { showtime_id, screen_type, num_tickets, food_items } = req.body;
    const user_id = req.user.id;

    try {
        // Start transaction
        await db.query('START TRANSACTION');

        // Get screen price
        const [screens] = await db.query(
            'SELECT price_per_ticket FROM screens WHERE screen_type = ?',
            [screen_type]
        );
        const ticketPrice = screens[0].price_per_ticket;

        // Calculate total ticket price
        const totalTicketPrice = ticketPrice * num_tickets;

        // Create booking
        const [bookingResult] = await db.query(
            'INSERT INTO bookings (user_id, showtime_id, screen_type, num_tickets, total_price) VALUES (?, ?, ?, ?, ?)',
            [user_id, showtime_id, screen_type, num_tickets, totalTicketPrice]
        );
        const booking_id = bookingResult.insertId;

        // Process food orders if any
        let totalFoodPrice = 0;
        if (food_items && food_items.length > 0) {
            // Calculate discount based on screen type
            const discount = screen_type === 'Gold' ? 0.10 : screen_type === 'Max' ? 0.05 : 0;

            for (const item of food_items) {
                const [foodItem] = await db.query(
                    'SELECT price FROM food_items WHERE id = ?',
                    [item.food_item_id]
                );
                const basePrice = foodItem[0].price;
                const discountedPrice = basePrice * (1 - discount);
                const finalPrice = discountedPrice * item.quantity;

                await db.query(
                    'INSERT INTO food_orders (booking_id, food_item_id, quantity, price, discount_percentage, final_price) VALUES (?, ?, ?, ?, ?, ?)',
                    [booking_id, item.food_item_id, item.quantity, basePrice, discount * 100, finalPrice]
                );

                totalFoodPrice += finalPrice;
            }
        }

        // Update total price in booking
        const totalPrice = totalTicketPrice + totalFoodPrice;
        await db.query(
            'UPDATE bookings SET total_price = ? WHERE id = ?',
            [totalPrice, booking_id]
        );

        // Update available seats
        await db.query(
            'UPDATE showtimes SET available_seats = available_seats - ? WHERE id = ?',
            [num_tickets, showtime_id]
        );

        // Commit transaction
        await db.query('COMMIT');

        res.json({
            message: 'Booking created successfully',
            booking_id,
            total_price: totalPrice
        });
    } catch (error) {
        // Rollback transaction on error
        await db.query('ROLLBACK');
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get booking details with food orders
router.get('/:id', authenticateToken, async (req, res) => {
    const booking_id = req.params.id;
    const user_id = req.user.id;

    try {
        const [bookings] = await db.query(
            `SELECT b.*, m.title as movie_title, s.show_date, s.show_time, 
                    sc.screen_type, sc.price_per_ticket
             FROM bookings b
             JOIN showtimes s ON b.showtime_id = s.id
             JOIN movies m ON s.movie_id = m.id
             JOIN screens sc ON s.screen_id = sc.id
             WHERE b.id = ? AND b.user_id = ?`,
            [booking_id, user_id]
        );

        if (bookings.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const [foodOrders] = await db.query(
            `SELECT fo.*, fi.name as food_item_name
             FROM food_orders fo
             JOIN food_items fi ON fo.food_item_id = fi.id
             WHERE fo.booking_id = ?`,
            [booking_id]
        );

        res.json({
            ...bookings[0],
            food_orders: foodOrders
        });
    } catch (error) {
        console.error('Error fetching booking details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 