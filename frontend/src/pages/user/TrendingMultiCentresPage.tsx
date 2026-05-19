// src/pages/user/TrendingMultiCentresPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dealService } from '../../services/dealService';
import { formatCurrency } from '../../utils/format';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Footer from '../../components/common/Footer';

interface ItineraryItem {
  city: string;
  nights: number;
}

interface Deal {
  _id: string;
  title: string;
  description: string;
  hotelId: {
    name: string;
    city: string;
    country: string;
  };
  originalPrice: number;
  discountedPrice: number;
  duration: number;
  images: string[];
  rating: number;
  itinerary?: ItineraryItem[];   // new field for multi-centre
}

const TrendingMultiCentresPage = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      // Fetch deals that have the offerType 'trending-multi-centres'
      // Alternatively, we could fetch all deals and filter by a flag isMultiCentre = true
      const response = await dealService.getAllDeals({
        offerType: 'trending-multi-centres',
        limit: 20,
        page: 1,
      });
      if (response.success && response.data) {
        setDeals(response.data);
      } else {
        setDeals([]);
      }
    } catch (error) {
      console.error('Failed to fetch multi-centre deals:', error);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format the itinerary string (e.g., "Paris - 3 Nights | Venice - 3 Nights")
  const formatItinerary = (itinerary?: ItineraryItem[]) => {
    if (!itinerary || itinerary.length === 0) return null;
    return itinerary.map(item => `${item.city} - ${item.nights} Nights`).join(' | ');
  };

  // Helper to render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <div className="flex mb-3" style={{ color: '#CB2187' }}>
        {[...Array(fullStars)].map((_, i) => <span key={i}>★</span>)}
        {[...Array(emptyStars)].map((_, i) => <span key={i + fullStars}>☆</span>)}
      </div>
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white" style={{ fontFamily: "'Montserrat', sans-serif", color: '#4c4c4c' }}>
      
      {/* Hero Banner */}
      <section
        className="relative w-full flex items-center justify-center text-center overflow-hidden"
        style={{
          height: '450px',
          backgroundImage: `linear-gradient(rgba(0,43,91,0.6), rgba(0,43,91,0.6)), url('https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-4xl px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">
            Trending Multi‑Centres
          </h1>
          <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto mb-8">
            Exclusive 2026 & 2027 multi‑destination escapes curated by our travel experts.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> ATOL Protected
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 text-[10px] font-bold uppercase tracking-widest">
              Limited 2026/27 Availability
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        
        {/* Page Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: '#4c4c4c' }}>
            Trending Multi‑Centres
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <p className="max-w-2xl text-[15px] leading-relaxed opacity-90">
              Step into this week’s collection of stylish escapes where beach bliss meets sensible service and added luxuries come together to elevate your getaway.
            </p>
            <Link
              to="/deals"
              className="text-xs uppercase tracking-widest font-semibold border-b border-gray-400 hover:text-pink-600 hover:border-pink-600 transition-colors"
            >
              View all PlanMyLuxe exclusives
            </Link>
          </div>
        </header>

        {/* Deals List */}
        {deals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No multi‑centre deals available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {deals.map((deal) => (
              <div
                key={deal._id}
                className="group border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                style={{ borderColor: '#f1f1f1' }}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="lg:w-1/2 h-[300px] lg:h-auto relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url('${deal.images?.[0] || 'https://via.placeholder.com/1000x600?text=No+Image'}')`,
                      }}
                    ></div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      {/* Cities (from itinerary or hotel location) */}
                      <div className="text-[11px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: '#4c4c4c' }}>
                        {deal.itinerary && deal.itinerary.length > 0
                          ? deal.itinerary.map(i => i.city).join(', ')
                          : `${deal.hotelId?.city || 'Destination'}, ${deal.hotelId?.country || ''}`}
                      </div>

                      {/* Stars */}
                      {renderStars(deal.rating || 0)}

                      {/* Title */}
                      <h2 className="text-xl md:text-2xl font-bold leading-tight mb-3">
                        {deal.title}
                      </h2>

                      {/* Itinerary details */}
                      {deal.itinerary && deal.itinerary.length > 0 && (
                        <p className="text-sm font-semibold mb-4" style={{ color: '#CB2187' }}>
                          {formatItinerary(deal.itinerary)}
                        </p>
                      )}

                      {/* Description */}
                      <p className="text-sm text-gray-500 leading-relaxed mb-6">
                        {deal.description}
                      </p>
                    </div>

                    {/* CTA Section */}
                    <div className="flex justify-end">
                      <Link
                        to={`/deal/${deal._id}`}
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-lg text-white font-medium transition-transform active:scale-95"
                        style={{ backgroundColor: '#CB2187' }}
                      >
                        <span className="text-xs md:text-sm uppercase tracking-wide">
                          {deal.duration} Nights from <span className="text-lg font-bold">{formatCurrency(deal.discountedPrice)}</span> per person
                        </span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust Badges (same as before) */}
        <section className="bg-white py-16 mt-12 border-t border-b border-gray-100">
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-[#002b5b] text-xl">🛡️</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Fully Protected</p>
                <p className="text-xs font-bold text-[#1e293b]">ATOL & ABTA</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-[#002b5b] text-xl">🕒</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">24/7 Support</p>
                <p className="text-xs font-bold text-[#1e293b]">Concierge Service</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-[#002b5b] text-xl">🏆</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Best Price</p>
                <p className="text-xs font-bold text-[#1e293b]">Guarantee</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-[#002b5b] text-xl">💳</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Deposits</p>
                <p className="text-xs font-bold text-[#1e293b]">From £49pp</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-[#002b5b] text-xl">📞</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Expert Advice</p>
                <p className="text-xs font-bold text-[#1e293b]">UK Travel Agents</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default TrendingMultiCentresPage;