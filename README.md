# Movie Booking Web Application

A full-stack movie booking web application built with Node.js, Express, MySQL, and React.

## Features

- Browse and book tickets for different theater locations
- Choose screen types with automatic seat allocation
- Add food & beverage items with dynamic pricing and discounts
- Handle booking cancellations and waiting list system
- Real-time seat availability
- Mobile-responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM

### Frontend (Coming Soon)
- React
- Tailwind CSS
- React Router
- Axios

## API Endpoints

### Booking
- `POST /api/book` - Create a new booking
- `POST /api/cancel/:bookingId` - Cancel a booking
- `GET /api/booking/:bookingId` - Get booking details

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=moviebooking
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Database Schema

### Theater
- id (INT, PK)
- name (STRING)
- location (STRING)

### Screen
- id (INT, PK)
- type (ENUM: 'Gold', 'Max', 'General')
- totalSeats (INT)
- theaterId (INT, FK)

### Booking
- id (INT, PK)
- userName (STRING)
- seatNumber (INT)
- totalAmount (DECIMAL)
- movieTime (DATE)
- status (ENUM: 'booked', 'cancelled')
- theaterId (INT, FK)
- screenId (INT, FK)

### FoodItem
- id (INT, PK)
- name (STRING)
- price (DECIMAL)

### WaitingList
- id (INT, PK)
- userName (STRING)
- movieTime (DATE)
- theaterId (INT, FK)
- screenId (INT, FK)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 