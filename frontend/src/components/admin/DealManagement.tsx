import { useState, useEffect, useRef } from 'react';
import { adminService } from '../../services/adminService';
import { dealService } from '../../services/dealService';
import type { Deal, Hotel } from '../../types';
import { formatCurrency } from '../../utils/format';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import DealFormModal from './DealFormModal';

const DealManagement = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const hasFetched = useRef(false);

  // ✅ FIX: prevent multiple API calls
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await adminService.getAllDeals();
      if (response.success) {
        setDeals(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    try {
      const response = await adminService.deleteDeal(id);
      if (response.success) {
        toast.success('Deal deleted successfully');
        fetchDeals();
      }
    } catch (error) {
      toast.error('Failed to delete deal');
    }
  };

  const handleStatusToggle = async (deal: Deal) => {
    try {
      const newStatus = deal.status === 'active' ? 'inactive' : 'active';
      const response = await adminService.updateDeal(deal._id, { status: newStatus });
      if (response.success) {
        toast.success(`Deal ${newStatus}ed`);
        fetchDeals();
      }
    } catch (error) {
      toast.error('Failed to update deal status');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deal Management</h1>
        <button
          onClick={() => {
            setSelectedDeal(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Deal</span>
        </button>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => {
          const hotel = deal.hotelId as Hotel;
          return (
            <div key={deal._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative h-48">
                <img
                  src={deal.images?.[0] || 'https://via.placeholder.com/400x200'}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold ${
                  deal.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                }`}>
                  {deal.status}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{deal.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{hotel?.name}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{deal.description}</p>

                <div className="flex justify-between items-center mt-3">
                  <div>
                    <span className="text-gray-400 line-through text-sm">₹{deal.originalPrice}</span>
                    <span className="text-xl font-bold text-blue-600 ml-2">₹{deal.discountedPrice}</span>
                  </div>
                  <span className="text-sm text-gray-500">{deal.duration} days</span>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  <button
                    onClick={() => handleStatusToggle(deal)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      deal.status === 'active'
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {deal.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>

                  <div className="flex space-x-2">
                    <button data-testid={`deal-edit-${deal._id}`} 
                    aria-label="Edit deal"
                      onClick={() => {
                        setSelectedDeal(deal);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>

                    <button  data-testid={`deal-delete-${deal._id}`}  aria-label="Delete deal"
                      onClick={() => handleDelete(deal._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DealFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDeals}
        deal={selectedDeal}
      />
    </div>
  );
};

export default DealManagement;