// src/components/admin/DealFormModal.tsx
import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { destinationService } from '../../services/destinationService';
import type { Deal, Hotel } from '../../types';
import toast from 'react-hot-toast';
import { api } from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  deal?: Deal | null;
}

const DealFormModal = ({ isOpen, onClose, onSuccess, deal }: Props) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [whyLoveInput, setWhyLoveInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [tempImages, setTempImages] = useState<string[]>(['', '', '']);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hotelId: '',
    originalPrice: 0,
    discountedPrice: 0,
    duration: 1,
    startDate: '',
    endDate: '',
    maxBookings: 10,
    includes: '',
    excludes: '',
    images: ['', '', ''],
    offerType: '',
    holidayStyle: '',
    excursion: { title: '', description: '', included: false },
    whyLove: [] as string[],
    destinationId: '',
    rating: 0,
  });

  // Calculate discount percent for display
  const discountPercent =
    formData.originalPrice && formData.discountedPrice
      ? Math.round(((formData.originalPrice - formData.discountedPrice) / formData.originalPrice) * 100)
      : 0;

  const offerTypes = [
    { value: '', label: 'None' },
    { value: 'trending-top-deals', label: 'Trending Top Deals' },
    { value: 'last-minute-bargains', label: 'Last‑Minute Bargains' },
    { value: 'trending-multi-centres', label: 'Trending Multi Centres' },
    { value: 'summer-2026-early-deals', label: 'Summer 2026 - Early Deals' },
    { value: '5-star-luxury-for-less', label: '5-Star Luxury - For Less' },
    { value: 'mitsis-hotel-group', label: 'Mitsis Hotel Group Offers' },
  ];

  const holidayStyles = [
    { value: '', label: 'None' },
    { value: 'all-inclusive', label: 'All Inclusive Holidays' },
    { value: 'adults-only', label: 'Adults Only Holidays' },
    { value: 'city-breaks', label: 'City Breaks' },
    { value: 'beach-holidays', label: 'Beach Holidays' },
    { value: 'family-holidays', label: 'Family Holidays' },
    { value: 'multi-centre', label: 'Multi Centre Holidays' },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchHotels();
      fetchDestinations();
    }
    if (deal && isOpen) populateFromDeal();
    else if (isOpen && !deal) resetForm();
  }, [isOpen, deal]);

  const fetchHotels = async () => {
    const res = await adminService.getAllHotels({ status: 'approved' });
    if (res.success) setHotels(res.data);
  };

  const fetchDestinations = async () => {
    try {
      const res = await destinationService.getAllDestinations();
      if (res.success) setDestinations(res.data);
    } catch (error) {
      console.error('Failed to fetch destinations:', error);
    }
  };

  const handleImageUpload = async (idx: number, file: File) => {
    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);
    try {
      const res = await api.post('/deals/upload-image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = res.data.data.url;
      const newTempImages = [...tempImages];
      newTempImages[idx] = imageUrl;
      setTempImages(newTempImages);
      setFormData({
        ...formData,
        images: newTempImages.filter((u) => u !== ''),
      });
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const populateFromDeal = () => {
    setFormData({
      title: deal!.title,
      description: deal!.description,
      hotelId: typeof deal!.hotelId === 'string' ? deal!.hotelId : (deal!.hotelId as Hotel)._id,
      originalPrice: deal!.originalPrice,
      discountedPrice: deal!.discountedPrice,
      duration: deal!.duration,
      startDate: deal!.startDate.split('T')[0],
      endDate: deal!.endDate.split('T')[0],
      maxBookings: deal!.maxBookings,
      includes: deal!.includes?.join(', ') || '',
      excludes: deal!.excludes?.join(', ') || '',
      images: deal!.images?.length ? [...deal!.images, ...Array(3).fill('')].slice(0, 3) : ['', '', ''],
      offerType: (deal as any).offerType || '',
      holidayStyle: (deal as any).holidayStyle || '',
      excursion: (deal as any).excursion || { title: '', description: '', included: false },
      whyLove: (deal as any).whyLove || [],
      destinationId: (deal as any).destinationId || '',
      rating: deal!.rating || 0,
    });
    setWhyLoveInput('');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      hotelId: '',
      originalPrice: 0,
      discountedPrice: 0,
      duration: 1,
      startDate: '',
      endDate: '',
      maxBookings: 10,
      includes: '',
      excludes: '',
      images: ['', '', ''],
      offerType: '',
      holidayStyle: '',
      excursion: { title: '', description: '', included: false },
      whyLove: [],
      destinationId: '',
      rating: 0,
    });
    setWhyLoveInput('');
  };

  const addWhyLove = () => {
    if (whyLoveInput.trim()) {
      setFormData({ ...formData, whyLove: [...formData.whyLove, whyLoveInput.trim()] });
      setWhyLoveInput('');
    }
  };

  const removeWhyLove = (idx: number) => {
    setFormData({ ...formData, whyLove: formData.whyLove.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validImages = formData.images.filter((url) => url.trim() !== '');
    if (validImages.length < 3) {
      toast.error('Please add at least 3 image URLs');
      return;
    }
    const payload = {
      ...formData,
      includes: formData.includes.split(',').map((s) => s.trim()),
      excludes: formData.excludes.split(',').map((s) => s.trim()),
      images: validImages,
      originalPrice: Number(formData.originalPrice),
      discountedPrice: Number(formData.discountedPrice),
      whyLove: formData.whyLove,
      destinationId: formData.destinationId || undefined,
      rating: Number(formData.rating),
    };
    setLoading(true);
    try {
      let res;
      if (deal) res = await adminService.updateDeal(deal._id, payload);
      else res = await adminService.addDeal(payload);
      if (res.success) {
        toast.success(deal ? 'Deal updated' : 'Deal created');
        onSuccess();
        onClose();
        resetForm();
      }
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{deal ? 'Edit Deal' : 'Create New Deal'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <input
            type="text"
            placeholder="Deal Title *"
            className="w-full border p-2 rounded"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <textarea
            placeholder="Description *"
            rows={3}
            className="w-full border p-2 rounded"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          {/* Hotel & Destination */}
          <select
            className="w-full border p-2 rounded"
            required
            value={formData.hotelId}
            onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
          >
            <option value="">Select Hotel *</option>
            {hotels.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>

          <div>
            <label className="block text-sm font-medium mb-1">Destination (Optional)</label>
            <select
              className="w-full border p-2 rounded"
              value={formData.destinationId}
              onChange={(e) => setFormData({ ...formData, destinationId: e.target.value })}
            >
              <option value="">None</option>
              {destinations.map((dest) => (
                <option key={dest._id} value={dest._id}>
                  {dest.name} ({dest.slug})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Link this deal to a destination – it will appear on that destination page.
            </p>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Original Price (£) *"
              className="border p-2 rounded"
              required
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: +e.target.value })}
            />
            <input
              type="number"
              placeholder="Discounted Price (£) *"
              className="border p-2 rounded"
              required
              value={formData.discountedPrice}
              onChange={(e) => setFormData({ ...formData, discountedPrice: +e.target.value })}
            />
          </div>
          {/* Discount percent display (auto-calculated) */}
          <div className="text-sm text-gray-600">
            Discount: <span className="font-semibold">{discountPercent}%</span> (auto‑calculated)
          </div>

          {/* Dates & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              className="border p-2 rounded"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <input
              type="date"
              className="border p-2 rounded"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
            <input
              type="number"
              placeholder="Duration (days) *"
              required
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: +e.target.value })}
            />
            <input
              type="number"
              placeholder="Max Bookings *"
              required
              value={formData.maxBookings}
              onChange={(e) => setFormData({ ...formData, maxBookings: +e.target.value })}
            />
          </div>

          {/* Includes / Excludes */}
          <input
            type="text"
            placeholder="What’s included (comma separated)"
            className="w-full border p-2 rounded"
            value={formData.includes}
            onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
          />
          <input
            type="text"
            placeholder="What’s excluded (comma separated)"
            className="w-full border p-2 rounded"
            value={formData.excludes}
            onChange={(e) => setFormData({ ...formData, excludes: e.target.value })}
          />

          {/* Images upload */}
          <label className="font-semibold">Images (at least 3 uploads)</label>
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="mt-2">
              <input
                type="file"
                accept="image/*"
                className="w-full border p-2 rounded mt-1"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(idx, e.target.files[0])}
              />
              {tempImages[idx] && (
                <img
                  src={tempImages[idx]}
                  alt={`Preview ${idx + 1}`}
                  className="h-20 mt-1 rounded shadow-sm"
                />
              )}
            </div>
          ))}

          {/* Offer Type & Holiday Style */}
          <div>
            <label className="block text-sm font-medium mb-1">Offer Type</label>
            <select
              className="w-full border p-2 rounded"
              value={formData.offerType}
              onChange={(e) => setFormData({ ...formData, offerType: e.target.value })}
            >
              {offerTypes.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Holiday Style</label>
            <select
              className="w-full border p-2 rounded"
              value={formData.holidayStyle}
              onChange={(e) => setFormData({ ...formData, holidayStyle: e.target.value })}
            >
              {holidayStyles.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Excursion */}
          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">Excursion (Optional)</h3>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={formData.excursion.included}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    excursion: { ...formData.excursion, included: e.target.checked },
                  })
                }
              />
              <span>Include an excursion</span>
            </label>
            <input
              type="text"
              placeholder="Excursion Title"
              className="w-full border p-2 rounded my-1"
              value={formData.excursion.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  excursion: { ...formData.excursion, title: e.target.value },
                })
              }
            />
            <textarea
              placeholder="Excursion Description"
              rows={3}
              className="w-full border p-2 rounded"
              value={formData.excursion.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  excursion: { ...formData.excursion, description: e.target.value },
                })
              }
            />
          </div>

          {/* Why Love */}
          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">Why we love this hotel (reasons)</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Close to the beach"
                className="flex-1 border p-2 rounded"
                value={whyLoveInput}
                onChange={(e) => setWhyLoveInput(e.target.value)}
              />
              <button
                type="button"
                onClick={addWhyLove}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.whyLove.map((item, idx) => (
                <div key={idx} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeWhyLove(idx)}
                    className="text-red-500 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-1">Initial Rating (0–5)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="0"
              className="w-full border p-2 rounded"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: +e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Rating will be updated automatically from user reviews; this sets an initial value.
            </p>
          </div>

          {/* Reviews Note (Reviews are user‑submitted) */}
          <div className="text-sm text-gray-500 border-t pt-2">
            ⓘ Reviews are added by customers – they cannot be managed from this form.
          </div>

          {/* Note for sidebar calendar pricing (frontend) */}
          <div className="text-sm text-gray-500 bg-blue-50 p-2 rounded">
            💡 The right sidebar calendar in the deal detail page will automatically calculate prices
            per day based on the discounted price and duration. No extra fields needed.
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {loading ? 'Saving...' : deal ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealFormModal;