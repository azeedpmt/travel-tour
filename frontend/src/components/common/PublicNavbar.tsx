// src/components/common/PublicNavbar.tsx
import { Link } from 'react-router-dom';
import { FiHome, FiInfo, FiPhone, FiLogIn } from 'react-icons/fi';

const PublicNavbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          TourTravel
        </Link>
        <div className="flex space-x-6">
          <Link to="/" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
            <FiHome /> Home
          </Link>
          <Link to="/about" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
            <FiInfo /> About
          </Link>
          <Link to="/contact" className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
            <FiPhone /> Contact
          </Link>
          <Link to="/login" className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <FiLogIn /> Sign-In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;