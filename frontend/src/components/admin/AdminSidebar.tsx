import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiTag, FiCoffee, FiBookOpen, 
  FiSettings, FiUsers, FiBarChart2,FiLogOut, FiUser 
} from 'react-icons/fi';
import { useAppData } from '../../contexts/AppContext';
import toast from 'react-hot-toast';
import { FiMapPin, FiSun } from 'react-icons/fi';

const menuItems = [
  // { path: '/admin/dashboard', label: 'Dashboard', icon: FiBarChart2 },
  { path: '/admin/hotels', label: 'Hotels', icon: FiHome },
  { path: '/admin/deals', label: 'Deals', icon: FiTag },
  { path: '/admin/food', label: 'Food Items', icon: FiCoffee },
  { path: '/admin/bookings', label: 'Bookings', icon: FiBookOpen },
  { path: '/admin/destinations', label: 'Destinations', icon: FiMapPin },
  { path: '/admin/offer-types', label: 'Offer Types', icon: FiTag },
  { path: '/admin/holiday-styles', label: 'Holiday Styles', icon: FiSun },
  // { path: '/admin/users', label: 'Users', icon: FiUsers },
  // { path: '/admin/settings', label: 'Settings', icon: FiSettings },
];

const AdminSidebar = () => {
   const { user, logout } = useAppData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-sm text-gray-400">Manage your platform</p>
      </div>
      
      <nav className="p-4">
        
        {menuItems.map((item) => (
        
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

    {/* User Profile & Logout Section at Bottom */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
            ) : (
              <FiUser className="w-5 h-5 text-gray-300" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;