// src/pages/user/MultiCentreHolidaysPage.tsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { dealService } from '../../services/dealService';
import { formatCurrency } from '../../utils/format';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Footer from '../../components/common/Footer';

interface MultiCentreDeal {
  _id: string;
  title: string;           // e.g. "Dubai & Maldives"
  description: string;     // e.g. "Skyline luxury meets island paradise."
  hotelId?: {
    city?: string;
    country?: string;
  };
  originalPrice?: number;
  discountedPrice?: number;
  images: string[];
}

// Demo data for fallback
const demoDeals: MultiCentreDeal[] = [
  {
    _id: 'mc1',
    title: 'Dubai & Maldives',
    description: 'Skyline luxury meets island paradise.',
    images: ['https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=900'],
  },
  {
    _id: 'mc2',
    title: 'Singapore & Bali',
    description: 'City lights and tropical escapes.',
    images: ['https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=900'],
  },
  {
    _id: 'mc3',
    title: 'New York & Cancun',
    description: 'Fast‑paced city and beach relaxation.',
    images: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900'],
  },
  {
    _id: 'mc4',
    title: 'Thailand & Bali',
    description: 'Exotic adventures and luxury villas.',
    images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=900'],
  },
  {
    _id: 'mc5',
    title: 'Paris & Santorini',
    description: 'Romantic escapes across Europe.',
    images: ['https://images.unsplash.com/photo-1468413253725-0d5181091126?q=80&w=900'],
  },
];

// FAQ data – can be loaded from API later
const faqData = [
  {
    question: 'What is a multi‑centre holiday?',
    answer: 'A multi‑centre holiday allows you to visit two or more destinations in one trip, combining cities, beaches, and luxury resorts into one seamless itinerary.',
  },
  {
    question: 'Can I customise my itinerary?',
    answer: 'Yes, all itineraries are fully customisable including destinations, hotel categories, flights, experiences, and travel durations.',
  },
  {
    question: 'Are international flights included?',
    answer: 'Most luxury packages include international and internal flights along with baggage allowances.',
  },
  {
    question: 'Do you provide airport transfers?',
    answer: 'Yes, airport transfers are included in most itineraries for a smooth and stress‑free travel experience.',
  },
  {
    question: 'Are your holidays ATOL protected?',
    answer: 'Yes, qualifying package holidays are fully ATOL protected for financial security and peace of mind.',
  },
  {
    question: 'Can I upgrade my hotels or flights?',
    answer: 'Absolutely. You can upgrade to premium flights, luxury suites, private villas, and exclusive resorts.',
  },
  {
    question: 'Do you offer honeymoon packages?',
    answer: 'Yes, we specialise in luxury honeymoon escapes with romantic experiences and premium resorts.',
  },
  {
    question: 'How do I request a custom quote?',
    answer: 'You can contact our travel experts or submit an enquiry form to receive a personalised quote.',
  },
];

const MultiCentreHolidaysPage = () => {
  const [deals, setDeals] = useState<MultiCentreDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [readMoreOpen, setReadMoreOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<boolean[]>(new Array(faqData.length).fill(false));
  const carouselRef = useRef<HTMLDivElement>(null);

  // Rotating banner images (static – can be made dynamic later)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerImages = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000',
    'https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=2000',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2000',
  ];

  useEffect(() => {
    fetchDeals();
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const response = await dealService.getAllDeals({
        holidayStyle: 'multi-centre',
        limit: 20,
        page: 1,
      });
      if (response.success && response.data && response.data.length > 0) {
        // Map the returned deals to the simpler structure
        const mapped = response.data.map((deal: any) => ({
          _id: deal._id,
          title: deal.title,
          description: deal.description,
          images: deal.images,
        }));
        setDeals(mapped.slice(0, 9)); // up to 9 cards
      } else {
        setDeals(demoDeals);
      }
    } catch (error) {
      console.error('Failed to fetch multi‑centre deals, using demo data:', error);
      setDeals(demoDeals);
    } finally {
      setLoading(false);
    }
  };

  const scrollCarousel = (direction: number) => {
    if (carouselRef.current) {
      const scrollAmount = direction * 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleFaq = (idx: number) => {
    const newState = [...faqOpen];
    newState[idx] = !newState[idx];
    setFaqOpen(newState);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: '#fcfcfc', color: '#1a1a1a' }}>
      {/* Hero Section */}
      <section style={{ position: 'relative', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=2000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))' }}></div>
        </div>
        <div className="container mx-auto px-4" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" style={{ letterSpacing: '-1px' }}>
            Luxury Multi Centre Holidays
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white opacity-90">
            Experience more of the world with our handpicked multi‑destination itineraries. From city skylines to pristine beaches, discover luxury without limits.
          </p>
        </div>
      </section>

      {/* Intro Content Card */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              <div className="p-8 lg:p-14">
                <span className="text-xs uppercase tracking-[3px] text-gray-400 font-semibold">
                  Luxury Multi‑Centre Travel
                </span>
                <h2 className="text-4xl font-bold mt-4 mb-6 leading-tight">
                  Explore More Than One Destination In A Single Journey
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our luxury multi‑centre holidays are designed for travellers who want more than just one destination. Combine iconic cities, tropical beaches, cultural escapes, and unforgettable experiences into one seamless itinerary.
                </p>
                <div id="moreText" style={{ display: readMoreOpen ? 'block' : 'none' }}>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Whether you're dreaming of Dubai and the Maldives, Singapore and Bali, or New York and Cancun, our travel specialists create tailor‑made experiences with premium hotels, flights, and transfers included.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Enjoy handpicked resorts, private transfers, flexible stays, and expert planning — all designed to make your holiday smooth, luxurious, and stress‑free.
                  </p>
                </div>
                <button
                  onClick={() => setReadMoreOpen(!readMoreOpen)}
                  className="mt-4 bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all"
                >
                  {readMoreOpen ? 'Read Less' : 'Read More'}
                </button>
              </div>
              <div className="h-full">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop"
                  className="w-full h-full object-cover min-h-[420px]"
                  alt="Luxury Travel"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Destinations Carousel */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="background" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10">
          <div className="text-center mb-14 px-4">
            <h2 className="text-4xl font-bold text-white mb-4">Trending Destinations 2026/2027</h2>
            <p className="text-gray-200 max-w-2xl mx-auto">Discover our most loved luxury multi‑centre holidays.</p>
          </div>
          <div className="relative max-w-7xl mx-auto px-4">
            <button
              onClick={() => scrollCarousel(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition"
            >
              ❮
            </button>
            <button
              onClick={() => scrollCarousel(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition"
            >
              ❯
            </button>
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scroll-smooth hide-scrollbar px-12"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {deals.map((deal) => (
                <div key={deal._id} className="min-w-[320px] max-w-[320px] bg-white rounded-2xl overflow-hidden shadow-xl flex-shrink-0">
                  <img
                    src={deal.images?.[0] || 'https://via.placeholder.com/900x500?text=No+Image'}
                    className="h-56 w-full object-cover"
                    alt={deal.title}
                  />
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{deal.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{deal.description}</p>
                    <Link to={`/deal/${deal._id}`} className="bg-black text-white px-5 py-3 rounded-full text-sm font-semibold inline-block hover:bg-gray-800 transition">
                      Explore
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Alternating Cards (static – can be made dynamic later) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center bg-[#fafafa] rounded-3xl overflow-hidden">
              <div className="p-10">
                <h3 className="text-3xl font-bold mb-5">Luxury Hotels Handpicked For You</h3>
                <p className="text-gray-600 leading-relaxed">Stay at the world’s finest resorts and city hotels with premium amenities, exceptional dining, and stunning views.</p>
              </div>
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400" className="w-full h-full object-cover min-h-[350px]" alt="Hotels" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center bg-[#fafafa] rounded-3xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1400" className="w-full h-full object-cover min-h-[350px] order-2 lg:order-1" alt="Transfers" />
              <div className="p-10 order-1 lg:order-2">
                <h3 className="text-3xl font-bold mb-5">Private Transfers Included</h3>
                <p className="text-gray-600 leading-relaxed">Enjoy seamless airport pickups, luxury transport, and stress‑free transitions between destinations.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center bg-[#fafafa] rounded-3xl overflow-hidden">
              <div className="p-10">
                <h3 className="text-3xl font-bold mb-5">Tailor‑Made Experiences</h3>
                <p className="text-gray-600 leading-relaxed">From romantic escapes to family adventures, every itinerary is designed around your travel style.</p>
              </div>
              <img src="https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=1400" className="w-full h-full object-cover min-h-[350px]" alt="TailorMade" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center bg-[#fafafa] rounded-3xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1400" className="w-full h-full object-cover min-h-[350px] order-2 lg:order-1" alt="Support" />
              <div className="p-10 order-1 lg:order-2">
                <h3 className="text-3xl font-bold mb-5">24/7 Travel Assistance</h3>
                <p className="text-gray-600 leading-relaxed">Our dedicated luxury travel experts are available whenever you need support during your holiday.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION – dynamic */}
      <section className="py-20 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to know about our luxury multi‑centre holidays.</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqData.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <span
                    className="text-2xl transition-all duration-300"
                    style={{ transform: faqOpen[idx] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    ^
                  </span>
                </button>
                <div className={`px-6 pb-6 text-gray-600 leading-relaxed ${faqOpen[idx] ? 'block' : 'hidden'}`}>
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rotating Banner */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={bannerImages[currentBannerIndex]}
            className="w-full h-full object-cover transition-all duration-700"
            alt="Rotating banner"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div>
            <h2 className="text-5xl font-bold text-white mb-6">Your Journey Starts Here</h2>
            <p className="text-white/80 max-w-2xl mx-auto">Luxury travel experiences crafted for unforgettable memories.</p>
          </div>
        </div>
      </section>

      {/* Footer sections */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Book with Confidence</h3>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 font-medium">
              <div className="flex items-center"><span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-black">✓</span> ATOL Protected</div>
              <div className="flex items-center"><span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-black">✓</span> ABTA Bonded</div>
              <div className="flex items-center"><span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-black">✓</span> Low Deposits</div>
              <div className="flex items-center"><span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-black">✓</span> Flexible Payments</div>
            </div>
          </div>
          <p className="text-center text-gray-400 text-xs border-t border-gray-100 pt-8">
            © 2025 PlanMyLuxe. All prices subject to availability.
          </p>
        </div>
      </footer>

      <footer className="bg-black text-gray-500 py-16 px-4 text-center border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-white text-2xl font-bold mb-8 tracking-widest uppercase">Mitsis × PlanMyLuxe</h2>
          <div className="flex justify-center gap-8 mb-12 text-sm uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-[10px] leading-loose max-w-lg mx-auto opacity-50">
            © 2024 PlanMyLuxe Hotel Group. All rights reserved. Managed independently. All prices subject to availability.
          </p>
        </div>
      </footer>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MultiCentreHolidaysPage;