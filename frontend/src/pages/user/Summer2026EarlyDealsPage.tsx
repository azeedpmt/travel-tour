// src/pages/user/Summer2026EarlyDealsPage.tsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { dealService } from '../../services/dealService';
import { formatCurrency } from '../../utils/format';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Footer from '../../components/common/Footer';

// Bootstrap JS must be loaded (add script to index.html if not already)
// For carousel to auto-play, ensure data-bs-ride="carousel" attribute is present.

interface Deal {
  _id: string;
  title: string;
  description: string;
  hotelId: {
    name: string;
    city: string;
    country: string;
    rating?: number;
  };
  originalPrice: number;
  discountedPrice: number;
  duration: number;
  images: string[];
  rating: number;
}

const Summer2026EarlyDealsPage = () => {
  const [featuredDeal, setFeaturedDeal] = useState<Deal | null>(null);
  const [additionalDeals, setAdditionalDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const response = await dealService.getAllDeals({
        offerType: 'summer-2026-early-deals',
        limit: 20,
        page: 1,
      });
      if (response.success && response.data && response.data.length > 0) {
        // First deal becomes the featured horizontal card
        setFeaturedDeal(response.data[0]);
        // Next deals (up to 6) go into the carousel
        setAdditionalDeals(response.data.slice(1, 7));
      } else {
        setFeaturedDeal(null);
        setAdditionalDeals([]);
      }
    } catch (error) {
      console.error('Failed to fetch summer deals:', error);
      setFeaturedDeal(null);
      setAdditionalDeals([]);
    } finally {
      setLoading(false);
    }
  };

  const scrollCarousel = (direction: number) => {
    if (carouselRef.current) {
      const scrollAmount = direction * 320; // card width + gap
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const renderStars = (rating: number | undefined) => {
    if (!rating) rating = 0;
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <div className="flex gap-1" style={{ color: '#CB2187' }}>
        {[...Array(fullStars)].map((_, i) => <span key={i}>★</span>)}
        {[...Array(emptyStars)].map((_, i) => <span key={i + fullStars}>☆</span>)}
      </div>
    );
  };

  if (loading) return <LoadingSpinner />;

  // Bottom bootstrap carousel slides (default images)
  const bottomSlides = [
    { title: 'Maldives Paradise', desc: 'Unmatched Serenity', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Dubai Skyline', desc: 'Modern Luxury', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Swiss Retreats', desc: 'Alpine Elegance', img: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Parisian Nights', desc: 'The City of Light', img: 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Santorini Sunsets', desc: 'Iconic Calderas', img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Bali Jungles', desc: 'Tropical Sanctuary', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' },
  ];

  return (
    <div className="bg-white" style={{ fontFamily: "'Montserrat', sans-serif", color: '#4c4c4c', overflowX: 'hidden' }}>
      
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
            Summer 2026 Exclusive
          </h1>
          <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto mb-8">
            Hand-picked luxury across the globe, tailored specifically for your next escape.
          </p>
        </div>
      </section>

      {/* Featured Hot Deal – Horizontal Card (Image Left | Content Right) */}
      {featuredDeal && (
        <section className="max-w-[1200px] mx-auto px-4 py-16">
          <div className="bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl border border-gray-100">
            {/* Image */}
            <div className="md:w-1/2 h-[400px] md:h-auto">
              <img
                src={featuredDeal.images?.[0] || 'https://via.placeholder.com/800x600?text=No+Image'}
                className="w-full h-full object-cover"
                alt={featuredDeal.title}
              />
            </div>
            {/* Content */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="text-[#002b5b] text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                {featuredDeal.hotelId?.city || 'Destination'}, {featuredDeal.hotelId?.country || ''}
              </div>
              <div className="flex items-center gap-2 mb-3">
                {renderStars(featuredDeal.rating || featuredDeal.hotelId?.rating)}
                <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">Hot Deal</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{featuredDeal.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{featuredDeal.description}</p>
              <div className="flex items-center justify-between border-t pt-6">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Package Total From</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#002b5b]">{formatCurrency(featuredDeal.discountedPrice)}</span>
                    <span className="text-[11px] font-bold text-gray-400 uppercase">per person</span>
                  </div>
                </div>
                <Link
                  to={`/deal/${featuredDeal._id}`}
                  className="bg-[#002b5b] text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.15em] hover:bg-[#001f41] transition-all"
                >
                  View Deal →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Alternating Sections (unchanged – exactly as requested) */}
      <section className="max-w-[1200px] mx-auto px-4 py-20 space-y-16">
        <div className="flex flex-col md:flex-row border rounded-3xl overflow-hidden shadow-sm" style={{ borderColor: '#f3f3f3' }}>
          <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-white">
            <h3 className="text-3xl font-bold mb-6">Exclusive Early Booking</h3>
            <p className="text-sm leading-relaxed text-gray-500">
              Secure your 2026 getaway with just a small deposit and enjoy our lowest price guarantee. Early bookers receive complimentary VIP airport lounge access and private transfers.
            </p>
            <div className="mt-8 border-t pt-6" style={{ borderColor: '#eee' }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#CB2187' }}>Offer ends soon</p>
            </div>
          </div>
          <div className="md:w-1/2 h-[400px] md:h-auto">
            <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1000" className="w-full h-full object-cover" alt="Beach resort" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse border rounded-3xl overflow-hidden shadow-sm" style={{ borderColor: '#f3f3f3' }}>
          <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-white">
            <h3 className="text-3xl font-bold mb-6">The PlanMyLuxe Difference</h3>
            <p className="text-sm leading-relaxed text-gray-500">
              Every holiday we curate includes our signature 24/7 concierge support. We don't just book trips; we create memories that last a lifetime through meticulous planning and local expertise.
            </p>
            <div className="mt-8 border-t pt-6" style={{ borderColor: '#eee' }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#CB2187' }}>Travel with confidence</p>
            </div>
          </div>
          <div className="md:w-1/2 h-[400px] md:h-auto">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000" className="w-full h-full object-cover" alt="Luxury pool" />
          </div>
        </div>

         <div className="flex flex-col md:flex-row border rounded-3xl overflow-hidden shadow-sm" style={{ borderColor: '#f3f3f3' }}>
          <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-white">
            <h3 className="text-3xl font-bold mb-6">Exclusive Early Booking</h3>
            <p className="text-sm leading-relaxed text-gray-500">
              Secure your 2026 getaway with just a small deposit and enjoy our lowest price guarantee. Early bookers receive complimentary VIP airport lounge access and private transfers.
            </p>
            <div className="mt-8 border-t pt-6" style={{ borderColor: '#eee' }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#CB2187' }}>Offer ends soon</p>
            </div>
          </div>
          <div className="md:w-1/2 h-[400px] md:h-auto">
            <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1000" className="w-full h-full object-cover" alt="Beach resort" />
          </div>
        </div>

       <div className="flex flex-col md:flex-row-reverse border rounded-3xl overflow-hidden shadow-sm" style={{ borderColor: '#f3f3f3' }}>
          <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-white">
            <h3 className="text-3xl font-bold mb-6">The PlanMyLuxe Difference</h3>
            <p className="text-sm leading-relaxed text-gray-500">
              Every holiday we curate includes our signature 24/7 concierge support. We don't just book trips; we create memories that last a lifetime through meticulous planning and local expertise.
            </p>
            <div className="mt-8 border-t pt-6" style={{ borderColor: '#eee' }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#CB2187' }}>Travel with confidence</p>
            </div>
          </div>
          <div className="md:w-1/2 h-[400px] md:h-auto">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000" className="w-full h-full object-cover" alt="Luxury pool" />
          </div>
        </div>

      </section>

      {/* Horizontal Scroll Carousel – Additional Deals (vertical row-wise cards) */}
      {additionalDeals.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-2xl font-bold">More Summer Escapes</h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Handpicked for 2026</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollCarousel(-1)}
                  className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition border border-gray-200"
                >
                  ←
                </button>
                <button
                  onClick={() => scrollCarousel(1)}
                  className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition border border-gray-200"
                >
                  →
                </button>
              </div>
            </div>

            <div className="overflow-hidden">
              <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {additionalDeals.map((deal) => (
                  <div
                    key={deal._id}
                    className="w-[300px] flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <img
                      src={deal.images?.[0] || 'https://via.placeholder.com/500x300?text=No+Image'}
                      className="w-full h-48 object-cover"
                      alt={deal.title}
                    />
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-lg mb-1">{deal.title}</h4>
                          <p className="text-xs text-gray-500">
                            {deal.hotelId?.city}, {deal.hotelId?.country}
                          </p>
                        </div>
                        {renderStars(deal.rating || 0)}
                      </div>
                      <p className="text-[13px] text-gray-400 leading-relaxed line-clamp-2 mt-2">
                        {deal.description}
                      </p>
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                        <div>
                          <span className="text-[10px] text-gray-400">from</span>
                          <span className="text-xl font-black text-[#002b5b] ml-1">{formatCurrency(deal.discountedPrice)}</span>
                        </div>
                        <Link
                          to={`/deal/${deal._id}`}
                          className="text-[10px] font-black uppercase text-[#002b5b] hover:underline"
                        >
                          View Deal →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Banner – Bootstrap Carousel (fully functional) */}
      <div className="flex justify-center bg-gray-100 py-16">
        <div
          id="summerBottomCarousel"
          className="carousel slide w-full max-w-[900px] h-[500px] rounded-3xl shadow-2xl overflow-hidden"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner h-full">
            {bottomSlides.map((slide, idx) => (
              <div key={idx} className={`carousel-item h-full ${idx === 0 ? 'active' : ''}`}>
                <img src={slide.img} className="w-full h-full object-cover" alt={slide.title} />
                <div className="carousel-caption absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="text-center px-4">
                    <h1 className="text-white text-4xl font-bold mb-2">{slide.title}</h1>
                    <p className="text-white text-sm uppercase tracking-[0.2em] opacity-90">{slide.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#summerBottomCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon bg-black/40 rounded-full p-3" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#summerBottomCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon bg-black/40 rounded-full p-3" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
          <div className="carousel-indicators">
            {bottomSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                data-bs-target="#summerBottomCarousel"
                data-bs-slide-to={idx}
                className={idx === 0 ? 'active w-3 h-3 rounded-full bg-white' : 'w-3 h-3 rounded-full bg-white/50'}
                aria-current={idx === 0 ? 'true' : 'false'}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Summer2026EarlyDealsPage;