// src/pages/user/CityBreaksPage.tsx
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

// Demo deals (fallback for city breaks)
const demoDeals: Deal[] = [
  {
    _id: 'city1',
    title: 'The Ritz Paris',
    description: 'Stay at the legendary Ritz on Place Vendôme. Enjoy suites overlooking the Eiffel Tower, Michelin-starred dining, and the signature Chanel spa.',
    hotelId: { name: 'The Ritz', city: 'Paris', country: 'France' },
    originalPrice: 1899,
    discountedPrice: 1299,
    duration: 3,
    images: ['https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1200&auto=format&fit=crop'],
    rating: 4.9,
  },
  {
    _id: 'city2',
    title: 'Baglioni Hotel London',
    description: 'A luxury boutique hotel in Kensington, offering Italian elegance just steps from Hyde Park and Harrods.',
    hotelId: { name: 'Baglioni', city: 'London', country: 'United Kingdom' },
    originalPrice: 1599,
    discountedPrice: 1099,
    duration: 3,
    images: ['https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop'],
    rating: 4.8,
  },
  {
    _id: 'city3',
    title: 'Hotel de Rome, Berlin',
    description: 'A former bank turned 5-star hotel in the heart of Mitte, featuring a rooftop terrace overlooking the Berlin Cathedral.',
    hotelId: { name: 'Hotel de Rome', city: 'Berlin', country: 'Germany' },
    originalPrice: 1299,
    discountedPrice: 899,
    duration: 3,
    images: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200&auto=format&fit=crop'],
    rating: 4.7,
  },
];

// FAQ demo data for city breaks
const faqDemo = [
  {
    question: 'What is included in a luxury city break package?',
    answer: 'Typically includes flights, central 4/5‑star hotel accommodation, private transfers, and a choice of excursions such as guided tours or museum passes. Breakfast is often included.',
  },
  {
    question: 'Can I combine two cities in one holiday?',
    answer: 'Absolutely! We specialise in multi‑centre city breaks – for example, Paris & Rome or London & Edinburgh. Speak to our travel experts.',
  },
  {
    question: 'Are airport transfers included?',
    answer: 'Most of our city break packages include private or shared airport transfers for a seamless start to your trip.',
  },
  {
    question: 'Do you offer guided tours?',
    answer: 'Yes, we can arrange private guided tours, skip‑the‑line tickets to major attractions, and even food tours.',
  },
  {
    question: 'Can I book a city break for a special occasion?',
    answer: 'Certainly. We can add celebratory extras like champagne, flowers, or a private dinner booking.',
  },
];

const CityBreaksPage = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [faqOpen, setFaqOpen] = useState<boolean[]>(new Array(faqDemo.length).fill(false));

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const response = await dealService.getAllDeals({
        holidayStyle: 'city-breaks',
        limit: 10,
        page: 1,
      });
      if (response.success && response.data && response.data.length > 0) {
        setDeals(response.data.slice(0, 6));
      } else {
        setDeals(demoDeals);
      }
    } catch (error) {
      console.error('Failed to fetch city break deals, using demo data:', error);
      setDeals(demoDeals);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (idx: number) => {
    const newState = [...faqOpen];
    newState[idx] = !newState[idx];
    setFaqOpen(newState);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-gray-50 font-sans text-gray-900" style={{ margin: 0, padding: 0 }}>
      {/* HERO SECTION */}
      <section
        className="relative w-full h-[450px] flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop')`,
        }}
      >
        <div className="max-w-4xl px-4">
          <h1 className="text-white text-4xl md:text-6xl font-bold uppercase tracking-[0.1em] mb-4" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            Luxury City Breaks
          </h1>
          <p className="text-white text-lg md:text-xl font-light italic tracking-wide">
            Iconic European Cities, Unmatched Luxury
          </p>
        </div>
      </section>

      {/* READ MORE SECTION */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0 border border-gray-100">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <span className="text-sm uppercase tracking-[4px] text-blue-600 font-bold mb-4">Luxury Travel Experiences</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Discover Extraordinary City Breaks
            </h2>
            <div className="text-gray-600 text-lg leading-8 relative">
              <p className={`${!moreOpen ? 'line-clamp-5' : ''} transition-all duration-500`}>
                Experience the world’s most exciting cities in style with our handpicked luxury city breaks. From the romantic streets of Paris to the vibrant energy of New York, every itinerary is designed to immerse you in culture, cuisine, and comfort.
                <br /><br />
                Our packages include stays at iconic 5‑star hotels, VIP airport transfers, skip‑the‑line museum tickets, and private guided tours. Whether you’re after a weekend escape or a longer cultural exploration, we ensure every moment is seamless and extraordinary.
                <br /><br />
                Enjoy exclusive access to rooftop bars, Michelin‑starred dinners, and luxury shopping experiences – all arranged by your personal travel concierge.
              </p>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="mt-4 text-black font-bold hover:underline"
              >
                {moreOpen ? 'Read Less' : 'Read More'}
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="bg-black text-white px-6 py-4 rounded-2xl font-bold hover:bg-gray-800 transition">
                Start Planning
              </button>
              <button className="border border-black text-black px-6 py-4 rounded-2xl font-bold hover:bg-black hover:text-white transition">
                Download Brochure
              </button>
            </div>
          </div>
          <div className="relative h-[400px] lg:h-auto">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt="City break"
            />
          </div>
        </div>
      </section>

      {/* FULL WIDTH CAROUSEL SECTION – dynamic deals (as in template) */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="background"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <span className="text-white/70 uppercase tracking-[4px] text-sm">Luxury Escapes</span>
              <h2 className="text-4xl font-bold text-white mt-2">Trending City Destinations</h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => carouselRef.current?.scrollBy({ left: -374, behavior: 'smooth' })}
                className="w-12 h-12 rounded-full bg-white text-black font-bold text-xl hover:bg-gray-200 transition"
              >
                ←
              </button>
              <button
                onClick={() => carouselRef.current?.scrollBy({ left: 374, behavior: 'smooth' })}
                className="w-12 h-12 rounded-full bg-white text-black font-bold text-xl hover:bg-gray-200 transition"
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
              {deals.map((deal) => (
                <div
                  key={deal._id}
                  className="min-w-[350px] w-[350px] bg-white rounded-3xl overflow-hidden shadow-xl flex-shrink-0"
                >
                  <img
                    src={deal.images?.[0] || 'https://via.placeholder.com/1200x800?text=No+Image'}
                    className="h-64 w-full object-cover"
                    alt={deal.title}
                  />
                  <div className="p-6">
                    <span className="text-xs uppercase tracking-[3px] text-blue-600 font-bold">
                      {deal.hotelId?.city || 'City'} – {deal.hotelId?.country || 'Europe'}
                    </span>
                    <h3 className="text-2xl font-bold mt-3">{deal.title}</h3>
                    <p className="text-gray-600 mt-4 leading-7 line-clamp-3">
                      {deal.description}
                    </p>
                    <div className="mt-6 flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-500">{deal.duration} nights from</span>
                        <div className="text-3xl font-black">{formatCurrency(deal.discountedPrice)}</div>
                        <span className="text-sm text-gray-500">per person</span>
                      </div>
                      <Link
                        to={`/deal/${deal._id}`}
                        className="w-14 h-14 rounded-full bg-black text-white text-xl flex items-center justify-center hover:scale-110 transition"
                      >
                        →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ALTERNATING 4 CARDS (static – can be made dynamic later) */}
      <section className="container mx-auto px-4 py-20">
        <div className="space-y-16">
          {[
            { title: 'Romantic Seine Cruise & Eiffel Tower Dinner', desc: 'Experience Paris like never before with a private evening cruise followed by a gourmet dinner at the Eiffel Tower’s Jules Verne restaurant.', tag: 'Paris, France', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1600' },
            { title: 'Royal London: Westminster & Buckingham Palace', desc: 'Private guided tour of Westminster Abbey, changing of the guard, and afternoon tea at The Ritz.', tag: 'London, UK', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1600' },
            { title: 'Vatican & Roman Highlights', desc: 'Skip-the-line access to the Vatican Museums, Sistine Chapel, Colosseum, and a private pasta-making class in Trastevere.', tag: 'Rome, Italy', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1600' },
            { title: 'Barcelona Art & Architecture', desc: 'Explore Gaudí’s masterpieces (Sagrada Família, Park Güell) with a private art historian, then enjoy tapas on Las Ramblas.', tag: 'Barcelona, Spain', img: 'https://images.unsplash.com/photo-1539034566940-1b4026d6c2e3?q=80&w=1600' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div>
                <span className="uppercase text-blue-600 tracking-[4px] text-sm font-bold">{item.tag}</span>
                <h2 className="text-4xl font-bold mt-4">{item.title}</h2>
                <p className="text-gray-600 mt-6 leading-8">{item.desc}</p>
              </div>
              <img src={item.img} className="rounded-3xl shadow-xl" alt={item.title} />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION – dynamic */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <span className="uppercase tracking-[4px] text-blue-600 text-sm font-bold">FAQs</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-5">
            {faqDemo.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">{faq.question}</h3>
                  <div
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-lg transition-transform duration-300"
                    style={{ transform: faqOpen[idx] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    ↓
                  </div>
                </button>
                <div className={`px-6 pb-6 ${faqOpen[idx] ? 'block' : 'hidden'}`}>
                  <p className="text-gray-600 leading-8">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRIP BANNER (static) */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop"
          className="w-full h-full object-cover"
          alt="Trip banner"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center">
          <div>
            <span className="text-white uppercase tracking-[4px]">Your Dream Journey Awaits</span>
            <h2 className="text-5xl md:text-7xl font-black text-white mt-4">Explore The World In Luxury</h2>
          </div>
        </div>
      </section>

      {/* LAST SECTION – 5 style cards (static) */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-14">
          <div className="max-w-3xl">
            <span className="uppercase tracking-[4px] text-blue-600 text-sm font-bold">Luxury Holiday Styles</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 leading-tight text-gray-900">
              Find your perfect luxury holiday style
            </h2>
            <p className="text-gray-600 text-lg leading-8 mt-6">
              Whether you dream of serene beaches, lively resorts, or romantic retreats, our holiday styles bring you curated escapes that elevate every moment.
            </p>
          </div>
          <div>
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all duration-300"
            >
              Download Guide
              <span className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">↓</span>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {[
            { name: 'Maldives', type: 'Beach Escapes', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200' },
            { name: 'Dubai', type: 'City Luxury', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200' },
            { name: 'Greece', type: 'Island Retreats', img: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=1200' },
            { name: 'Bali', type: 'Wellness Trips', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200' },
            { name: 'Seychelles', type: 'Romantic Villas', img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200' },
          ].map((item, i) => (
            <div key={i} className="group relative rounded-3xl overflow-hidden h-[340px] cursor-pointer">
              <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-0 left-0 p-5 text-white">
                <span className="uppercase text-[11px] tracking-[3px] opacity-80">{item.name}</span>
                <h3 className="text-2xl font-bold mt-2 leading-tight">{item.type}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER INFO SECTION (static) */}
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

      {/* Black footer (same as other holiday pages) */}
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
    </div>
  );
};

export default CityBreaksPage;