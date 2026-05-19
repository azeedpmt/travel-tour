import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">{import.meta.env.VITE_APP_NAME}</h3>
            <p className="text-sm">
              Discover amazing travel deals, book hotels, and create unforgettable memories with us.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-blue-400 transition">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                <FiInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
              <li><Link to="/deals" className="hover:text-blue-400 transition">Deals</Link></li>
              <li><Link to="/my-bookings" className="hover:text-blue-400 transition">My Bookings</Link></li>
              <li><Link to="/enquiry" className="hover:text-blue-400 transition">Enquiry</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Refund Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <FiMapPin className="w-4 h-4 flex-shrink-0" />
                <span>123 Travel Street, City</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail className="w-4 h-4 flex-shrink-0" />
                <span>support@tourtravel.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;