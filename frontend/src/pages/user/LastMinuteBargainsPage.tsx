// src/pages/user/LastMinuteBargainsPage.tsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { dealService } from '../../services/dealService';
import { formatCurrency } from '../../utils/format';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Footer from '../../components/common/Footer';

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
}

const LastMinuteBargainsPage = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredDeal, setFeaturedDeal] = useState<Deal | null>(null);
  const [carouselDeals, setCarouselDeals] = useState<Deal[]>([]);
  const [trendingDeals, setTrendingDeals] = useState<Deal[]>([]);
  const [flashDeals, setFlashDeals] = useState<Deal[]>([]);

  // Refs for carousels
  const premierCarouselRef = useRef<HTMLDivElement>(null);
  const trendingCarouselRef = useRef<HTMLDivElement>(null);
  const flashCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllDeals();
  }, []);

  const fetchAllDeals = async () => {
    setLoading(true);
    try {
      const response = await dealService.getAllDeals({
        offerType: 'last-minute-bargains',
        limit: 20,
        page: 1,
      });
      if (response.success && response.data) {
        const allDeals = response.data;
        setDeals(allDeals);
        if (allDeals.length > 0) {
          setFeaturedDeal(allDeals[0]);
          setCarouselDeals(allDeals.slice(1, 5));
          setTrendingDeals(allDeals.slice(5, 11));
          setFlashDeals(allDeals.slice(11, 16));
        }
      }
    } catch (error) {
      console.error('Failed to fetch last-minute deals:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: accept RefObject that can contain null
  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: number) => {
    if (ref.current) {
      const scrollAmount = direction * 350;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-[#f8fafc] text-[#1e293b]" style={{ fontFamily: "'Inter', sans-serif" }}>
      
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
            Last Minute Luxury Deals
          </h1>
          <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto mb-8">
            Exclusive spontaneous escapes with premium inclusions at exceptional value.
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

      {/* Featured Spotlight */}
      {featuredDeal && (
        <section className="max-w-[1100px] mx-auto px-4 pt-16 pb-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#002b5b] mb-2">Editor's Choice</h2>
              <h3 className="text-3xl font-black text-slate-900">Featured Luxury Deal</h3>
            </div>
          </div>
          <div className="bg-white rounded-[40px] overflow-hidden flex flex-col shadow-[0_30px_100px_-20px_rgba(0,43,91,0.15)] border border-gray-100 group">
            <div className="relative h-[500px] overflow-hidden">
              <img
                src={featuredDeal.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                alt={featuredDeal.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-white max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#002b5b] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Trending Now
                  </span>
                  <span className="text-yellow-400 font-bold">
                    {'★'.repeat(Math.floor(featuredDeal.rating || 0))}
                    {'☆'.repeat(5 - Math.floor(featuredDeal.rating || 0))}
                  </span>
                </div>
                <h3 className="text-5xl font-black mb-4 leading-tight">{featuredDeal.title}</h3>
                <p className="text-gray-200 font-medium mb-6">{featuredDeal.description}</p>
                <div className="flex items-center gap-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total from</span>
                    <span className="text-4xl font-black">
                      {formatCurrency(featuredDeal.discountedPrice)}
                      <span className="text-sm font-normal text-gray-400 ml-1">PP</span>
                    </span>
                  </div>
                  <Link
                    to={`/deal/${featuredDeal._id}`}
                    className="bg-white text-[#002b5b] px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#002b5b] hover:text-white transition-all shadow-xl"
                  >
                    Book Deal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Premier Global Stays Carousel */}
      {carouselDeals.length > 0 && (
        <section className="py-12 overflow-hidden">
          <div className="max-w-[1100px] mx-auto px-4 mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#002b5b] mb-2">Curated Collections</h2>
              <h3 className="text-2xl font-black text-slate-900">Premier Global Stays</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel(premierCarouselRef, -1)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#002b5b] hover:text-white transition-all shadow-sm"
              >
                ←
              </button>
              <button
                onClick={() => scrollCarousel(premierCarouselRef, 1)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#002b5b] hover:text-white transition-all shadow-sm"
              >
                →
              </button>
            </div>
          </div>
          <div
            ref={premierCarouselRef}
            className="flex gap-6 overflow-x-auto px-[calc((100vw-1100px)/2)] pb-8 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {carouselDeals.map((deal) => (
              <div
                key={deal._id}
                className="min-w-[300px] bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 snap-start"
              >
                <div className="h-48 relative">
                  <img
                    src={deal.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                    className="w-full h-full object-cover"
                    alt={deal.title}
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[8px] font-black uppercase text-[#002b5b]">
                    {deal.hotelId?.city}, {deal.hotelId?.country}
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-bold mb-1">{deal.title}</h4>
                  <p className="text-[11px] text-gray-500 mb-4 line-clamp-1">{deal.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <span className="text-xl font-black text-[#002b5b]">{formatCurrency(deal.discountedPrice)}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase">
                      {deal.duration} Nights · BB
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Alternating Rows – using first two deals from the list */}
      {deals.length >= 2 && (
        <section className="bg-slate-50 py-24">
          <div className="max-w-[1100px] mx-auto px-4">
            <div className="flex flex-col gap-16">
              {/* Row 1: Text Left, Image Right */}
              <div className="bg-white rounded-[32px] overflow-hidden flex flex-col lg:flex-row shadow-xl border border-gray-100">
                <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center">
                  <div className="text-[#002b5b] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    {deals[0].hotelId?.city}, {deals[0].hotelId?.country}
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-6 leading-tight">{deals[0].title}</h3>
                  <p className="text-slate-500 mb-8 leading-relaxed">{deals[0].description}</p>
                  <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#002b5b]">{formatCurrency(deals[0].discountedPrice)}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PP</span>
                    </div>
                    <Link
                      to={`/deal/${deals[0]._id}`}
                      className="bg-[#002b5b] text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Enquire Now
                    </Link>
                  </div>
                </div>
                <div className="lg:w-1/2 h-[400px] lg:h-auto overflow-hidden">
                  <img
                    src={deals[0].images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                    className="w-full h-full object-cover"
                    alt={deals[0].title}
                  />
                </div>
              </div>

              {/* Row 2: Image Left, Text Right */}
              <div className="bg-white rounded-[32px] overflow-hidden flex flex-col lg:flex-row shadow-xl border border-gray-100">
                <div className="lg:w-1/2 h-[400px] lg:h-auto overflow-hidden">
                  <img
                    src={deals[1].images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                    className="w-full h-full object-cover"
                    alt={deals[1].title}
                  />
                </div>
                <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center">
                  <div className="text-[#002b5b] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    {deals[1].hotelId?.city}, {deals[1].hotelId?.country}
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-6 leading-tight">{deals[1].title}</h3>
                  <p className="text-slate-500 mb-8 leading-relaxed">{deals[1].description}</p>
                  <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#002b5b]">{formatCurrency(deals[1].discountedPrice)}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PP</span>
                    </div>
                    <Link
                      to={`/deal/${deals[1]._id}`}
                      className="bg-[#002b5b] text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trending Escapes Carousel */}
      {trendingDeals.length > 0 && (
        <section className="py-24 overflow-hidden">
          <div className="max-w-[1100px] mx-auto px-4 mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#002b5b] mb-2">Spontaneous Travel</h2>
              <h3 className="text-3xl font-black text-slate-900">Trending Escapes</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel(trendingCarouselRef, -1)}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#002b5b] hover:text-white transition-all shadow-sm"
              >
                ←
              </button>
              <button
                onClick={() => scrollCarousel(trendingCarouselRef, 1)}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#002b5b] hover:text-white transition-all shadow-sm"
              >
                →
              </button>
            </div>
          </div>
          <div
            ref={trendingCarouselRef}
            className="flex gap-8 overflow-x-auto px-[calc((100vw-1100px)/2)] pb-12 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingDeals.map((deal) => (
              <div
                key={deal._id}
                className="min-w-[350px] bg-white rounded-[32px] overflow-hidden shadow-lg border border-gray-100 snap-start hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="h-64 relative">
                  <img
                    src={deal.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                    className="w-full h-full object-cover"
                    alt={deal.title}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-[#002b5b]">
                    {deal.hotelId?.city}, {deal.hotelId?.country}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-extrabold mb-2">{deal.title}</h4>
                  <p className="text-xs text-gray-500 font-medium mb-6">{deal.description.substring(0, 80)}...</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-2xl font-black text-[#002b5b]">{formatCurrency(deal.discountedPrice)}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{deal.duration} Nights · AI</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Flash Luxury Sales Carousel */}
      {flashDeals.length > 0 && (
        <section className="bg-[#002b5b] py-24 relative overflow-hidden">
          <div className="max-w-[1100px] mx-auto px-4 mb-12 flex justify-between items-end">
            <h2 className="text-white text-3xl font-black flex items-center gap-3">
              Flash Luxury Sales 🔥
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300 ml-4 animate-pulse">Ending Soon</span>
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel(flashCarouselRef, -1)}
                className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-[#002b5b] transition-all"
              >
                ←
              </button>
              <button
                onClick={() => scrollCarousel(flashCarouselRef, 1)}
                className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-[#002b5b] transition-all"
              >
                →
              </button>
            </div>
          </div>
          <div
            ref={flashCarouselRef}
            className="flex gap-6 overflow-x-auto px-[calc((100vw-1100px)/2)] pb-12 scrollbar-hide snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {flashDeals.map((deal, idx) => (
              <div
                key={deal._id}
                className="min-w-[300px] h-[450px] rounded-[32px] overflow-hidden relative group shrink-0 snap-start"
              >
                <img
                  src={deal.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                  alt={deal.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute top-6 left-6 bg-red-600 text-white px-3 py-1 rounded-full text-[12px] flex items-center gap-1 font-bold shadow-lg">
                  🔥 {idx === 0 ? 'Hot Deal' : idx === 1 ? 'Limited' : idx === 2 ? 'Selling Fast' : idx === 3 ? 'Last 2' : 'Top Rated'}
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <h4 className="text-white text-2xl font-black mb-2">{deal.title}</h4>
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-4">
                    {deal.hotelId?.city}, {deal.hotelId?.country}
                  </p>
                  <div className="flex items-center justify-between border-t border-white/20 pt-4">
                    <span className="text-white text-2xl font-black">{formatCurrency(deal.discountedPrice)}</span>
                    <Link to={`/deal/${deal._id}`} className="text-white text-[10px] font-black uppercase underline tracking-widest">
                      Grab Offer
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trust Badges (Static) */}
      <section className="bg-white py-16 border-t border-b border-gray-100">
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

      <Footer />
    </div>
  );
};

export default LastMinuteBargainsPage;