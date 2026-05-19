import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import type { Hotel } from '../../types';
import { formatCurrency } from '../../utils/format';
import toast from 'react-hot-toast';
import { FiEye, FiCheck, FiX, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import HotelFormModal from './HotelFormModal';

const HotelManagement = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchHotels();
  }, [filter]);

  const fetchHotels = async () => {
    try {
      const response = await adminService.getAllHotels({ status: filter });
      if (response.success) {
        setHotels(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string, isVerified: boolean, status: string) => {
    try {
      const response = await adminService.verifyHotel(id, isVerified, status);
      if (response.success) {
        toast.success(`Hotel ${status} successfully`);
        fetchHotels();
      }
    } catch (error) {
      toast.error('Failed to update hotel status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hotel?')) return;
    try {
      // Add delete endpoint or use update with status
      toast.success('Hotel deleted successfully');
      fetchHotels();
    } catch (error) {
      toast.error('Failed to delete hotel');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hotel Management</h1>
        <button
          onClick={() => {
            setSelectedHotel(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Hotel</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {['pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Hotels Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {hotels.map((hotel) => (
              <tr key={hotel._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={hotel.images?.[0] || 'https://via.placeholder.com/40'}
                      alt={hotel.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{hotel.name}</p>
                      <p className="text-sm text-gray-500">{hotel.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{hotel.ownerName}</td>
                <td className="px-6 py-4">{hotel.city}, {hotel.state}</td>
                <td className="px-6 py-4">{hotel.rating || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(hotel.status)}`}>
                    {hotel.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {hotel.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleVerify(hotel._id, true, 'approved')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Approve"
                        >
                          <FiCheck className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleVerify(hotel._id, false, 'rejected')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Reject"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setSelectedHotel(hotel);
                        setIsModalOpen(true);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(hotel._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HotelFormModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSuccess={fetchHotels}
  hotel={selectedHotel}
/>
    </div>
  );
};

export default HotelManagement;