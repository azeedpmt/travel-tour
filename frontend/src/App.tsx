import LandingPage from '../src/pages/auth/LandingPage';
import PublicNavbar from './components/common/PublicNavbar';

import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProvider } from "./contexts/AppContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";
import Navbar from "./components/common/Navbar";
import AdminSidebar from "./components/admin/AdminSidebar";
import Login from "./pages/auth/Login";
import SelectRole from "./pages/SelectRole";
import HomePage from "./pages/user/HomePage";
import DealsPage from "./pages/user/DealsPage";
import HotelsPage from "./pages/user/HotelsPage";
import FoodPage from "./pages/user/FoodPage";
import DealDetailPage from "./pages/user/DealDetailPage";
import BookingPage from "./pages/user/BookingPage";
import MyBookingsPage from "./pages/user/MyBookingsPage";
import BookingSuccessPage from "./pages/user/BookingSuccessPage";
import EnquiryPage from "./pages/user/EnquiryPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHotels from "./pages/admin/AdminHotels";
import AdminDeals from "./pages/admin/AdminDeals";
import AdminFood from "./pages/admin/AdminFood";
import AdminBookings from "./pages/admin/AdminBookings";
import OfferPage from './pages/user/OfferPage';
import LastMinuteBargainsPage from './pages/user/LastMinuteBargainsPage';
import TrendingMultiCentresPage from './pages/user/TrendingMultiCentresPage';
import Summer2026EarlyDealsPage from './pages/user/Summer2026EarlyDealsPage';
import Top20LuxuryHolidayDealsPage from './pages/user/Top20LuxuryHolidayDealsPage';
import MitsisHotelGroupOffersPage from './pages/user/MitsisHotelGroupOffersPage';
import AllInclusiveHolidaysPage from './pages/user/AllInclusiveHolidaysPage';
import AdultsOnlyHolidaysPage from './pages/user/AdultsOnlyHolidaysPage';
import CityBreaksPage from './pages/user/CityBreaksPage';
import BeachHolidaysPage from './pages/user/BeachHolidaysPage';
import FamilyHolidaysPage from './pages/user/FamilyHolidaysPage';
import MultiCentreHolidaysPage from './pages/user/MultiCentreHolidaysPage';
import DestinationsPage from './pages/user/DestinationsPage';
import DestinationPage from './pages/user/DestinationPage';
import AdminOfferTypes from './pages/admin/AdminOfferTypes';
import AdminHolidayStyles from './pages/admin/AdminHolidayStyles';
import AdminDestinations from "./pages/admin/AdminDestinations";
import Footer from './components/common/Footer';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Admin layout: sidebar + main content
const AdminLayout = () => (
    <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-auto bg-gray-50">
            <Outlet />
        </main>
    </div>
);

const PublicLayout = () => (
 <div className="min-h-screen flex flex-col">
    <PublicNavbar />

    <main className="flex-1">
      <Outlet />
    </main>

    <Footer />
  </div>
);

// User layout: navbar + content
const UserLayout = () => (
    <>
        <Navbar />
        <Outlet />
    </>
);

function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AppProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public: login (redirects away if already authed) */}
                        <Route element={<PublicRoute />}>
                            <Route path="/login" element={<Login />} />
                        </Route>
                        <Route element={<PublicLayout />}>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/about" element={<div className="p-8 text-center">About Us – coming soon</div>} />
                            <Route path="/contact" element={<div className="p-8 text-center">Contact page – coming soon</div>} />
                            
                        </Route>
                        {/* Protected routes */}
                        <Route element={<ProtectedRoute />}>
                            {/* Admin routes — sidebar layout, no top navbar */}
                            <Route element={<AdminLayout />}>
                                <Route path="/admin" element={<AdminDashboard />} />
                                <Route path="/admin/hotels" element={<AdminHotels />} />
                                <Route path="/admin/deals" element={<AdminDeals />} />
                                <Route path="/admin/food" element={<AdminFood />} />
                                <Route path="/admin/bookings" element={<AdminBookings />} />
                                <Route path="/admin/offer-types" element={<AdminOfferTypes />} />
                                <Route path="/admin/holiday-styles" element={<AdminHolidayStyles />} />
                                <Route path="/admin/destinations" element={<AdminDestinations />} />
                            </Route>
                            {/* User routes — navbar layout */}
                            <Route element={<UserLayout />}>
                                <Route path="/home" element={<HomePage />} />
                                <Route path="/deals" element={<DealsPage />} />
                                <Route path="/hotels" element={<HotelsPage />} />
                                <Route path="/food" element={<FoodPage />} />
                                <Route path="/deal/:id" element={<DealDetailPage />} />
                                <Route path="/deal/:dealId" element={<BookingPage />} />
                                <Route path="/booking/:id" element={<BookingPage />} />
                                <Route path="/my-bookings" element={<MyBookingsPage />} />
                                <Route path="/booking-success/:id" element={<BookingSuccessPage />} />
                                <Route path="/enquiry" element={<EnquiryPage />} />
                                <Route path="/offers/:slug" element={<OfferPage />} />
                                <Route path="/offers/last-minute-bargains" element={<LastMinuteBargainsPage />} />
                                <Route path="/offers/trending-multi-centres" element={<TrendingMultiCentresPage />} />
                                <Route path="/offers/summer-2026-early-deals" element={<Summer2026EarlyDealsPage />} />
                                <Route path="/offers/5-star-luxury-for-less" element={<Top20LuxuryHolidayDealsPage />} />
                                <Route path="/offers/mitsis-hotel-group" element={<MitsisHotelGroupOffersPage />} />
                                <Route path="/holiday-style/all-inclusive" element={<AllInclusiveHolidaysPage />} />
                                <Route path="/holiday-style/adults-only" element={<AdultsOnlyHolidaysPage />} />
                                <Route path="/holiday-style/city-breaks" element={<CityBreaksPage />} />
                                <Route path="/holiday-style/beach-holidays" element={<BeachHolidaysPage />} />
                                <Route path="/holiday-style/family-holidays" element={<FamilyHolidaysPage />} />
                                 <Route path="/holiday-style/multi-centre" element={<MultiCentreHolidaysPage />} />
                                <Route path="/destinations" element={<DestinationsPage />} />
                                <Route path="/destination/:slug" element={<DestinationPage />} />
                                <Route path="/select-role" element={<SelectRole />} />
                            </Route>
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <Toaster position="top-right" />
                </BrowserRouter>
            </AppProvider>
        </GoogleOAuthProvider>
    );
}

export default App;