import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaCalendar, FaClock, FaChair } from 'react-icons/fa';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    const mockBookings = [
      {
        id: 1,
        theater: 'PVR Cinemas',
        screen: 'Gold',
        movie: 'Inception',
        date: '2024-04-10',
        time: '18:30',
        seats: ['A1', 'A2'],
        totalAmount: 500
      },
      {
        id: 2,
        theater: 'INOX Megaplex',
        screen: 'Max',
        movie: 'The Dark Knight',
        date: '2024-04-15',
        time: '20:00',
        seats: ['B5', 'B6', 'B7'],
        totalAmount: 750
      }
    ];

    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-8 text-gray-800"
      >
        My Bookings
      </motion.h1>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{booking.movie}</h2>
                  <p className="text-gray-600">{booking.theater} - {booking.screen} Screen</p>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
                  ₹{booking.totalAmount}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <FaCalendar className="mr-2" />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaClock className="mr-2" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaChair className="mr-2" />
                  <span>Seats: {booking.seats.join(', ')}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaTicketAlt className="mr-2" />
                  <span>Booking ID: {booking.id}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                  Download Ticket
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                  Cancel Booking
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings; 