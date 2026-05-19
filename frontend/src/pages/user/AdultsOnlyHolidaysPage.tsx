// src/pages/user/AdultsOnlyHolidaysPage.tsx
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

// Demo deals (fallback)
const demoDeals: Deal[] = [
  {
    _id: 'demo1',
    title: 'Sensatori Resort Crete',
    description: 'An adult‑only paradise featuring swim‑up rooms, gourmet dining, and a world‑class spa. Perfect for couples seeking serenity and luxury.',
    hotelId: { name: 'Sensatori', city: 'Crete', country: 'Greece' },
    originalPrice: 1299,
    discountedPrice: 899,
    duration: 7,
    images: ['https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1200&auto=format&fit=crop'],
    rating: 4.9,
  },
  {
    _id: 'demo2',
    title: 'TUI Blue For Two',
    description: 'Designed exclusively for adults, this resort offers private pools, romantic sunset dining, and unlimited premium drinks.',
    hotelId: { name: 'TUI Blue', city: 'Marmaris', country: 'Turkey' },
    originalPrice: 999,
    discountedPrice: 699,
    duration: 7,
    images: ['https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop'],
    rating: 4.8,
  },
  {
    _id: 'demo3',
    title: 'Secrets Royal Beach',
    description: 'An award‑winning adult‑only resort with unlimited‑luxury® inclusions, swim‑out suites, and nightly entertainment.',
    hotelId: { name: 'Secrets', city: 'Punta Cana', country: 'Dominican Republic' },
    originalPrice: 1899,
    discountedPrice: 1399,
    duration: 7,
    images: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200&auto=format&fit=crop'],
    rating: 4.9,
  },
];

// FAQ demo data (can be replaced with backend data later)
const faqDemo = [
  {
    question: 'What is an adult‑only holiday?',
    answer: 'Adult‑only holidays are designed for guests aged 18 or over, offering a peaceful, sophisticated atmosphere without children. Perfect for couples, friends, or solo travellers seeking relaxation and adult‑focused entertainment.',
  },
  {
    question: 'Are adult‑only resorts more expensive?',
    answer: 'Not necessarily. Many adult‑only resorts offer excellent value, often including premium drinks, gourmet dining, and luxury amenities that rival family resorts.',
  },
  {
    question: 'Do adult‑only resorts have activities?',
    answer: 'Yes – from yoga sessions and spa treatments to mixology classes and live music, adult‑only resorts tailor their activities to an adult audience.',
  },
  {
    question: 'Can I celebrate a honeymoon at an adult‑only resort?',
    answer: 'Absolutely. Adult‑only resorts are extremely popular for honeymoons and romantic getaways, often offering special honeymoon packages.',
  },
  {
    question: 'Is there a dress code in adult‑only hotels?',
    answer: 'Most have a relaxed dress code during the day, while evenings may require smart‑casual attire for dinner and shows.',
  },
];

const AdultsOnlyHolidaysPage = () => {
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
        holidayStyle: 'adults-only',
        limit: 10,
        page: 1,
      });
      if (response.success && response.data && response.data.length > 0) {
        setDeals(response.data.slice(0, 6));
      } else {
        setDeals(demoDeals);
      }
    } catch (error) {
      console.error('Failed to fetch adults-only deals, using demo data:', error);
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
    <div className="bg-gray-50 font-sans text-gray-900 antialiased">
      {/* HERO SECTION */}
      <section
        className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Adults Only Holidays
          </h1>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto opacity-90">
            Discover sophisticated escapes designed exclusively for adults – pure relaxation, romance, and indulgence.
          </p>
        </div>
      </section>

      {/* READ MORE SECTION */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0 border border-gray-100">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <span className="text-sm uppercase tracking-[4px] text-blue-600 font-bold mb-4">
              Sophisticated Travel
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Experience Adult‑Only Luxury
            </h2>
            <div className="text-gray-600 text-lg leading-8 relative">
              <p className={`${!moreOpen ? 'line-clamp-5' : ''} transition-all duration-500`}>
                Escape to a world of grown‑up tranquillity with our handpicked collection of adult‑only resorts. Whether you’re celebrating a honeymoon, an anniversary, or simply need time away from everyday life, these destinations are curated for peace, privacy, and premium service.
                <br /><br />
                From adults‑only beachfront hideaways in the Caribbean to chic boutique hotels in Europe, every stay includes sophisticated dining, relaxing spa treatments, and activities designed for adults. No children means you can unwind by the pool, enjoy late‑night cocktails, and sleep in without interruption.
                <br /><br />
                Our travel experts ensure every detail is handled – from private transfers to romantic excursions – so you can focus on what matters: spending quality time with your partner or friends.
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
              alt="Adults only resort"
            />
          </div>
        </div>
      </section>

      {/* FULL WIDTH CAROUSEL SECTION – dynamic deals */}
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
              <span className="text-white/70 uppercase tracking-[4px] text-sm">Exclusive Escapes</span>
              <h2 className="text-4xl font-bold text-white mt-2">Trending Adults‑Only Destinations</h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (carouselRef.current) carouselRef.current.scrollBy({ left: -374, behavior: 'smooth' });
                }}
                className="w-12 h-12 rounded-full bg-white text-black font-bold text-xl hover:bg-gray-200 transition"
              >
                ←
              </button>
              <button
                onClick={() => {
                  if (carouselRef.current) carouselRef.current.scrollBy({ left: 374, behavior: 'smooth' });
                }}
                className="w-12 h-12 rounded-full bg-white text-black font-bold text-xl hover:bg-gray-200 transition"
              >
                →
              </button>
            </div>
          </div>
          <div className="relative">
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
                      {deal.hotelId?.country || 'Greece'} - {deal.hotelId?.city || 'Crete'}
                    </span>
                    <h3 className="text-2xl font-bold mt-3">{deal.title}</h3>
                    <p className="text-gray-600 mt-4 leading-7 line-clamp-3">
                      {deal.description}
                    </p>
                    <div className="mt-6 flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-500">{deal.duration} nights from</span>
                        <div className="text-3xl font-black">
                          {formatCurrency(deal.discountedPrice)}
                        </div>
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

      {/* ALTERNATING 2 CARDS (static – adapted for adults‑only theme) */}
      <section className="container mx-auto px-4 py-20">
        <div className="space-y-16">
          {/* Card 1: Text Left, Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="uppercase text-blue-600 tracking-[4px] text-sm font-bold">Romantic Retreats</span>
              <h2 className="text-4xl font-bold mt-4">Private Pool & Ocean Views</h2>
              <p className="text-gray-600 mt-6 leading-8">
                Indulge in couples’ massages, candlelit dinners on the beach, and suites with private plunge pools. Perfect for honeymoons or just reconnecting.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1600&auto=format&fit=crop"
              className="rounded-3xl shadow-xl"
              alt="Romantic resort"
            />
          </div>

          {/* Card 2: Image Left, Text Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop"
              className="rounded-3xl shadow-xl order-2 lg:order-1"
              alt="Gourmet dining"
            />
            <div className="order-1 lg:order-2">
              <span className="uppercase text-blue-600 tracking-[4px] text-sm font-bold">Gourmet Dining</span>
              <h2 className="text-4xl font-bold mt-4">Adults‑Only Culinary Journeys</h2>
              <p className="text-gray-600 mt-6 leading-8">
                Enjoy à la carte restaurants, premium drinks packages, and themed dinner nights – all without the noise of children’s play areas.
              </p>
            </div>
          </div>

          {/* Optional extra cards – can be removed if not needed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="uppercase text-blue-600 tracking-[4px] text-sm font-bold">Wellness & Serenity</span>
              <h2 className="text-4xl font-bold mt-4">Adult‑Only Spas & Yoga</h2>
              <p className="text-gray-600 mt-6 leading-8">
                Rejuvenate with daily yoga sessions, thermal suites, and treatments designed for relaxation and wellbeing.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1600&auto=format&fit=crop"
              className="rounded-3xl shadow-xl"
              alt="Spa"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop"
              className="rounded-3xl shadow-xl order-2 lg:order-1"
              alt="Nightlife"
            />
            <div className="order-1 lg:order-2">
              <span className="uppercase text-blue-600 tracking-[4px] text-sm font-bold">Nightlife</span>
              <h2 className="text-4xl font-bold mt-4">Sophisticated Evenings</h2>
              <p className="text-gray-600 mt-6 leading-8">
                Live music, piano bars, and chic lounges – everything crafted for an adult audience.
              </p>
            </div>
          </div>
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
                  <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-lg transition-transform duration-300"
                       style={{ transform: faqOpen[idx] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
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

      {/* LAST SECTION – style examples (static but can be reused) */}
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
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute bottom-0 left-0 p-5 text-white">
                <span className="uppercase text-[11px] tracking-[3px] opacity-80">{item.name}</span>
                <h3 className="text-2xl font-bold mt-2 leading-tight">{item.type}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdultsOnlyHolidaysPage;