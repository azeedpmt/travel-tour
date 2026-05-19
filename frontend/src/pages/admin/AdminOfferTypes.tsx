import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import OfferTypeFormModal from '../../components/admin/OfferTypeFormModal';

interface OfferType {
  _id: string;
  name: string;
  slug: string;
  heroTitle: string;
  heroSubtitle: string;
  description: string;
  order: number;
  active: boolean;
  heroImage: string;
}

const AdminOfferTypes = () => {
  const [offerTypes, setOfferTypes] = useState<OfferType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOfferType, setEditingOfferType] = useState<OfferType | null>(null);

  useEffect(() => {
    fetchOfferTypes();
  }, []);

  const fetchOfferTypes = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllOfferTypes();
      if (res.success) setOfferTypes(res.data);
    } catch (error) {
      toast.error('Failed to fetch offer types');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this offer type? This will not delete deals, but deals will lose this association.')) return;
    try {
      const res = await adminService.deleteOfferType(id);
      if (res.success) {
        toast.success('Offer type deleted');
        fetchOfferTypes();
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Offer Types</h1>
        <button
          onClick={() => {
            setEditingOfferType(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlus /> Add Offer Type
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hero Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {offerTypes.map((type) => (
              <tr key={type._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{type.name}</td>
                <td className="px-6 py-4">{type.slug}</td>
                <td className="px-6 py-4">{type.heroTitle}</td>
                <td className="px-6 py-4">{type.order}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    type.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {type.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setEditingOfferType(type);
                      setModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(type._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <OfferTypeFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchOfferTypes}
        offerType={editingOfferType}
      />
    </div>
  );
};

export default AdminOfferTypes;