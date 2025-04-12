import { Link } from 'react-router-dom';
import { FaHome, FaTicketAlt, FaHistory, FaUtensils } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <FaTicketAlt className="text-blue-600 text-2xl" />
            <span className="text-xl font-bold text-gray-800">MovieBook</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition"
            >
              <FaHome />
              <span>Home</span>
            </Link>
            <Link
              to="/bookings"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition"
            >
              <FaTicketAlt />
              <span>My Bookings</span>
            </Link>
            <Link
              to="/food"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition"
            >
              <FaUtensils />
              <span>Food & Beverages</span>
            </Link>
          </div>

          <div className="md:hidden">
            <button className="text-gray-600 hover:text-blue-600 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 