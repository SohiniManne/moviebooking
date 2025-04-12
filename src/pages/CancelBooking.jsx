import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cancelBooking, getBookingDetails } from '../services/api';

const CancelBooking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useState(() => {
    const fetchBookingDetails = async () => {
      try {
        const data = await getBookingDetails(bookingId);
        setBooking(data);
      } catch (error) {
        setError('Booking not found');
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const response = await cancelBooking(bookingId);
      navigate('/confirmation', {
        state: {
          booking: response.booking,
          message: 'Booking cancelled successfully',
          refundAmount: response.refundAmount,
        },
      });
    } catch (error) {
      setError(error.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold">Loading...</h2>
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
        <h1 className="text-3xl font-bold text-center mb-8">Cancel Booking</h1>

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

          <div className="bg-yellow-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">
              Cancellation Policy
            </h3>
            <p className="text-yellow-700">
              You can cancel your booking up to 30 minutes before the movie time.
              The full amount will be refunded upon cancellation.
            </p>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Return to Home
            </button>
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CancelBooking; 