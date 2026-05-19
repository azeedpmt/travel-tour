import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import type { FoodItem, Hotel } from '../../types';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  foodItem?: FoodItem | null;
}

const FoodFormModal = ({ isOpen, onClose, onSuccess, foodItem }: Props) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Breakfast',
    cuisine: 'Indian',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    hotelId: '',
    images: ['', '', ''],
  });

  // Category options
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts'];
  const cuisines = ['Indian', 'Chinese', 'Italian', 'Continental', 'Thai', 'Mexican', 'Japanese', 'American'];

  useEffect(() => {
    if (isOpen) {
      fetchHotels();
      if (foodItem) {
        setFormData({
          name: foodItem.name,
          description: foodItem.description || '',
          price: foodItem.price,
          category: foodItem.category,
          cuisine: foodItem.cuisine,
          isVegetarian: foodItem.isVegetarian,
          isVegan: foodItem.isVegan,
          isGlutenFree: foodItem.isGlutenFree || false,
          hotelId: typeof foodItem.hotelId === 'string' ? foodItem.hotelId : foodItem.hotelId._id,
          images: foodItem.images?.length ? [...foodItem.images, ...Array(3).fill('')].slice(0, 3) : ['', '', ''],
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, foodItem]);

  const fetchHotels = async () => {
    try {
      const res = await adminService.getAllHotels({ status: 'approved' });
      if (res.success && res.data.length > 0) {
        setHotels(res.data);
        // Set default hotel if none selected
        if (!formData.hotelId && res.data[0]) {
          setFormData(prev => ({ ...prev, hotelId: res.data[0]._id }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Breakfast',
      cuisine: 'Indian',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      hotelId: hotels[0]?._id || '',
      images: ['', '', ''],
    });
  };

  const handleImageChange = (idx: number, value: string) => {
    const newImages = [...formData.images];
    newImages[idx] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Food name is required');
      return;
    }
    if (!formData.hotelId) {
      toast.error('Please select a hotel');
      return;
    }
    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    const validImages = formData.images.filter(url => url.trim() !== '');
    if (validImages.length === 0) {
      toast.error('Please provide at least one image URL');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      images: validImages,
    };

    setLoading(true);
    try {
      let res;
      if (foodItem) {
        res = await adminService.updateFoodItem(foodItem._id, payload);
      } else {
        res = await adminService.addFoodItem(payload);
      }
      if (res.success) {
        toast.success(foodItem ? 'Food item updated' : 'Food item created');
        onSuccess();
        onClose();
        resetForm();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{foodItem ? 'Edit Food Item' : 'Add New Food Item'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hotel Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel *</label>
            <select
              className="w-full border rounded-lg p-2"
              value={formData.hotelId}
              onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
              required
            >
              <option value="">Select a hotel</option>
              {hotels.map(hotel => (
                <option key={hotel._id} value={hotel._id}>{hotel.name} - {hotel.city}</option>
              ))}
            </select>
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder="Food Name *"
            className="w-full border rounded-lg p-2"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            rows={3}
            className="w-full border rounded-lg p-2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          {/* Price */}
          <input
            type="number"
            placeholder="Price (₹) *"
            className="w-full border rounded-lg p-2"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: +e.target.value })}
            required
          />

          {/* Category and Cuisine */}
          <div className="grid grid-cols-2 gap-4">
            <select
              className="border rounded-lg p-2"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              className="border rounded-lg p-2"
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
            >
              {cuisines.map(cui => <option key={cui} value={cui}>{cui}</option>)}
            </select>
          </div>

          {/* Dietary flags */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isVegetarian}
                onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
              />
              <span>Vegetarian</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isVegan}
                onChange={(e) => setFormData({ ...formData, isVegan: e.target.checked })}
              />
              <span>Vegan</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isGlutenFree}
                onChange={(e) => setFormData({ ...formData, isGlutenFree: e.target.checked })}
              />
              <span>Gluten Free</span>
            </label>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images (at least 1 URL)</label>
            {[0, 1, 2].map((idx) => (
              <input
                key={idx}
                type="url"
                placeholder={`Image URL ${idx + 1}`}
                className="w-full border rounded-lg p-2 mb-2"
                value={formData.images[idx]}
                onChange={(e) => handleImageChange(idx, e.target.value)}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (foodItem ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodFormModal;