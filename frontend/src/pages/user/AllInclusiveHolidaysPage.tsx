// src/pages/user/AllInclusiveHolidaysPage.tsx
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
    title: 'Filion Suites Resort & Spa',
    description: 'The Filion Suites Resort & Spa is a tranquil luxury hotel surrounded by olive trees and close to Bali village with swimming pools, private beach access, water sports, elegant rooms, and premium hospitality.',
    hotelId: { name: 'Filion Suites', city: 'Bali', country: 'Greece' },
    originalPrice: 598,
    discountedPrice: 298,
    duration: 7,
    images: ['https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1200&auto=format&fit=crop'],
    rating: 4.8,
  },
  {
    _id: 'demo2',
    title: 'Ocean Paradise Villas',
    description: 'Relax in stunning overwater villas with private pools, sunset dining, spa experiences, and unforgettable luxury surrounded by turquoise lagoons.',
    hotelId: { name: 'Ocean Paradise', city: 'North Male', country: 'Maldives' },
    originalPrice: 1599,
    discountedPrice: 799,
    duration: 5,
    images: ['https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop'],
    rating: 4.9,
  },
  {
    _id: 'demo3',
    title: 'Royal Atlantis Escape',
    description: 'Enjoy skyline views, infinity pools, luxury shopping, gourmet dining, and private beach experiences in the heart of Dubai.',
    hotelId: { name: 'Royal Atlantis', city: 'Dubai', country: 'UAE' },
    originalPrice: 1999,
    discountedPrice: 999,
    duration: 6,
    images: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200&auto=format&fit=crop'],
    rating: 4.7,
  },
];

// FAQ demo data (replace with backend later)
const faqDemo = [
  {
    question: 'What is included in an all-inclusive holiday?',
    answer: 'Flights, luxury accommodation, meals, beverages, airport transfers, entertainment, and selected excursions are included in most all-inclusive packages.',
  },
  {
    question: 'Can I customize my luxury holiday package?',
    answer: 'Yes, our travel specialists can fully customize your itinerary including destinations, flights, hotels, transfers, and private experiences.',
  },
  {
    question: 'Are airport transfers included?',
    answer: 'Premium airport transfers are included with most luxury holiday packages for a seamless travel experience.',
  },
  {
    question: 'Do luxury resorts include private beach access?',
    answer: 'Many of our featured luxury resorts provide exclusive private beach access, infinity pools, and VIP services.',
  },
  {
    question: 'Can I book multi-destination holidays?',
    answer: 'Absolutely. We specialize in bespoke multi-centre luxury holidays combining several premium destinations into one seamless trip.',
  },
];

const AllInclusiveHolidaysPage = () => {
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
        holidayStyle: 'all-inclusive',
        limit: 10,
        page: 1,
      });
      if (response.success && response.data && response.data.length > 0) {
        setDeals(response.data.slice(0, 6)); // max 6 cards
      } else {
        setDeals(demoDeals);
      }
    } catch (error) {
      console.error('Failed to fetch all-inclusive deals, using demo data:', error);
      setDeals(demoDeals);
    } finally {
      setLoading(false);
    }
  };

  const scrollCarousel = (direction: number) => {
    if (carouselRef.current) {
      const scrollAmount = direction * 370;
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
    <div className="bg-gray-50 font-sans text-gray-900 antialiased">
      {/* HERO SECTION – static banner (can be dynamic later) */}
      <section
        className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1544143435-0810360667e5?q=80&w=2000&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Luxury All Inclusive Holidays
          </h1>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto opacity-90">
            Experience the pinnacle of luxury with our handpicked all-inclusive escapes for 2026 & 2027.
          </p>
        </div>
      </section>

      {/* READ MORE SECTION (static text – can be made dynamic later) */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0 border border-gray-100">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <span className="text-sm uppercase tracking-[4px] text-blue-600 font-bold mb-4">
              Luxury Travel Experiences
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Discover Extraordinary All-Inclusive Holidays
            </h2>
            <div className="text-gray-600 text-lg leading-8 relative">
              <p className={`${!moreOpen ? 'line-clamp-5' : ''} transition-all duration-500`}>
                Experience luxury travel like never before with our handpicked collection of all-inclusive resorts and bespoke holiday experiences across the world’s most stunning destinations. From the crystal-clear waters of Greece to the tropical paradise of Bali and the white sandy beaches of the Maldives, every journey is designed to deliver unforgettable memories.
                <br /><br />
                Our premium travel packages include luxury accommodation, gourmet dining, airport transfers, curated excursions, private beach access, wellness experiences, and world-class hospitality. Whether you're planning a romantic honeymoon, a family getaway, or a relaxing escape with friends, our travel experts ensure every detail is perfectly arranged.
                <br /><br />
                Enjoy breathtaking sunsets, exclusive infinity pools, fine dining restaurants, spa retreats, and personalized service throughout your stay. We believe every traveler deserves a seamless luxury experience with comfort, elegance, and exceptional value.
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
              alt="Luxury resort"
            />
          </div>
        </div>
      </section>

      {/* FULL WIDTH CAROUSEL SECTION – dynamic deals */}
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
        <span className="text-white/70 uppercase tracking-[4px] text-sm">Luxury Escapes</span>
        <h2 className="text-4xl font-bold text-white mt-2">Trending Holiday Destinations</h2>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => {
            if (carouselRef.current) {
              carouselRef.current.scrollBy({ left: -374, behavior: 'smooth' });
            }
          }}
          className="w-12 h-12 rounded-full bg-white text-black font-bold text-xl hover:bg-gray-200 transition"
        >
          ←
        </button>
        <button
          onClick={() => {
            if (carouselRef.current) {
              carouselRef.current.scrollBy({ left: 374, behavior: 'smooth' });
            }
          }}
          className="w-12 h-12 rounded-full bg-white text-black font-bold text-xl hover:bg-gray-200 transition"
        >
          →
        </button>
      </div>
    </div>

    {/* Carousel wrapper – hides scrollbar but allows scroll */}
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
      {/* <section className="relative py-24 overflow-hidden">
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
              <h2 className="text-4xl font-bold text-white mt-2">Trending Holiday Destinations</h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => scrollCarousel(-1)}
                className="w-12 h-12 rounded-full bg-white text-black font-bold text-xl"
              >
                ←
              </button>
              <button
                onClick={() => scrollCarousel(1)}
                className="w-12 h-12 rounded-full bg-white text-black font-bold text-xl"
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
                  className="min-w-[350px] bg-white rounded-3xl overflow-hidden shadow-xl flex-shrink-0"
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
      </section> */}

      {/* ALTERNATING 2 CARDS (static) */}
<section className="container mx-auto px-4 py-20">
  <div className="space-y-16">
    {/* Card 1: Text Left, Image Right */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="uppercase text-blue-600 tracking-[4px] text-sm font-bold">Luxury Resorts</span>
        <h2 className="text-4xl font-bold mt-4">Premium Beachfront Escapes</h2>
        <p className="text-gray-600 mt-6 leading-8">
          Discover world-class beachfront resorts with stunning views, infinity pools, fine dining, and unforgettable luxury experiences.
        </p>
      </div>
      <img
        src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1600&auto=format&fit=crop"
        className="rounded-3xl shadow-xl"
        alt="Beach resort"
      />
    </div>

    {/* Card 2: Image Left, Text Right (opposite of first) */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <img
        src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1600&auto=format&fit=crop"
        className="rounded-3xl shadow-xl"
        alt="Dining"
      />
      <div>
        <span className="uppercase text-blue-600 tracking-[4px] text-sm font-bold">Luxury Dining</span>
        <h2 className="text-4xl font-bold mt-4">Gourmet Culinary Experiences</h2>
        <p className="text-gray-600 mt-6 leading-8">
          Enjoy Michelin-inspired dining, handcrafted cocktails, and curated food journeys across premium destinations.
        </p>
      </div>
    </div>

    {/* Card 3: Text Left, Image Right */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="uppercase text-blue-600 tracking-[4px] text-sm font-bold">Luxury Resorts</span>
        <h2 className="text-4xl font-bold mt-4">Premium Beachfront Escapes</h2>
        <p className="text-gray-600 mt-6 leading-8">
          Discover world-class beachfront resorts with stunning views, infinity pools, fine dining, and unforgettable luxury experiences.
        </p>
      </div>
      <img
        src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1600&auto=format&fit=crop"
        className="rounded-3xl shadow-xl"
        alt="Beach resort"
      />
    </div>

    {/* Card 4: Image Left, Text Right (opposite of first) */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <img
        src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1600&auto=format&fit=crop"
        className="rounded-3xl shadow-xl"
        alt="Dining"
      />
      <div>
        <span className="uppercase text-blue-600 tracking-[4px] text-sm font-bold">Luxury Dining</span>
        <h2 className="text-4xl font-bold mt-4">Gourmet Culinary Experiences</h2>
        <p className="text-gray-600 mt-6 leading-8">
          Enjoy Michelin-inspired dining, handcrafted cocktails, and curated food journeys across premium destinations.
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
              <div key={idx} className="faq-item bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100">
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

      {/* LAST SECTION – style examples (static) */}
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
          {/* Cards – static as in HTML */}
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

      <Footer/>
    </div>
  );
};

export default AllInclusiveHolidaysPage;