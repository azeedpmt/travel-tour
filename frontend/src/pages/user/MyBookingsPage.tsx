import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import type { Booking, Hotel, Deal } from '../../types';   // add Hotel, Deal
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/format';
import { FiCalendar, FiMapPin, FiEye } from 'react-icons/fi';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getUserBookings();
      if (response.success) setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">You haven't made any bookings yet.</p>
          <Link to="/deals" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Browse Deals
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const hotel = booking.hotelId as Hotel;
            const associatedDeal = booking.dealId as Deal | undefined;
            return (
              <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{hotel?.name || 'N/A'}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.bookingStatus)}`}>
                          {booking.bookingStatus}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <FiMapPin className="w-3 h-3 mr-1" />
                        <span>{hotel?.city}, {hotel?.state}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center text-gray-500">
                          <FiCalendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}</span>
                        </div>
                      </div>
                      {associatedDeal && (
                        <p className="text-sm text-gray-600 mt-2">Package: {associatedDeal.title}</p>
                      )}
                    </div>
                    <div className="text-right mt-4 sm:mt-0">
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(booking.totalAmount)}</p>
                      <Link
                        to={`/booking-success/${booking._id}`}
                        className="inline-flex items-center mt-3 text-blue-600 hover:underline text-sm"
                      >
                        <FiEye className="w-4 h-4 mr-1" /> View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;