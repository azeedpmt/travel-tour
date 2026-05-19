import { useState, useEffect } from 'react';
import { destinationService } from '../../services/destinationService';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import DestinationFormModal from '../../components/admin/DestinationFormModal';

interface Destination {
  _id: string;
  name: string;
  slug: string;
  heroTitle: string;
}

const AdminDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await destinationService.getAllDestinations();
      if (res.success) setDestinations(res.data);
    } catch (error) {
      toast.error('Failed to fetch destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this destination?')) return;
    try {
      const res = await destinationService.deleteDestination(id);
      if (res.success) {
        toast.success('Destination deleted');
        fetchDestinations();
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Destinations</h1>
        <button
          onClick={() => {
            setEditingDestination(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <FiPlus /> Add Destination
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Slug</th>
              <th className="px-6 py-3 text-left">Hero Title</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map(dest => (
              <tr key={dest._id} className="border-t">
                <td className="px-6 py-4">{dest.name}</td>
                <td className="px-6 py-4">{dest.slug}</td>
                <td className="px-6 py-4">{dest.heroTitle}</td>
                <td className="px-6 py-4">
                  <button onClick={() => { setEditingDestination(dest); setModalOpen(true); }} className="text-blue-600 mr-3"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(dest._id)} className="text-red-600"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DestinationFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchDestinations}
        destination={editingDestination}
      />
    </div>
  );
};

export default AdminDestinations;