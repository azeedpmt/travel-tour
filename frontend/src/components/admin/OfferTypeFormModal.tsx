import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  offerType?: any;
}

const OfferTypeFormModal = ({ isOpen, onClose, onSuccess, offerType }: Props) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    heroTitle: '',
    heroSubtitle: '',
    description: '',
    order: 0,
    active: true
  });
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState('');
 



  useEffect(() => {
    if (offerType && isOpen) {
      setFormData({
        name: offerType.name,
        slug: offerType.slug,
        heroTitle: offerType.heroTitle,
        heroSubtitle: offerType.heroSubtitle,
        description: offerType.description,
        order: offerType.order,
        active: offerType.active
      });
      setHeroImagePreview(offerType.heroImage || '');
    } else if (isOpen && !offerType) {
      resetForm();
    }
  }, [offerType, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '', slug: '', heroTitle: '', heroSubtitle: '', description: '', order: 0, active: true
    });
    setHeroImageFile(null);
    setHeroImagePreview('');
  };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setHeroImageFile(file);
//       setHeroImagePreview(URL.createObjectURL(file));
//     }
//   };
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setHeroImageFile(file);
    setHeroImagePreview(URL.createObjectURL(file));
  }
};
  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.post('/deals/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data.url;
    } catch (error) {
      toast.error('Image upload failed');
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let heroImageUrl = offerType?.heroImage || '';
      if (heroImageFile) {
        heroImageUrl = await uploadImage(heroImageFile);
        if (!heroImageUrl) throw new Error('Upload failed');
      }
      const payload = { ...formData, heroImage: heroImageUrl };
      let res;
      if (offerType) res = await adminService.updateOfferType(offerType._id, payload);
      else res = await adminService.createOfferType(payload);
      if (res.success) {
        toast.success(offerType ? 'Offer type updated' : 'Offer type created');
        onSuccess();
        onClose();
        resetForm();
      }
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };
//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   const submitData = new FormData();
//   Object.entries(formData).forEach(([key, val]) => submitData.append(key, String(val)));
//   if (heroImageFile) submitData.append('heroImage', heroImageFile);
  
//   // call service
//   if (editing) await adminService.updateOfferType(id, submitData);
//   else await adminService.createOfferType(submitData);
// };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto my-8">
        <h2 className="text-xl font-bold mb-4">{offerType ? 'Edit Offer Type' : 'New Offer Type'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Name (e.g. Trending Top Deals)" required className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="text" placeholder="Slug (e.g. trending-top-deals)" required className="w-full border p-2 rounded" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
          <input type="text" placeholder="Hero Title" required className="w-full border p-2 rounded" value={formData.heroTitle} onChange={e => setFormData({...formData, heroTitle: e.target.value})} />
          <input type="text" placeholder="Hero Subtitle" required className="w-full border p-2 rounded" value={formData.heroSubtitle} onChange={e => setFormData({...formData, heroSubtitle: e.target.value})} />
          <textarea placeholder="Description" rows={3} required className="w-full border p-2 rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <input type="number" placeholder="Order (for navbar sorting)" className="w-full border p-2 rounded" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} />
            <span>Active (show in navbar)</span>
          </label>
          <div>
            <label className="block text-sm font-medium mb-1">Hero Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded" />
            {heroImagePreview && <img src={heroImagePreview} className="h-32 mt-2 object-cover rounded" alt="preview" />}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading || uploading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {loading || uploading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferTypeFormModal;