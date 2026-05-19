import { Link } from 'react-router-dom';
import type { Deal, Hotel } from '../../types';
import { FiStar, FiCalendar, FiUsers, FiMapPin } from 'react-icons/fi';

interface DealCardProps {
  deal: Deal;
}

const DealCard = ({ deal }: DealCardProps) => {
  const hotel = deal.hotelId as Hotel;
  const discount = Math.round(((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100);
  const isAvailable = deal.status === 'active' && new Date(deal.endDate) > new Date();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img src={deal.images?.[0] || 'https://via.placeholder.com/400x300'} alt={deal.title} className="w-full h-full object-cover" />
        {discount > 0 && <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">{discount}% OFF</div>}
        {!isAvailable && <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"><span className="text-white font-bold px-3 py-1 bg-red-600 rounded-lg">Expired</span></div>}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{deal.title}</h3>
          <div className="flex items-center"><FiStar className="w-4 h-4 text-yellow-400 fill-current" /><span className="text-sm text-gray-600 ml-1">{deal.rating?.toFixed(1) || 'New'}</span></div>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <FiMapPin className="w-3 h-3 mr-1" />
          <span>{hotel?.name}, {hotel?.city}</span>
        </div>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{deal.description}</p>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-gray-500 text-sm"><FiCalendar className="w-3 h-3 mr-1" /><span>{deal.duration} days</span></div>
          <div className="flex items-center text-gray-500 text-sm"><FiUsers className="w-3 h-3 mr-1" /><span>{deal.maxBookings - deal.currentBookings} left</span></div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div><span className="text-gray-400 line-through text-sm">₹{deal.originalPrice}</span><span className="text-xl font-bold text-blue-600 ml-2">₹{deal.discountedPrice}</span><span className="text-gray-500 text-sm">/person</span></div>
          <Link to={`/deal/${deal._id}`} className={`px-4 py-2 rounded-lg font-medium ${isAvailable ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} onClick={(e) => !isAvailable && e.preventDefault()}>View Deal</Link>
        </div>
      </div>
    </div>
  );
};

export default DealCard;