import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { dealService } from '../../services/dealService';
import { hotelService } from '../../services/hotelService';
import type{ Booking, Deal, Hotel } from '../../types';
import BookingConfirmation from '../../components/user/BookingConfirmation';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const BookingSuccessPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [deal, setDeal] = useState<Deal | undefined>(undefined);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    if (!id) return;
    try {
      const response = await bookingService.getBookingById(id);
      if (response.success) {
        setBooking(response.data);
        
        // Fetch hotel details
        const hotelRes = await hotelService.getHotelById(response.data.hotelId._id);
        if (hotelRes.success) {
          setHotel(hotelRes.data);
        }
        
        // Fetch deal details if exists
        if (response.data.dealId) {
          const dealRes = await dealService.getDealById(response.data.dealId._id);
          if (dealRes.success) {
            setDeal(dealRes.data);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = () => {
    console.log('Ticket downloaded');
  };

  if (loading) return <LoadingSpinner />;
  if (!booking || !hotel) return <div className="text-center py-16">Booking not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <BookingConfirmation
        booking={booking}
        deal={deal}
        hotel={hotel}
        onDownloadTicket={handleDownloadTicket}
      />
      
      <div className="text-center mt-8">
        <Link
          to="/my-bookings"
          className="inline-block px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 mr-4"
        >
          View All Bookings
        </Link>
        <Link
          to="/deals"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Browse More Deals
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccessPage;