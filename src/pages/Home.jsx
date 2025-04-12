import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaMapMarkerAlt, FaChair } from 'react-icons/fa';

const Home = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheater, setSelectedTheater] = useState(null);

  useEffect(() => {
    // Mock data - replace with API call
    const mockTheaters = [
      {
        id: 1,
        name: 'PVR Cinemas',
        location: 'Mumbai',
        screens: [
          { id: 1, type: 'Gold', totalSeats: 100, availableSeats: 80 },
          { id: 2, type: 'Max', totalSeats: 150, availableSeats: 120 },
          { id: 3, type: 'General', totalSeats: 200, availableSeats: 150 },
        ],
      },
      {
        id: 2,
        name: 'INOX Megaplex',
        location: 'Delhi',
        screens: [
          { id: 4, type: 'Gold', totalSeats: 120, availableSeats: 90 },
          { id: 5, type: 'Max', totalSeats: 180, availableSeats: 140 },
          { id: 6, type: 'General', totalSeats: 250, availableSeats: 200 },
        ],
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setTheaters(mockTheaters);
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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8 text-gray-800"
        >
          Movie Theaters
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {theaters.map((theater) => (
            <motion.div
              key={theater.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">{theater.name}</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    <FaMapMarkerAlt className="inline mr-1" />
                    {theater.location}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {theater.screens.map((screen) => (
                    <motion.div
                      key={screen.id}
                      whileHover={{ x: 5 }}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
                    >
                      <Link
                        to={`/book?theater=${theater.id}&screen=${screen.id}`}
                        className="block"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-gray-800">
                              <FaTicketAlt className="inline mr-2 text-blue-500" />
                              {screen.type} Screen
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              <FaChair className="inline mr-1" />
                              {screen.availableSeats}/{screen.totalSeats}
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {Math.round((screen.availableSeats / screen.totalSeats) * 100)}% Available
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 