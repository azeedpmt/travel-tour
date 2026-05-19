// src/pages/user/DestinationsPage.tsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { destinationService } from '../../services/destinationService';
import { dealService } from '../../services/dealService';
import { formatCurrency } from '../../utils/format';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Footer from '../../components/common/Footer';

interface Destination {
  _id: string;
  name: string;
  slug: string;
  region: string;
  image: string;
  description?: string;
  featured?: boolean;
}

interface Deal {
  _id: string;
  title: string;
  description: string;
  discountedPrice: number;
  images: string[];
  hotelId?: { city?: string; country?: string };
}

// Demo destinations fallback
const demoDestinations: Destination[] = [
  { _id: '1', name: 'Santorini', slug: 'santorini', region: 'europe', image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=800', description: 'Iconic sunsets and whitewashed luxury.' },
  { _id: '2', name: 'Paris', slug: 'paris', region: 'europe', image: 'https://images.unsplash.com/photo-1503424886303-2e7b14a7f44c?auto=format&fit=crop&w=800', description: 'City of love and lights.' },
  { _id: '3', name: 'Dubai', slug: 'dubai', region: 'middleeast', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800', description: 'Ultra-modern luxury.' },
  { _id: '4', name: 'Bali', slug: 'bali', region: 'asia', image: 'https://images.unsplash.com/photo-1558120222-3c07c4f993e5?auto=format&fit=crop&w=800', description: 'Tropical paradise.' },
  { _id: '5', name: 'New York', slug: 'new-york', region: 'america', image: 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=800', description: 'City that never sleeps.' },
  { _id: '6', name: 'Cape Town', slug: 'cape-town', region: 'africa', image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=800', description: 'Table Mountain views.' },
];

// Demo featured destination
const demoFeatured = {
  _id: 'featured1',
  name: 'Bodrum, Turkey',
  title: 'Boho-chic beach haven where Aegean blues meet laid-back luxury',
  resort: 'My Ella Bodrum Resort And Spa',
  description: 'Spread across low-rise, white-washed blocks draped in bougainvillaea, the resort slopes gently towards the turquoise Aegean. Inside, 165 light-filled rooms combine minimalist décor with natural textures, while outside palm-dotted terraces frame three sparkling pools. A private jetty juts over crystal-clear water for effortless dips, and the spa’s hammam rituals promise pure unwind.',
  price: 321,
  nights: 7,
  image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400',
};

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [featured, setFeatured] = useState<any>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const dealsCarouselRef = useRef<HTMLDivElement>(null);
  const destCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch destinations
      let dests: Destination[] = [];
      try {
        const destRes = await destinationService.getAllDestinations();
        if (destRes.success && destRes.data.length) dests = destRes.data;
        else throw new Error('No destinations from API');
      } catch (err) {
        console.warn('Using demo destinations');
        dests = demoDestinations;
      }
      setDestinations(dests);
      setFilteredDestinations(dests);
      setActiveRegion('all');

      // Fetch featured destination
      let feat = null;
      try {
        const featRes = await destinationService.getFeaturedDestination();
        if (featRes.success && featRes.data) feat = featRes.data;
        else feat = demoFeatured;
      } catch (err) {
        feat = demoFeatured;
      }
      setFeatured(feat);

      // Fetch deals for carousel
      const dealsRes = await dealService.getAllDeals({ limit: 6 });
      if (dealsRes.success && dealsRes.data) setDeals(dealsRes.data);
      else setDeals([]);
    } catch (error) {
      console.error('Error loading destinations page:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByRegion = (region: string) => {
    setActiveRegion(region);
    if (region === 'all') {
      setFilteredDestinations(destinations);
    } else {
      setFilteredDestinations(destinations.filter(d => d.region === region));
    }
  };

  const scrollDeals = (direction: number) => {
    if (dealsCarouselRef.current) {
      const amount = direction * 400;
      dealsCarouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const scrollDestinations = (direction: number) => {
    if (destCarouselRef.current) {
      const amount = direction * 350;
      destCarouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center bg-slate-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Destination"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl text-white font-bold mb-6 leading-tight">
            World's Best Luxury Holiday Destinations
            <span className="italic font-normal">2026/2027</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-100 font-light max-w-2xl mx-auto">
            Discover our hand-picked collection of the world's most exquisite luxury escapes, from the sun-drenched shores of the Maldives to the vibrant pulse of Dubai.
          </p>
        </div>
      </section>

      {/* Explore Destinations Section (static) */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto text-left">
          <h2 className="text-5xl font-bold text-slate-900 mb-7">Explore the most beautiful places for less</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            From sun-drenched islands to iconic coastlines, our destinations bring together unforgettable scenery, stylish resorts, and luxury that feels effortlessly affordable.
          </p>
          <a href="#" className="inline-block bg-slate-900 text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-slate-800 transition">Let's Chat →</a>
        </div>
      </section>

      {/* Featured Destination Section – dynamic */}
      {featured && (
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-14">
              <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Featured Escape</span>
              <h2 className="text-5xl font-bold text-slate-900 mt-4">Check out our featured destination of the week</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="relative h-[500px] lg:h-auto overflow-hidden">
                <img src={featured.image} alt={featured.name} className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                <div className="absolute top-6 left-6 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-900 shadow">Featured Escape</div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="text-amber-600 text-sm font-bold uppercase tracking-wider mb-4">{featured.name}</span>
                <div className="flex gap-1 text-2xl text-amber-500 mb-6">★★★★★</div>
                <h4 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6">{featured.title || featured.resort}</h4>
                <h4 className="text-2xl font-semibold text-slate-900 mb-4">{featured.resort}</h4>
                <p className="text-slate-600 leading-relaxed mb-6">{featured.description}</p>
                <div className="mt-4">
                  <div className="text-slate-500 text-sm mb-2">{featured.nights || 7} nights from</div>
                  <div className="flex items-end gap-3 flex-wrap">
                    <span className="text-5xl font-bold text-slate-900">£{featured.price || 321}</span>
                    <span className="text-slate-500 pb-1">per person</span>
                    <Link to={`/destination/${featured.slug || 'bodrum'}`} className="bg-slate-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider ml-auto hover:bg-slate-800 transition">Explore Resort →</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top Deals Carousel Section (dynamic deals) */}
      {deals.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center flex-wrap gap-6 mb-12">
              <div>
                <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Luxury Collections</span>
                <h2 className="text-5xl font-bold text-slate-900 mt-2">Top deals waiting in every destination</h2>
              </div>
              <Link to="/deals" className="text-slate-800 text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-1">View All PlanMyLuxe Exclusives →</Link>
            </div>
            <div className="relative">
              <button onClick={() => scrollDeals(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition">←</button>
              <div ref={dealsCarouselRef} className="flex gap-6 overflow-x-auto scroll-smooth px-12 pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {deals.map(deal => (
                  <div key={deal._id} className="w-[320px] bg-white border rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                    <img src={deal.images?.[0] || 'https://via.placeholder.com/1200x800'} className="w-full h-64 object-cover" alt={deal.title} />
                    <div className="p-6">
                      <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">{deal.hotelId?.country || 'Exclusive'}</span>
                      <h3 className="text-xl font-bold mt-2">{deal.title}</h3>
                      <p className="text-slate-500 text-sm mt-2 line-clamp-2">{deal.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <span className="text-xs text-slate-400">from</span>
                          <span className="text-2xl font-bold text-slate-900 ml-1">{formatCurrency(deal.discountedPrice)}</span>
                        </div>
                        <Link to={`/deal/${deal._id}`} className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold uppercase">View Deal</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => scrollDeals(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition">→</button>
            </div>
          </div>
        </section>
      )}

      {/* Destinations Filter & Scroll Section – dynamic */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-between items-end gap-6 mb-12">
            <div className="max-w-xl">
              <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Luxury Destinations</span>
              <h2 className="text-5xl font-bold text-slate-900 mt-2">Destinations designed for your escape</h2>
              <p className="text-slate-500 mt-4">Discover hand-picked destinations crafted for unforgettable journeys — from serene escapes to vibrant city adventures.</p>
            </div>
            <Link to="/holiday-styles" className="text-slate-800 text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-1">View All PlanMyLuxe Exclusives →</Link>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            {['all', 'europe', 'asia', 'america', 'africa', 'middleeast'].map(region => (
              <button
                key={region}
                onClick={() => filterByRegion(region)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition ${
                  activeRegion === region ? 'bg-slate-900 text-white' : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {region === 'all' ? 'All' : region.charAt(0).toUpperCase() + region.slice(1)}
              </button>
            ))}
          </div>

          {/* Horizontal Scrollable Destination Cards */}
          {filteredDestinations.length > 0 && (
            <div className="relative">
              <button onClick={() => scrollDestinations(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50">←</button>
              <div ref={destCarouselRef} className="flex gap-5 overflow-x-auto scroll-smooth px-8 pb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}>
                {filteredDestinations.map(dest => (
                  <Link to={`/destination/${dest.slug}`} key={dest._id} className="flex-shrink-0 flex gap-4 bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition w-80">
                    <img src={dest.image} className="w-24 h-24 rounded-lg object-cover" alt={dest.name} />
                    <div>
                      <h3 className="font-bold text-lg">{dest.name}</h3>
                      <p className="text-sm text-slate-500">{dest.description || 'Luxury awaits'}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <button onClick={() => scrollDestinations(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50">→</button>
            </div>
          )}
        </div>
      </section>

      {/* Destinations Tags Section (static with dynamic names) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Our Destinations</span>
              <h2 className="text-5xl font-bold text-slate-900 mt-4">Discover the World of PlanMyLuxe</h2>
              <p className="text-slate-500 mt-4">We have an ever growing range of destinations for the discerning traveller.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {destinations.map(dest => (
                <span key={dest._id} className="bg-white px-4 py-2 rounded-full text-sm border border-slate-200 shadow-sm">{dest.name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Banner (static) */}
      <section className="relative h-[550px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Banner" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4">
          <div>
            <h2 className="text-6xl md:text-7xl font-bold text-white mb-5">Escape Beyond Ordinary</h2>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">Tailor-made luxury holidays designed around your lifestyle and crafted for unforgettable moments.</p>
          </div>
        </div>
      </section>

      {/* Holiday Styles Cards (static) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-between items-end gap-6 mb-12">
            <div className="max-w-2xl">
              <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Curated Experiences</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">Find your perfect holiday style</h2>
              <p className="text-slate-500 mt-4">Whether you dream of serene beaches, lively resorts, or romantic retreats, our holiday styles bring you curated escapes.</p>
            </div>
            <Link to="/holiday-styles" className="text-slate-800 text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-1">View All PlanMyLuxe Exclusives →</Link>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4">
            {['All Inclusive', 'City Breaks', 'Adult Only', 'Beach Holidays', 'Family Holidays'].map(style => (
              <a key={style} href={`/holiday-style/${style.toLowerCase().replace(' ', '-')}`} className="relative w-60 h-80 rounded-2xl overflow-hidden group flex-shrink-0 shadow-md">
                <img src={`https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-5 left-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Luxury</span>
                  <h3 className="text-2xl font-bold mt-1">{style}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Download Card (static) */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 border rounded-2xl overflow-hidden shadow-md">
            <img src="https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=800" className="w-full h-full object-cover" alt="Brochure" />
            <div className="p-10 flex flex-col justify-center">
              <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Luxury Brochure</span>
              <h2 className="text-4xl font-bold mt-4 mb-5">Download Our Exclusive Holiday Collection</h2>
              <p className="text-slate-500 mb-8">Explore hand-picked luxury resorts, exclusive offers, private escapes, and unforgettable destinations across Europe, Asia, and beyond.</p>
              <button className="bg-slate-900 text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-2 w-fit hover:bg-slate-800 transition">⬇ Download Brochure</button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Book Section (static) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">So why book with PlanMyLuxe?</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Whether you're after an affordable luxury beach holiday, an ultra luxury holiday, or something in between, PlanMyLuxe has got you covered with incredible destinations and exclusive experiences. Our holidays cover more than 60 destinations across Europe and beyond. From luxury beach resorts to adults-only escapes and family-friendly stays, we offer more than 9,000 hotels worldwide. Every package includes flights, accommodation, and baggage allowances. We also include free transfers on selected holidays, with complete ATOL protection for peace of mind. We offer flexible departures from airports all across the UK, often with multiple flights per day, making your travel plans convenient and stress-free.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DestinationsPage;