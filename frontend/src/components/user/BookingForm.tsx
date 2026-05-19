import { useState, useEffect } from 'react';
import type { Deal, Hotel, FoodItem } from '../../types';
import { bookingService } from '../../services/bookingService';
import { hotelService } from '../../services/hotelService';
import { foodService } from '../../services/foodService';
import { useAppData } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/format';
import toast from 'react-hot-toast';

interface BookingFormProps {
  deal: Deal;
  hotel: Hotel;
  onSuccess: (bookingId: string, totalAmount: number) => void;
}

const BookingForm = ({ deal, hotel, onSuccess }: BookingFormProps) => {
  const { user } = useAppData();
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<Record<string, FoodItem[]>>({});
  const [selectedFood, setSelectedFood] = useState<{ itemId: string; quantity: number; price: number }[]>([]);
  const [availability, setAvailability] = useState<{ available: boolean; availableRooms: number } | null>(null);
  
  const [formData, setFormData] = useState({
    guestDetails: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      passportNumber: '',
      numberOfAdults: 1,
      numberOfChildren: 0,
    },
    checkInDate: deal.startDate.split('T')[0],
    checkOutDate: deal.endDate.split('T')[0],
    numberOfRooms: 1,
    specialRequests: '',
  });

  useEffect(() => {
    checkAvailability();
    fetchMenu();
  }, [formData.checkInDate, formData.checkOutDate, formData.numberOfRooms]);

  const checkAvailability = async () => {
    try {
      const response = await bookingService.checkAvailability(
        hotel._id,
        formData.checkInDate,
        formData.checkOutDate,
        formData.numberOfRooms
      );
      if (response.success) {
        setAvailability(response.data);
      }
    } catch (error) {
      console.error('Failed to check availability:', error);
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await foodService.getMenuByHotel(hotel._id);
      if (response.success) {
        setMenuItems(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    }
  };

  const handleFoodSelect = (item: FoodItem, quantity: number) => {
    if (quantity === 0) {
      setSelectedFood(prev => prev.filter(f => f.itemId !== item._id));
    } else {
      setSelectedFood(prev => {
        const existing = prev.find(f => f.itemId === item._id);
        if (existing) {
          return prev.map(f => f.itemId === item._id ? { ...f, quantity, price: item.price } : f);
        }
        return [...prev, { itemId: item._id, quantity, price: item.price }];
      });
    }
  };

  const calculateTotal = () => {
    const dealPrice = deal.discountedPrice * formData.guestDetails.numberOfAdults;
    const foodPrice = selectedFood.reduce((sum, f) => sum + (f.price * f.quantity), 0);
    return dealPrice + foodPrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!availability?.available) {
      toast.error('Rooms not available for selected dates');
      return;
    }

    setLoading(true);
    
    try {
      const bookingData = {
        dealId: deal._id,
        hotelId: hotel._id,
        foodItems: selectedFood.map(f => ({ itemId: f.itemId, quantity: f.quantity })),
        guestDetails: formData.guestDetails,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfGuests: formData.guestDetails.numberOfAdults + formData.guestDetails.numberOfChildren,
        numberOfRooms: formData.numberOfRooms,
        totalAmount: calculateTotal(),
        specialRequests: formData.specialRequests,
      };

      const response = await bookingService.createBooking(bookingData);
      
      if (response.success) {
        toast.success('Booking created successfully!');
        onSuccess(response.data._id, calculateTotal());
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = calculateTotal();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Guest Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Guest Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.guestDetails.name}
            onChange={(e) => setFormData({
              ...formData,
              guestDetails: { ...formData.guestDetails, name: e.target.value }
            })}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.guestDetails.email}
            onChange={(e) => setFormData({
              ...formData,
              guestDetails: { ...formData.guestDetails, email: e.target.value }
            })}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.guestDetails.phone}
            onChange={(e) => setFormData({
              ...formData,
              guestDetails: { ...formData.guestDetails, phone: e.target.value }
            })}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Passport Number (Optional)"
            value={formData.guestDetails.passportNumber}
            onChange={(e) => setFormData({
              ...formData,
              guestDetails: { ...formData.guestDetails, passportNumber: e.target.value }
            })}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Adults</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.guestDetails.numberOfAdults}
                onChange={(e) => setFormData({
                  ...formData,
                  guestDetails: { ...formData.guestDetails, numberOfAdults: parseInt(e.target.value) }
                })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Children</label>
              <input
                type="number"
                min="0"
                max="5"
                value={formData.guestDetails.numberOfChildren}
                onChange={(e) => setFormData({
                  ...formData,
                  guestDetails: { ...formData.guestDetails, numberOfChildren: parseInt(e.target.value) }
                })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stay Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Stay Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Check-in Date</label>
            <input
              type="date"
              value={formData.checkInDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Check-out Date</label>
            <input
              type="date"
              value={formData.checkOutDate}
              min={formData.checkInDate}
              onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Number of Rooms</label>
            <input
              type="number"
              min="1"
              max={availability?.availableRooms || 10}
              value={formData.numberOfRooms}
              onChange={(e) => setFormData({ ...formData, numberOfRooms: parseInt(e.target.value) })}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        {availability && !availability.available && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            No rooms available for selected dates. Max available: {availability.availableRooms} rooms
          </div>
        )}
      </div>

      {/* Food Selection */}
      {Object.keys(menuItems).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Select Food Items</h3>
          {Object.entries(menuItems).map(([category, items]) => (
            <div key={category} className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2 capitalize">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((item) => {
                  const selected = selectedFood.find(f => f.itemId === item._id);
                  return (
                    <div key={item._id} className="flex justify-between items-center border rounded-lg p-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={selected?.quantity || 0}
                        onChange={(e) => handleFoodSelect(item, parseInt(e.target.value))}
                        className="w-20 border rounded-lg px-3 py-1 text-center"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Special Requests */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Special Requests (Optional)</h3>
        <textarea
          rows={3}
          value={formData.specialRequests}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          placeholder="Any special requests or preferences..."
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Price Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Price Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Package Price ({formData.guestDetails.numberOfAdults} adults)</span>
            <span>{formatCurrency(deal.discountedPrice * formData.guestDetails.numberOfAdults)}</span>
          </div>
          {selectedFood.length > 0 && (
            <div className="flex justify-between">
              <span>Food Items</span>
              <span>{formatCurrency(selectedFood.reduce((sum, f) => sum + (f.price * f.quantity), 0))}</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-blue-600">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !availability?.available}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </form>
  );
};

export default BookingForm;
