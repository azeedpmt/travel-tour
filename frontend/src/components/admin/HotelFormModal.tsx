import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import type { Hotel } from '../../types';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hotel?: Hotel | null;
}
interface HotelRequest {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  description?: string;
  images: string[];
  amenities: string[];   // matches backend
}
const HotelFormModal = ({ isOpen, onClose, onSuccess, hotel }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    description: '',
    images: ['', '', ''],
    amenities: '',
  });

  useEffect(() => {
    if (isOpen && hotel) {
      setFormData({
        name: hotel.name,
        ownerName: hotel.ownerName,
        email: hotel.email,
        phone: hotel.phone,
        address: hotel.address,
        city: hotel.city,
        state: hotel.state,
        pincode: hotel.pincode,
        description: hotel.description || '',
        images: hotel.images?.length ? [...hotel.images, ...Array(3).fill('')].slice(0,3) : ['', '', ''],
        amenities: hotel.amenities?.join(', ') || '',
      });
    } else if (isOpen) {
      resetForm();
    }
  }, [isOpen, hotel]);

  const resetForm = () => {
    setFormData({
      name: '', ownerName: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
      description: '', images: ['', '', ''], amenities: ''
    });
  };

  const handleImageChange = (idx: number, value: string) => {
    const newImages = [...formData.images];
    newImages[idx] = value;
    setFormData({ ...formData, images: newImages });
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const validImages = formData.images.filter(url => url.trim() !== '');
  if (validImages.length === 0) {
    toast.error('Please provide at least one image URL');
    return;
  }

  const amenitiesArray = formData.amenities
    .split(',')
    .map(s => s.trim())
    .filter(s => s !== '');

  const payload:HotelRequest = {
    name: formData.name,
    ownerName: formData.ownerName,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
    description: formData.description,
    images: validImages,
    amenities: amenitiesArray,   // ✅ string[]
  };

  setLoading(true);
  try {
    let res;
    if (hotel) {
      res = await adminService.updateHotel(hotel._id, payload);
    } else {
      res = await adminService.addHotel(payload);
    }
    if (res.success) {
      toast.success(hotel ? 'Hotel updated' : 'Hotel created');
      onSuccess();
      onClose();
      resetForm();
    }
  } catch (error: any) {
    console.error('Hotel save error:', error);
    const message = error.response?.data?.error || error.message || 'Operation failed';
    toast.error(message);
  } finally {
    setLoading(false);
  }
};
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const validImages = formData.images.filter(url => url.trim() !== '');
  //   const payload = {
  //     ...formData,
  //     images: validImages,
  //     amenities: formData.amenities.split(',').map(s => ({ name: s.trim(), icon: 'default' })),
  //   };
  //   setLoading(true);
  //   try {
  //     let res;
  //     if (hotel) {
  //       res = await adminService.updateHotel(hotel._id, payload);
  //     } else {
  //       res = await adminService.addHotel(payload);
  //     }
  //     if (res.success) {
  //       toast.success(hotel ? 'Hotel updated' : 'Hotel created');
  //       onSuccess();
  //       onClose();
  //       resetForm();
  //     }
  //   } catch {
  //     toast.error('Operation failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{hotel ? 'Edit Hotel' : 'Add New Hotel'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Hotel Name" className="w-full border p-2 rounded" required
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="text" placeholder="Owner Name" className="w-full border p-2 rounded" required
            value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
          <input type="email" placeholder="Email" className="w-full border p-2 rounded" required
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="tel" placeholder="Phone" className="w-full border p-2 rounded" required
            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <input type="text" placeholder="Address" className="w-full border p-2 rounded" required
            value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="City" className="border p-2 rounded" required
              value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            <input type="text" placeholder="State" className="border p-2 rounded" required
              value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
          </div>
          <input type="text" placeholder="Pincode" className="w-full border p-2 rounded" required
            value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
          <textarea placeholder="Description" rows={3} className="w-full border p-2 rounded"
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <input type="text" placeholder="Amenities (comma separated)" className="w-full border p-2 rounded"
            value={formData.amenities} onChange={e => setFormData({...formData, amenities: e.target.value})} />
          <label className="font-semibold">Images (at least 3)</label>
          {[0,1,2].map(idx => (
            <input key={idx} type="url" placeholder={`Image URL ${idx+1}`} className="w-full border p-2 rounded mt-1"
              value={formData.images[idx]} onChange={e => handleImageChange(idx, e.target.value)} />
          ))}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? 'Saving...' : (hotel ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HotelFormModal;