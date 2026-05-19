// src/pages/user/MitsisHotelGroupOffersPage.tsx
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

// Fallback demo data (so the page never looks empty)
const demoDeals: Deal[] = [
  {
    _id: 'demo1',
    title: 'RG Village Crete',
    description: 'A simple and relaxed retreat in Crete, perfect for a budget-friendly stay with easy access to the island’s coastline and attractions.',
    hotelId: { name: 'RG Village', city: 'Crete', country: 'Greece' },
    originalPrice: 799,
    discountedPrice: 599,
    duration: 7,
    images: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=1200&q=80'],
    rating: 4.5,
  },
  {
    _id: 'demo2',
    title: 'Mitsis Royal Palace',
    description: 'Luxury all-inclusive resort with private beach and multiple pools.',
    hotelId: { name: 'Royal Palace', city: 'Rhodes', country: 'Greece' },
    originalPrice: 1299,
    discountedPrice: 999,
    duration: 7,
    images: ['https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=800&q=80'],
    rating: 4.8,
  },
  // Add more demo deals to fill carousels (9+ items)
];

// Fill up to 18 demo deals for carousels
for (let i = demoDeals.length; i < 18; i++) {
  demoDeals.push({
    _id: `demo${i + 1}`,
    title: `Mitsis Resort Option ${i + 1}`,
    description: 'Luxury stay with premium breakfast and spa access included.',
    hotelId: { name: `Mitsis Resort`, city: 'Greek Island', country: 'Greece' },
    originalPrice: 500 + (i + 1) * 50,
    discountedPrice: 400 + (i + 1) * 30,
    duration: 7,
    images: [`https://picsum.photos/seed/mitsis${i + 1}/400/250`],
    rating: 4.5,
  });
}

const MitsisHotelGroupOffersPage = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [spotlightDeal, setSpotlightDeal] = useState<Deal | null>(null);
  const [premiumDeals, setPremiumDeals] = useState<Deal[]>([]);
  const [trendingDeals, setTrendingDeals] = useState<Deal[]>([]);
  const [flashDeals, setFlashDeals] = useState<Deal[]>([]);

  // Refs for carousels
  const premiumRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const [flashIndex, setFlashIndex] = useState(0);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const response = await dealService.getAllDeals({
        offerType: 'mitsis-hotel-group',
        limit: 30,
        page: 1,
      });
      if (response.success && response.data && response.data.length > 0) {
        const allDeals = response.data;
        setDeals(allDeals);
        setSpotlightDeal(allDeals[0]);
        setPremiumDeals(allDeals.slice(1, 10));  // next 9 for premium carousel
        setTrendingDeals(allDeals.slice(10, 19)); // next 9 for trending carousel
        setFlashDeals(allDeals.slice(19, 24));   // next 5 for flash carousel
      } else {
        // Use demo data
        setDeals(demoDeals);
        setSpotlightDeal(demoDeals[0]);
        setPremiumDeals(demoDeals.slice(1, 10));
        setTrendingDeals(demoDeals.slice(10, 19));
        setFlashDeals(demoDeals.slice(19, 24));
      }
    } catch (error) {
      console.error('Failed to fetch Mitsis deals, using demo data:', error);
      setDeals(demoDeals);
      setSpotlightDeal(demoDeals[0]);
      setPremiumDeals(demoDeals.slice(1, 10));
      setTrendingDeals(demoDeals.slice(10, 19));
      setFlashDeals(demoDeals.slice(19, 24));
    } finally {
      setLoading(false);
    }
  };

  // Horizontal scroll helpers
  const scrollPremium = (direction: number) => {
    if (premiumRef.current) {
      const amount = direction * 340; // card width + gap
      premiumRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const scrollTrending = (direction: number) => {
    if (trendingRef.current) {
      const amount = direction * 340;
      trendingRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const scrollFlash = (direction: number) => {
    if (flashRef.current) {
      const total = flashDeals.length;
      let newIndex = flashIndex + direction;
      if (newIndex < 0) newIndex = total - 1;
      if (newIndex >= total) newIndex = 0;
      setFlashIndex(newIndex);
      flashRef.current.style.transform = `translateX(-${newIndex * 100}%)`;
    }
  };

  // Auto-slide for flash carousel? (optional – we can keep manual)
  // Not implementing auto to match original design.

  if (loading) return <LoadingSpinner />;

  // Rating stars helper
  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const empty = 5 - full;
    return (
      <div className="flex text-yellow-500 text-sm">
        {'★'.repeat(full)}{'☆'.repeat(empty)}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 text-gray-900" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      
      {/* Hero Section */}
      <section
        className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden"
        style={{
          background: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover no-repeat`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight mb-4" style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
            Mitsis Hotel Group Offers
          </h1>
          <p className="text-white text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Experience unparalleled Greek hospitality with our exclusive premium luxury resort deals.
          </p>
        </div>
      </section>

      {/* Spotlight Section: Crete (first deal) */}
      {spotlightDeal && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-gray-100">
            <div className="md:w-1/2 h-80 md:h-auto">
              <img
                src={spotlightDeal.images?.[0] || 'https://via.placeholder.com/1200x800?text=No+Image'}
                alt={spotlightDeal.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
              <span className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-2">
                {spotlightDeal.hotelId?.country || 'Greece'} - {spotlightDeal.hotelId?.city || 'Crete'} Hot Deal
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{spotlightDeal.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{spotlightDeal.description}</p>
              <div className="flex items-center gap-4">
                <Link
                  to={`/deal/${spotlightDeal._id}`}
                  className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-all"
                >
                  Explore Crete
                </Link>
                <span className="text-xl font-bold">{formatCurrency(spotlightDeal.discountedPrice)}pp</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Premium Collection Carousel (9 cards) */}
      <section className="max-w-full overflow-hidden py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold uppercase tracking-tighter">Premium Collection</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scrollPremium(-1)}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-all"
            >
              ←
            </button>
            <button
              onClick={() => scrollPremium(1)}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-all"
            >
              →
            </button>
          </div>
        </div>
        <div
          ref={premiumRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-4 pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {premiumDeals.map((deal) => (
            <div key={deal._id} className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <img
                src={deal.images?.[0] || 'https://via.placeholder.com/400x250?text=No+Image'}
                className="w-full h-48 object-cover"
                alt={deal.title}
              />
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2">{deal.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{deal.description}</p>
                {renderStars(deal.rating || 0)}
                <div className="flex justify-between items-center border-t pt-4 mt-2">
                  <span className="font-bold text-xl">{formatCurrency(deal.discountedPrice)}</span>
                  <Link to={`/deal/${deal._id}`} className="text-xs font-bold uppercase underline hover:text-yellow-600">
                    View Deal
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Zig-Zag Feature Section (static for now – can be made dynamic later) */}
      <section className="max-w-7xl mx-auto px-4 py-20 space-y-12">
        <h2 className="text-3xl font-bold text-center mb-16 uppercase tracking-widest">Signature Experiences</h2>

        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl overflow-hidden shadow-xl">
          <div className="md:w-1/2 h-64 md:h-96 w-full">
            <img src="https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Gastronomy" />
          </div>
          <div className="md:w-1/2 p-10 text-left">
            <h3 className="text-2xl font-bold mb-4">Gastronomy Excellence</h3>
            <p className="text-gray-600">Discover 24/7 dining across our diverse range of theme restaurants serving local and international flavors.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center bg-white rounded-2xl overflow-hidden shadow-xl">
          <div className="md:w-1/2 h-64 md:h-96 w-full">
            <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Wellness" />
          </div>
          <div className="md:w-1/2 p-10 text-left">
            <h3 className="text-2xl font-bold mb-4">Wellness & Serenity</h3>
            <p className="text-gray-600">Rejuvenate your body and mind at our award-winning spas featuring traditional Greek treatments.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl overflow-hidden shadow-xl">
          <div className="md:w-1/2 h-64 md:h-96 w-full">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Family" />
          </div>
          <div className="md:w-1/2 p-10 text-left">
            <h3 className="text-2xl font-bold mb-4">Family Adventures</h3>
            <p className="text-gray-600">Create lifelong memories with supervised kid clubs and water park fun for all ages.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center bg-white rounded-2xl overflow-hidden shadow-xl">
          <div className="md:w-1/2 h-64 md:h-96 w-full">
            <img src="https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Entertainment" />
          </div>
          <div className="md:w-1/2 p-10 text-left">
            <h3 className="text-2xl font-bold mb-4">Nightly Entertainment</h3>
            <p className="text-gray-600">From live music to Broadway-style shows, our evenings are filled with magic and celebration.</p>
          </div>
        </div>
      </section>

      {/* Trending Now Carousel (black background) */}
      <section className="max-w-full overflow-hidden py-12 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-yellow-500">Trending Now</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scrollTrending(-1)}
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-all text-white"
            >
              ←
            </button>
            <button
              onClick={() => scrollTrending(1)}
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-all text-white"
            >
              →
            </button>
          </div>
        </div>
        <div
          ref={trendingRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-4 pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trendingDeals.map((deal) => (
            <div key={deal._id} className="flex-shrink-0 w-80 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
              <img
                src={deal.images?.[0] || 'https://via.placeholder.com/400x250?text=No+Image'}
                className="w-full h-48 object-cover"
                alt={deal.title}
              />
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-white">{deal.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{deal.description}</p>
                {renderStars(deal.rating || 0)}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-800">
                  <span className="font-bold text-xl text-yellow-500">{formatCurrency(deal.discountedPrice)}pp</span>
                  <Link to={`/deal/${deal._id}`} className="bg-yellow-600 text-white px-4 py-2 rounded text-[10px] font-bold uppercase hover:bg-yellow-700">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Deals Carousel (full-width banner) */}
      {flashDeals.length > 0 && (
        <section className="max-w-full overflow-hidden py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 mb-8 flex justify-between items-center">
            <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-gray-400">Flash Deals</h2>
            <div className="flex gap-2">
              <button
                onClick={() => scrollFlash(-1)}
                className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100 transition-all text-xs"
              >
                ←
              </button>
              <button
                onClick={() => scrollFlash(1)}
                className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100 transition-all text-xs"
              >
                →
              </button>
            </div>
          </div>
          <div className="relative max-w-7xl mx-auto overflow-hidden px-4">
            <div
              ref={flashRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${flashIndex * 100}%)` }}
            >
              {flashDeals.map((deal, idx) => (
                <div key={deal._id} className="min-w-full flex justify-center">
                  <div className="relative group w-full max-w-4xl h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                    <img
                      src={deal.images?.[0] || 'https://via.placeholder.com/1200x600?text=No+Image'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={deal.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-6 left-6">
                      <div className="bg-white/95 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                        <span className="animate-pulse text-lg">🔥</span>
                        <span className="text-xs font-black uppercase tracking-wider text-red-600">Flash Sale Active</span>
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-8 text-white">
                      <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-400 mb-3">Limited Offer</p>
                      <h3 className="text-4xl font-black mb-3">{deal.title}</h3>
                      <p className="text-white/80 max-w-lg">{deal.description.substring(0, 120)}...</p>
                      <Link
                        to={`/deal/${deal._id}`}
                        className="mt-6 inline-block bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all"
                      >
                        Explore Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default MitsisHotelGroupOffersPage;