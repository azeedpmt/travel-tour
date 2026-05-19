import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { hotelService } from '../../services/hotelService';
import type { FoodItem, Hotel } from '../../types';
import { formatCurrency } from '../../utils/format';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import FoodFormModal from '../../components/admin/FoodFormModal';

const FoodManagement = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  
  
  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      fetchFoodItems();
    }
  }, [selectedHotel]);

  const fetchHotels = async () => {
    try {
      const response = await adminService.getAllHotels({ status: 'approved' });
      if (response.success) {
        setHotels(response.data);
        if (response.data.length > 0) {
          setSelectedHotel(response.data[0]._id);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch hotels');
    }
  };

  const fetchFoodItems = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllFoodItems({ hotelId: selectedHotel });
      if (response.success) {
        setFoodItems(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch food items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this food item?')) return;
    try {
      const response = await adminService.deleteFoodItem(id);
      if (response.success) {
        toast.success('Food item deleted successfully');
        fetchFoodItems();
      }
    } catch (error) {
      toast.error('Failed to delete food item');
    }
  };

  const handleAvailabilityToggle = async (item: FoodItem) => {
    try {
      const response = await adminService.updateFoodItem(item._id, { isAvailable: !item.isAvailable });
      if (response.success) {
        toast.success(`Food item ${!item.isAvailable ? 'available' : 'unavailable'}`);
        fetchFoodItems();
      }
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts'];
  const cuisines = ['Indian', 'Chinese', 'Italian', 'Continental', 'Thai', 'Mexican'];

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Food Management</h1>
        <button
          onClick={() => {
            setSelectedFood(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Food Item</span>
        </button>
      </div>

      {/* Hotel Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Hotel</label>
        <select
          value={selectedHotel}
          onChange={(e) => setSelectedHotel(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-64"
        >
          {hotels.map((hotel) => (
            <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
          ))}
        </select>
      </div>

      {/* Food Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuisine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dietary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {foodItems.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/40'}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.description?.slice(0, 50)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize">{item.category}</td>
                <td className="px-6 py-4 capitalize">{item.cuisine}</td>
                <td className="px-6 py-4">{formatCurrency(item.price)}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {item.isVegetarian && <span className="text-xs bg-green-100 text-green-700 px-1 rounded">Veg</span>}
                    {item.isVegan && <span className="text-xs bg-green-100 text-green-700 px-1 rounded">Vegan</span>}
                    {item.isGlutenFree && <span className="text-xs bg-yellow-100 text-yellow-700 px-1 rounded">GF</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAvailabilityToggle(item)}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                      title={item.isAvailable ? 'Make Unavailable' : 'Make Available'}
                    >
                      {item.isAvailable ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
                    </button>

                    <button
                      

                      // When "Add Food Item" button is clicked:
                     onClick={() => {
                    setSelectedFood(null);
                      setIsModalOpen(true);
                    }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                        add
                      <FiEdit2 className="w-4 h-4" />
                    </button>



                    <button
                      onClick={() => {
                        setSelectedFood(item);
                        setIsModalOpen(true);
                      }}

                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >

                      <FiEdit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
<FoodFormModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSuccess={fetchFoodItems}  // refresh list
  foodItem={selectedFood}
/>
    </div>
  



);
};

export default FoodManagement;