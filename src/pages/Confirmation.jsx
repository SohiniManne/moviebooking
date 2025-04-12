import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Confirmation = () => {
  const { state } = useLocation();
  const booking = state?.booking;

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold text-red-600">No booking details found</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Booking Confirmed!</h1>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">Booking Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Booking ID</p>
                <p className="font-medium">{booking.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Seat Number</p>
                <p className="font-medium">{booking.seatNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Movie Time</p>
                <p className="font-medium">
                  {new Date(booking.movieTime).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="font-medium">₹{booking.totalAmount}</p>
              </div>
            </div>
          </div>

          {booking.foodItems && booking.foodItems.length > 0 && (
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">Food & Beverages</h2>
              <div className="space-y-2">
                {booking.foodItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>₹{item.price} x {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-800"
            >
              Return to Home
            </Link>
            <Link
              to={`/cancel/${booking.id}`}
              className="text-red-600 hover:text-red-800"
            >
              Cancel Booking
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Confirmation; 