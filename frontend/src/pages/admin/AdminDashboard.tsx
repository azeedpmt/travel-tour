// pages/admin/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';   // <-- ADD THIS
import { realtimeService } from '../../services/realtimeService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_bookings: 0,
    total_revenue: 0,
    total_hotels: 0,
    total_deals: 0,
    total_food: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [bookingStatsRes, hotelsRes, dealsRes, foodRes] = await Promise.all([
        realtimeService.getBookingStats(),
        adminService.getAllHotels(),
        adminService.getAllDeals(),
        adminService.getAllFoodItems(),
      ]);

      setStats({
        total_bookings: bookingStatsRes.data?.total_bookings || 0,
        total_revenue: bookingStatsRes.data?.total_revenue || 0,
        total_hotels: hotelsRes.data?.length || 0,
        total_deals: dealsRes.data?.length || 0,
        total_food: foodRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3>Total Bookings</h3>
          <p className="text-2xl font-bold">{stats.total_bookings}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3>Total Revenue</h3>
          <p className="text-2xl font-bold">₹{stats.total_revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3>Hotels</h3>
          <p className="text-2xl font-bold">{stats.total_hotels}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3>Deals</h3>
          <p className="text-2xl font-bold">{stats.total_deals}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3>Food Items</h3>
          <p className="text-2xl font-bold">{stats.total_food}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;