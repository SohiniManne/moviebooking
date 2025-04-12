import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCouch, FaClock, FaCalendar, FaTicketAlt } from 'react-icons/fa';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const theaterId = searchParams.get('theater');
  const screenId = searchParams.get('screen');

  const [movieDetails, setMovieDetails] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [showTimes, setShowTimes] = useState([]);

  useEffect(() => {
    // Mock data - replace with API call
    const mockMovie = {
      title: 'Inception',
      duration: '2h 28min',
      rating: 'PG-13',
      price: 250
    };

    const mockShowTimes = [
      '10:00 AM',
      '1:30 PM',
      '4:30 PM',
      '7:30 PM',
      '10:30 PM'
    ];

    const generateSeats = () => {
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      const seatsPerRow = 10;
      return rows.flatMap(row =>
        Array.from({ length: seatsPerRow }, (_, i) => ({
          id: `${row}${i + 1}`,
          row,
          number: i + 1,
          status: Math.random() > 0.3 ? 'available' : 'booked'
        }))
      );
    };

    setTimeout(() => {
      setMovieDetails(mockMovie);
      setShowTimes(mockShowTimes);
      setAvailableSeats(generateSeats());
      setLoading(false);
    }, 1000);
  }, [theaterId, screenId]);

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
    } else {
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const getTotalAmount = () => {
    return selectedSeats.length * (movieDetails?.price || 0);
  };

  const handlePayment = () => {
    // Mock payment process
    navigate('/bookings');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <h1 className="text-3xl font-bold mb-4">{movieDetails.title}</h1>
        <div className="flex space-x-4 text-gray-600 mb-6">
          <span>{movieDetails.duration}</span>
          <span>•</span>
          <span>{movieDetails.rating}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Show Time</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {showTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded ${
                        selectedTime === time
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Select Seats</h2>
            <div className="grid grid-cols-10 gap-2">
              {availableSeats.map((seat) => (
                <button
                  key={seat.id}
                  onClick={() => seat.status === 'available' && toggleSeat(seat.id)}
                  disabled={seat.status === 'booked'}
                  className={`p-2 rounded ${
                    seat.status === 'booked'
                      ? 'bg-gray-300 cursor-not-allowed'
                      : selectedSeats.includes(seat.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  title={`${seat.row}${seat.number}`}
                >
                  <FaCouch className={seat.status === 'booked' ? 'text-gray-400' : ''} />
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {(selectedSeats.length > 0 && selectedDate && selectedTime) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4"
        >
          <div className="container mx-auto flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-sm text-gray-600">
                {selectedSeats.length} seats × ₹{movieDetails.price}
              </div>
              <div className="text-lg font-bold">
                Total: ₹{getTotalAmount()}
              </div>
            </div>
            <button 
              onClick={handlePayment}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
            >
              <FaTicketAlt />
              <span>Proceed to Pay</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Booking; 