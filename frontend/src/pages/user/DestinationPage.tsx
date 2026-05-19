// // src/pages/user/DestinationPage.tsx
// import { useState, useEffect, useRef } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { dealService } from '../../services/dealService';
// import { destinationService } from '../../services/destinationService';
// import { formatCurrency } from '../../utils/format';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import Footer from '../../components/common/Footer';

// interface Destination {
//   _id: string;
//   name: string;
//   slug: string;
//   heroImage: string;
//   heroTitle: string;
//   heroSubtitle: string;
//   experienceTitle: string;
//   experienceDescription: string;
//   experienceImage: string;
//   readMoreText: string;
//   deals: any[];               // deals specific to this destination
//   zigzagCards: Array<{
//     title: string;
//     description: string;
//     image: string;
//     order: 'left' | 'right';
//   }>;
//   mapEmbedUrl: string;
//   weather: {
//     title: string;
//     description: string;
//     cards: Array<{
//       season: string;
//       heading: string;
//       temp: string;
//       description: string;
//       image: string;
//     }>;
//   };
//   latitude?: number;
//   longitude?: number;
// }

// // Demo destination data (fallback)
// const demoDestination: Destination = {
//   _id: 'demo1',
//   name: 'Croatia',
//   slug: 'croatia',
//   heroImage: 'https://images.unsplash.com/photo-1555990538-967e40298ff4?q=80&w=2000&auto=format&fit=crop',
//   heroTitle: 'Croatia',
//   heroSubtitle: 'Luxury Holidays & Bespoke Experiences',
//   experienceTitle: 'Unveiling the Adriatic',
//   experienceDescription: 'Croatia is a land where history and luxury meet seamlessly. From the ancient Roman walls of Split to the sparkling nightlife of Hvar, every corner offers a unique story.',
//   experienceImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop',
//   readMoreText: 'Experience private yacht charters through the Kornati Islands, or indulge in truffle hunting in the heart of Istria. Our curated resorts offer world-class spas, Michelin-starred dining, and unparalleled views of the turquoise sea. We ensure that every detail of your journey is handled with the utmost care and sophistication.',
//   deals: [
//     { _id: 'deal1', title: 'Dubrovnik Palace', rating: 4, price: 2450, image: 'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=400&h=250&fit=crop' },
//     { _id: 'deal2', title: 'Hvar Heritage', rating: 4, price: 1890, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop' },
//     { _id: 'deal3', title: 'Split Serenity', rating: 4, price: 2100, image: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=400&h=250&fit=crop' },
//     { _id: 'deal4', title: 'Rovinj Retreat', rating: 4, price: 3200, image: 'https://images.unsplash.com/photo-1590716202578-d7c582cdc120?w=400&h=250&fit=crop' },
//     { _id: 'deal5', title: 'Zadar Zenith', rating: 4, price: 1650, image: 'https://images.unsplash.com/photo-1562602882-099a1d0c554a?w=400&h=250&fit=crop' },
//     { _id: 'deal6', title: 'Korčula Keys', rating: 4, price: 2780, image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=400&h=250&fit=crop' },
//     { _id: 'deal7', title: 'Brač Bliss', rating: 4, price: 1950, image: 'https://images.unsplash.com/photo-1543743336-e48358c33f20?w=400&h=250&fit=crop' },
//     { _id: 'deal8', title: 'Pula Port', rating: 4, price: 1420, image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=250&fit=crop' },
//   ],
//   zigzagCards: [
//     { title: 'Private Island Hopping', description: 'Charter a private motorboat and explore the hidden gems of the Elaphiti Islands, away from the crowds with a personal skipper.', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop', order: 'right' },
//     { title: 'Historic Vineyard Tours', description: 'Taste the finest Plavac Mali in the steep vineyards of Pelješac, accompanied by local cheese and artisanal olive oils.', image: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=600&h=400&fit=crop', order: 'left' },
//     { title: 'Michelin Dining', description: 'Dine under the stars on the medieval walls of Dubrovnik at 360, where traditional flavors meet modern culinary art.', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=400&fit=crop', order: 'right' },
//     { title: 'Hidden Coves of Vis', description: 'Discover Stiniva Cove, voted the most beautiful beach in Europe, accessible only by hiking or small boat.', image: 'https://images.unsplash.com/photo-1552554650-70f90760882e?w=600&h=400&fit=crop', order: 'left' },
//   ],
//   mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1446733.9171783033!2d14.524855848529324!3d44.47116812821213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133441080aba7087%3A0x400ad50862bc0b0!2sCroatia!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk',
//   weather: {
//     title: 'What to Expect from Croatia Weather',
//     description: 'Croatia enjoys a pleasant Mediterranean climate along its coastline, with warm summers and gently changing seasons. Spring brings mild temperatures and bright days, ideal for sightseeing and coastal walks. Summer is hot and sunny with refreshing sea breezes, while autumn remains comfortably warm and quieter. Winter is mild along the coast, offering crisp evenings and clear, calm days.',
//     cards: [
//       { season: 'January – March', heading: 'Quiet Cities', temp: '8°C – 15°C', description: 'Perfect for peaceful exploration of the historic centers.', image: 'https://images.unsplash.com/photo-1526481280695-3c4691f8f6df?q=80&w=1200&auto=format&fit=crop' },
//       { season: 'April – June', heading: 'Coastal Wandering', temp: '16°C – 25°C', description: 'Mild weather ideal for active coastal walks and nature trips.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop' },
//       { season: 'July – September', heading: 'Adriatic Summer', temp: '26°C – 34°C', description: 'Peak sun and warm waters for the ultimate beach holiday.', image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=1200&auto=format&fit=crop' },
//       { season: 'October – December', heading: 'Calm Coastline', temp: '10°C – 18°C', description: 'Cooler evenings and relaxed coastal towns with fewer crowds.', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop' },
//     ],
//   },
// };

// const DestinationPage = () => {
//   const { slug } = useParams<{ slug: string }>();
//   const [destination, setDestination] = useState<Destination | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [readMoreOpen, setReadMoreOpen] = useState(false);
//   const [activeDealSlide, setActiveDealSlide] = useState(0);
//   const dealsCarouselRef = useRef<HTMLDivElement>(null);
//   const fullWidthCarouselRef = useRef<HTMLDivElement>(null);
//   const destScrollRef = useRef<HTMLDivElement>(null);
//  const [destinationDeals, setDestinationDeals] = useState<Deal[]>([]);
//   useEffect(() => {
//     fetchDestination();
//   }, [slug]);

//   const fetchDestination = async () => {
//     setLoading(true);
//     try {
//       // Attempt to fetch destination by slug from backend
//       // Example: GET /api/destinations/slug/:slug
//       const response = await destinationService.getDestinationBySlug(slug);
//       if (response.success && response.data) {
//         setDestination(response.data);
//       } else {
//         // Fallback to demo data if slug matches 'croatia', otherwise generic demo
//         if (slug === 'croatia') setDestination(demoDestination);
//         else setDestination({ ...demoDestination, name: slug, slug: slug });
//       }
//     } catch (error) {
//       console.error('Failed to fetch destination, using demo data:', error);
//       if (slug === 'croatia') setDestination(demoDestination);
//       else setDestination({ ...demoDestination, name: slug, slug: slug });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper to render stars
//   const renderStars = (rating: number) => {
//     const fullStars = Math.floor(rating);
//     const emptyStars = 5 - fullStars;
//     return (
//       <div className="text-warning mb-0">
//         {'★'.repeat(fullStars)}{'☆'.repeat(emptyStars)}
//       </div>
//     );
//   };

//   // Deal carousel navigation (Bootstrap 5)
//   const nextDealSlide = () => {
//     if (dealsCarouselRef.current) {
//       const totalSlides = Math.ceil((destination?.deals.length || 0) / 3);
//       setActiveDealSlide((prev) => (prev + 1) % totalSlides);
//       // In a real Bootstrap carousel, we would manipulate the carousel instance.
//       // For simplicity, we'll simulate by scrolling the inner container.
//       const inner = dealsCarouselRef.current.querySelector('.carousel-inner') as HTMLElement;
//       if (inner) inner.style.transform = `translateX(-${activeDealSlide * 100}%)`;
//     }
//   };

//   const prevDealSlide = () => {
//     if (dealsCarouselRef.current) {
//       const totalSlides = Math.ceil((destination?.deals.length || 0) / 3);
//       setActiveDealSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
//       const inner = dealsCarouselRef.current.querySelector('.carousel-inner') as HTMLElement;
//       if (inner) inner.style.transform = `translateX(-${activeDealSlide * 100}%)`;
//     }
//   };

//   // Full width carousel scroll (horizontal)
//   const scrollFullWidthCarousel = (direction: number) => {
//     if (fullWidthCarouselRef.current) {
//       const scrollAmount = direction * 370;
//       fullWidthCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//     }
//   };

//   // Destinations scroll (drag & wheel)
//   const handleWheel = (e: React.WheelEvent) => {
//     if (destScrollRef.current) {
//       e.preventDefault();
//       destScrollRef.current.scrollLeft += e.deltaY;
//     }
//   };
  

//   if (loading) return <LoadingSpinner />;
//   if (!destination) return <div className="text-center py-20">Destination not found</div>;

//   return (
//     <div style={{ margin: 0, padding: 0, fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", backgroundColor: '#fcfcfc', color: '#333', overflowX: 'hidden' }}>
      
//       {/* 1. Hero Section */}
//       <header style={{ position: 'relative', height: '80vh', minHeight: '500px', backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${destination.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white' }}>
//         <div style={{ maxWidth: '900px', padding: '20px' }}>
//           <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>{destination.heroTitle}</h1>
//           <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontWeight: 300, marginBottom: '30px', letterSpacing: '1px' }}>{destination.heroSubtitle}</p>
//           <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
//             <button style={{ backgroundColor: '#c5a059', color: 'white', border: 'none', padding: '15px 35px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}>Explore Resorts</button>
//             <button style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '15px 35px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}>Enquire Now</button>
//           </div>
//         </div>
//       </header>

//       {/* 2. Read More Section with Side Image */}
//       <section style={{ maxWidth: '1000px', margin: '80px auto', padding: '0 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px', justifyContent: 'center' }}>
//         <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
//           <span style={{ color: '#c5a059', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '13px', fontWeight: 600 }}>The Experience</span>
//           <h2 style={{ fontSize: '2.5rem', margin: '15px 0', fontWeight: 400, color: '#1a1a1a' }}>{destination.experienceTitle}</h2>
//           <div id="text-container" style={{ color: '#666', fontSize: '1.05rem' }}>
//             <p>{destination.experienceDescription}</p>
//             {readMoreOpen && <p>{destination.readMoreText}</p>}
//           </div>
//           <button onClick={() => setReadMoreOpen(!readMoreOpen)} style={{ background: 'none', border: 'none', color: '#c5a059', fontWeight: 700, cursor: 'pointer', padding: 0, marginTop: '10px', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px' }}>
//             {readMoreOpen ? 'Read Less' : 'Read More'}
//           </button>
//         </div>
//         <div style={{ flex: '1 1 45%', minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
//           <img src={destination.experienceImage} alt={destination.name} style={{ width: '100%', maxWidth: '450px', borderRadius: '8px', boxShadow: '20px 20px 0px #f0f0f0' }} />
//         </div>
//       </section>

//       {/* 3. Deals Carousel (Bootstrap 5) */}
//       {destination.deals && destination.deals.length > 0 && (
//         <section className="bg-light py-5">
//           <div className="container">
//             <h2 className="text-center mb-5">Exclusive {destination.name} Deals</h2>
//             <div id="dealsCarousel" className="carousel slide" data-bs-ride="carousel" ref={dealsCarouselRef}>
//               <div className="carousel-inner">
//                 {Array.from({ length: Math.ceil(destination.deals.length / 3) }).map((_, slideIdx) => (
//                   <div key={slideIdx} className={`carousel-item ${slideIdx === 0 ? 'active' : ''}`}>
//                     <div className="row justify-content-center gx-3 gy-0">
//                       {destination.deals.slice(slideIdx * 3, slideIdx * 3 + 3).map((deal, idx) => (
//                         <div key={deal._id} className="col-12 col-md-3">
//                           <div className="card h-100" style={{ width: '250px', height: '300px' }}>
//                             <img src={deal.image} className="card-img-top" alt={deal.title} style={{ height: '180px', objectFit: 'cover' }} />
//                             <div className="card-body p-2">
//                               <h6 className="card-title mb-0">{deal.title}</h6>
//                               {renderStars(deal.rating)}
//                               <p className="text-danger fw-bold mb-0">from £{deal.price}</p>
//                               <Link to={`/deal/${deal._id}`} className="text-decoration-none small">View More</Link>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <button className="carousel-control-prev" type="button" data-bs-target="#dealsCarousel" data-bs-slide="prev">
//                 <span className="carousel-control-prev-icon bg-dark rounded-circle" aria-hidden="true"></span>
//                 <span className="visually-hidden">Previous</span>
//               </button>
//               <button className="carousel-control-next" type="button" data-bs-target="#dealsCarousel" data-bs-slide="next">
//                 <span className="carousel-control-next-icon bg-dark rounded-circle" aria-hidden="true"></span>
//                 <span className="visually-hidden">Next</span>
//               </button>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* 4. Zig-Zag Content Cards (4 Cards) */}
//       <section style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 20px' }}>
//         {destination.zigzagCards.map((card, idx) => (
//           <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px', marginBottom: '60px' }}>
//             <div style={{ flex: 1, minWidth: '300px', order: card.order === 'right' ? 2 : 1 }}>
//               <h3 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>{`0${idx + 1}. ${card.title}`}</h3>
//               <p style={{ color: '#666' }}>{card.description}</p>
//             </div>
//             <div style={{ flex: 1, minWidth: '300px', order: card.order === 'right' ? 1 : 2 }}>
//               <img src={card.image} style={{ width: '100%', borderRadius: '8px' }} alt={card.title} />
//             </div>
//           </div>
//         ))}
//       </section>

//       {/* 5. Map Section */}
//       <section style={{ height: '450px', width: '100%', background: '#eee' }}>
//         <iframe src={destination.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`${destination.name} map`}></iframe>
//       </section>

//       {/* 6. Weather Section */}
//       <section style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
//         <h2 style={{ fontSize: '2.5rem', color: '#1a1a1a', marginBottom: '20px', fontWeight: 400 }}>{destination.weather.title}</h2>
//         <p style={{ maxWidth: '900px', margin: '0 auto 50px auto', color: '#666', fontSize: '1.1rem', lineHeight: 1.8 }}>{destination.weather.description}</p>
//         <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
//           {destination.weather.cards.map((card, idx) => (
//             <div key={idx} style={{ flex: '1 1 250px', maxWidth: '280px', position: 'relative', overflow: 'hidden', borderRadius: '14px', minHeight: '360px', background: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${card.image})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', display: 'flex', alignItems: 'flex-end', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}>
//               <div style={{ padding: '30px', textAlign: 'left' }}>
//                 <div style={{ fontSize: '12px', color: '#f4d08a', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, marginBottom: '10px' }}>{card.season}</div>
//                 <h4 style={{ margin: '0 0 15px 0', fontSize: '1.4rem' }}>{card.heading}</h4>
//                 <div style={{ fontSize: '2.3rem', fontWeight: 300, marginBottom: '10px' }}>{card.temp}</div>
//                 <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.6 }}>{card.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* FULL WIDTH CAROUSEL SECTION (other destinations) */}
//       <section className="relative py-24 overflow-hidden">
//         <div className="absolute inset-0">
//           <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="background" />
//           <div className="absolute inset-0 bg-black/70"></div>
//         </div>
//         <div className="container mx-auto px-4 relative z-10">
//           <div className="flex justify-between items-center mb-10">
//             <div>
//               <span className="text-white/70 uppercase tracking-[4px] text-sm">Luxury Escapes</span>
//               <h2 className="text-4xl font-bold text-white mt-2">Trending Holiday Destinations</h2>
//             </div>
//             <div className="flex gap-3">
//               <button onClick={() => scrollFullWidthCarousel(-1)} className="w-12 h-12 rounded-full bg-white text-black font-bold text-xl hover:bg-gray-200 transition">←</button>
//               <button onClick={() => scrollFullWidthCarousel(1)} className="w-12 h-12 rounded-full bg-white text-black font-bold text-xl hover:bg-gray-200 transition">→</button>
//             </div>
//           </div>
//           <div className="overflow-hidden">
//             <div ref={fullWidthCarouselRef} className="flex gap-6 overflow-x-auto scroll-smooth pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
//               {/* Example cards – you can fetch other destinations here */}
//               {['Croatia', 'Greece', 'Maldives', 'Dubai'].map((dest, idx) => (
//                 <div key={idx} className="min-w-[350px] w-[350px] bg-white rounded-3xl overflow-hidden shadow-xl flex-shrink-0">
//                   <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1200" className="h-64 w-full object-cover" alt={dest} />
//                   <div className="p-6">
//                     <span className="text-xs uppercase tracking-[3px] text-blue-600 font-bold">Luxury Destination</span>
//                     <h3 className="text-2xl font-bold mt-3">{dest}</h3>
//                     <p className="text-gray-600 mt-4 leading-7">Discover unforgettable luxury experiences in {dest}.</p>
//                     <div className="mt-6 flex justify-between items-center">
//                       <div><span className="text-sm text-gray-500">7 nights from</span><div className="text-3xl font-black">£699</div><span className="text-sm text-gray-500">per person</span></div>
//                       <Link to={`/destination/${dest.toLowerCase()}`} className="w-14 h-14 rounded-full bg-black text-white text-xl flex items-center justify-center hover:scale-110 transition">→</Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* DESTINATIONS SCROLL SECTION (other destinations) – static but can be made dynamic */}     
//       <section style={{ padding: '110px 0', background: '#f8fafc' }}>
//         <div style={{ maxWidth: '1280px', margin: 'auto', padding: '0 20px' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '30px', flexWrap: 'wrap', marginBottom: '50px' }}>
//             <div style={{ flex: 1, minWidth: '250px' }}>
//               <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#d97706' }}>Luxury Destinations</span>
//               <h2 style={{ fontSize: '62px', lineHeight: 1.1, fontWeight: 700, color: '#0f172a', marginTop: '18px' }}>Destinations designed for your escape</h2>
//               <p style={{ fontSize: '16px', lineHeight: 1.9, color: '#64748b', maxWidth: '700px', marginTop: '18px' }}>Discover hand-picked destinations crafted for unforgettable journeys — from serene escapes to vibrant city adventures.</p>
//             </div>
//             <div style={{ flexShrink: 0 }}>
//               <Link to="/destinations" className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-1">View All PlanMyLuxe Exclusives →</Link>
//             </div>
//           </div>
//           <div ref={destScrollRef} onWheel={handleWheel} style={{ display: 'flex', gap: '20px', overflowX: 'auto', cursor: 'grab', scrollBehavior: 'smooth' }}>
//             {['Santorini', 'Paris', 'Rome', 'Barcelona', 'Dubai', 'Maldives', 'Bali', 'New York'].map((city, idx) => (
//               <div key={idx} className="destination-card" style={{ flex: '0 0 auto', display: 'flex', gap: '18px', background: 'white', padding: '18px', border: '1px solid #e2e8f0', alignItems: 'center', minWidth: '250px', maxWidth: '300px', borderRadius: '8px' }}>
//                 <img src="https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=800" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} alt={city} />
//                 <div><h3 style={{ fontSize: '18px', margin: 0 }}>{city}</h3><p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Luxury awaits</p></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Luxury Banner */}
//       <section className="mt-24 relative rounded-3xl overflow-hidden h-[420px]">
//         <img src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=2000" alt="Luxury Banner" className="absolute inset-0 w-full h-full object-cover" />
//         <div className="absolute inset-0 bg-black/50"></div>
//         <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
//           <div className="max-w-3xl">
//             <span className="uppercase tracking-[0.3em] text-amber-400 text-sm">Luxury Beyond Expectations</span>
//             <h2 className="text-4xl md:text-6xl text-white mt-4 mb-6 font-bold">Escape Into Extraordinary Destinations</h2>
//             <p className="text-gray-200 text-lg leading-relaxed mb-8">Discover immersive luxury experiences crafted for unforgettable memories and timeless journeys.</p>
//             <button className="bg-white text-slate-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all font-medium">Discover More</button>
//           </div>
//         </div>
//       </section>

//       {/* FOOTER INFO SECTION (static – can be made dynamic via CMS) */}
//       <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h3 className="text-2xl font-bold mb-4">Book with Confidence</h3>
//             <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 font-medium">
//               <div className="flex items-center"><span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-black">✓</span> ATOL Protected</div>
//               <div className="flex items-center"><span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-black">✓</span> ABTA Bonded</div>
//               <div className="flex items-center"><span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-black">✓</span> Low Deposits</div>
//               <div className="flex items-center"><span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-black">✓</span> Flexible Payments</div>
//             </div>
//           </div>
//           <p className="text-center text-gray-400 text-xs border-t border-gray-100 pt-8">© 2025 PlanMyLuxe. All prices subject to availability.</p>
//         </div>
//       </footer>

//       {/* Black footer */}
//       <footer className="bg-black text-gray-500 py-16 px-4 text-center border-t border-gray-900">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-white text-2xl font-bold mb-8 tracking-widest uppercase">Mitsis × PlanMyLuxe</h2>
//           <div className="flex justify-center gap-8 mb-12 text-sm uppercase tracking-widest">
//             <a href="#" className="hover:text-white transition-colors">Privacy</a>
//             <a href="#" className="hover:text-white transition-colors">Terms</a>
//             <a href="#" className="hover:text-white transition-colors">Cookies</a>
//             <a href="#" className="hover:text-white transition-colors">Contact</a>
//           </div>
//           <p className="text-[10px] leading-loose max-w-lg mx-auto opacity-50">© 2024 PlanMyLuxe Hotel Group. All rights reserved. Managed independently. All prices subject to availability.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default DestinationPage;


// src/pages/user/DestinationPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dealService } from '../../services/dealService';
import { destinationService } from '../../services/destinationService';
import { formatCurrency } from '../../utils/format';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Footer from '../../components/common/Footer';
import type { Deal } from '../../types';  // 👈 FIX: Import Deal type
import DestinationMap from '../../components/common/DestinationMap';

interface Destination {
  _id: string;
  name: string;
  slug: string;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  experienceTitle: string;
  experienceDescription: string;
  experienceImage: string;
  readMoreText: string;
  deals: any[];               // deals specific to this destination
  zigzagCards: Array<{
    title: string;
    description: string;
    image: string;
    order: 'left' | 'right';
  }>;
  mapEmbedUrl: string;
  weather: {
    title: string;
    description: string;
    cards: Array<{
      season: string;
      heading: string;
      temp: string;
      description: string;
      image: string;
    }>;
  };
  latitude?: number;
  longitude?: number;
}

// Demo destination data (fallback)
// const demoDestination: Destination = {
//   _id: 'demo1',
//   name: 'Croatia',
//   slug: 'croatia',
//   heroImage: 'https://images.unsplash.com/photo-1555990538-967e40298ff4?q=80&w=2000&auto=format&fit=crop',
//   heroTitle: 'Croatia',
//   heroSubtitle: 'Luxury Holidays & Bespoke Experiences',
//   experienceTitle: 'Unveiling the Adriatic',
//   experienceDescription: 'Croatia is a land where history and luxury meet seamlessly. From the ancient Roman walls of Split to the sparkling nightlife of Hvar, every corner offers a unique story.',
//   experienceImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop',
//   readMoreText: 'Experience private yacht charters through the Kornati Islands, or indulge in truffle hunting in the heart of Istria. Our curated resorts offer world-class spas, Michelin-starred dining, and unparalleled views of the turquoise sea. We ensure that every detail of your journey is handled with the utmost care and sophistication.',
//   deals: [
//     { _id: 'deal1', title: 'Dubrovnik Palace', rating: 4, price: 2450, image: 'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=400&h=250&fit=crop' },
//     { _id: 'deal2', title: 'Hvar Heritage', rating: 4, price: 1890, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop' },
//     { _id: 'deal3', title: 'Split Serenity', rating: 4, price: 2100, image: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=400&h=250&fit=crop' },
//     { _id: 'deal4', title: 'Rovinj Retreat', rating: 4, price: 3200, image: 'https://images.unsplash.com/photo-1590716202578-d7c582cdc120?w=400&h=250&fit=crop' },
//     { _id: 'deal5', title: 'Zadar Zenith', rating: 4, price: 1650, image: 'https://images.unsplash.com/photo-1562602882-099a1d0c554a?w=400&h=250&fit=crop' },
//     { _id: 'deal6', title: 'Korčula Keys', rating: 4, price: 2780, image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=400&h=250&fit=crop' },
//     { _id: 'deal7', title: 'Brač Bliss', rating: 4, price: 1950, image: 'https://images.unsplash.com/photo-1543743336-e48358c33f20?w=400&h=250&fit=crop' },
//     { _id: 'deal8', title: 'Pula Port', rating: 4, price: 1420, image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=250&fit=crop' },
//   ],
//   zigzagCards: [
//     { title: 'Private Island Hopping', description: 'Charter a private motorboat and explore the hidden gems of the Elaphiti Islands, away from the crowds with a personal skipper.', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop', order: 'right' },
//     { title: 'Historic Vineyard Tours', description: 'Taste the finest Plavac Mali in the steep vineyards of Pelješac, accompanied by local cheese and artisanal olive oils.', image: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=600&h=400&fit=crop', order: 'left' },
//     { title: 'Michelin Dining', description: 'Dine under the stars on the medieval walls of Dubrovnik at 360, where traditional flavors meet modern culinary art.', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=400&fit=crop', order: 'right' },
//     { title: 'Hidden Coves of Vis', description: 'Discover Stiniva Cove, voted the most beautiful beach in Europe, accessible only by hiking or small boat.', image: 'https://images.unsplash.com/photo-1552554650-70f90760882e?w=600&h=400&fit=crop', order: 'left' },
//   ],
//   mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1446733.9171783033!2d14.524855848529324!3d44.47116812821213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133441080aba7087%3A0x400ad50862bc0b0!2sCroatia!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk',
//   weather: {
//     title: 'What to Expect from Croatia Weather',
//     description: 'Croatia enjoys a pleasant Mediterranean climate along its coastline, with warm summers and gently changing seasons. Spring brings mild temperatures and bright days, ideal for sightseeing and coastal walks. Summer is hot and sunny with refreshing sea breezes, while autumn remains comfortably warm and quieter. Winter is mild along the coast, offering crisp evenings and clear, calm days.',
//     cards: [
//       { season: 'January – March', heading: 'Quiet Cities', temp: '8°C – 15°C', description: 'Perfect for peaceful exploration of the historic centers.', image: 'https://images.unsplash.com/photo-1526481280695-3c4691f8f6df?q=80&w=1200&auto=format&fit=crop' },
//       { season: 'April – June', heading: 'Coastal Wandering', temp: '16°C – 25°C', description: 'Mild weather ideal for active coastal walks and nature trips.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop' },
//       { season: 'July – September', heading: 'Adriatic Summer', temp: '26°C – 34°C', description: 'Peak sun and warm waters for the ultimate beach holiday.', image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=1200&auto=format&fit=crop' },
//       { season: 'October – December', heading: 'Calm Coastline', temp: '10°C – 18°C', description: 'Cooler evenings and relaxed coastal towns with fewer crowds.', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop' },
//     ],
//   },
// };


const DestinationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [readMoreOpen, setReadMoreOpen] = useState(false);
  const [activeDealSlide, setActiveDealSlide] = useState(0);
  const dealsCarouselRef = useRef<HTMLDivElement>(null);
  const fullWidthCarouselRef = useRef<HTMLDivElement>(null);
  const destScrollRef = useRef<HTMLDivElement>(null);
  const [destinationDeals, setDestinationDeals] = useState<Deal[]>([]);

  useEffect(() => {
    fetchDestination();
  }, [slug]);

  const fetchDestination = async () => {
    setLoading(true);
    try {
      const response = await destinationService.getDestinationBySlug(slug!);
      if (response.success && response.data) {
        setDestination(response.data);
      } else {
        // Fallback to demo data if slug matches 'croatia', otherwise generic demo
        if (slug === 'croatia') setDestination(demoDestination);
        else setDestination({ ...demoDestination, name: slug || 'Destination', slug: slug || 'destination' });
      }
    } catch (error) {
      console.error('Failed to fetch destination, using demo data:', error);
      if (slug === 'croatia') setDestination(demoDestination);
      else setDestination({ ...demoDestination, name: slug || 'Destination', slug: slug || 'destination' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (destination?._id) {
      fetchDestinationDeals();
    }
  }, [destination]);
const fetchDestinationDeals = async () => {
  if (!destination?._id) return;
  try {
    const res = await dealService.getAllDeals({ destinationId: destination._id, limit: 10 });
    if (res.success) {
      setDestinationDeals(res.data);
    } else {
      setDestinationDeals([]);
    }
  } catch (error) {
    console.error('Failed to fetch deals for this destination:', error);
    setDestinationDeals([]);
  }
};
  // const fetchDestinationDeals = async () => {
  //   try {
  //     const res = await dealService.getAllDeals({ destinationId: destination!._id, limit: 10 });
  //     if (res.success) setDestinationDeals(res.data);
  //   } catch (error) {
  //     console.error('Failed to fetch deals for this destination:', error);
  //   }
  // };

  // Helper to render stars
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
      <div className="text-warning mb-0">
        {'★'.repeat(fullStars)}{'☆'.repeat(emptyStars)}
      </div>
    );
  };

  // Deal carousel navigation (Bootstrap 5)
  const nextDealSlide = () => {
    if (dealsCarouselRef.current) {
      const totalSlides = Math.ceil((destination?.deals.length || 0) / 3);
      setActiveDealSlide((prev) => (prev + 1) % totalSlides);
      const inner = dealsCarouselRef.current.querySelector('.carousel-inner') as HTMLElement;
      if (inner) inner.style.transform = `translateX(-${activeDealSlide * 100}%)`;
    }
  };

  const prevDealSlide = () => {
    if (dealsCarouselRef.current) {
      const totalSlides = Math.ceil((destination?.deals.length || 0) / 3);
      setActiveDealSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
      const inner = dealsCarouselRef.current.querySelector('.carousel-inner') as HTMLElement;
      if (inner) inner.style.transform = `translateX(-${activeDealSlide * 100}%)`;
    }
  };

  // Full width carousel scroll (horizontal)
  const scrollFullWidthCarousel = (direction: number) => {
    if (fullWidthCarouselRef.current) {
      const scrollAmount = direction * 370;
      fullWidthCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Destinations scroll (drag & wheel)
  const handleWheel = (e: React.WheelEvent) => {
    if (destScrollRef.current) {
      e.preventDefault();
      destScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!destination) return <div className="text-center py-20">Destination not found</div>;

  return (
    <div style={{ margin: 0, padding: 0, fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", backgroundColor: '#fcfcfc', color: '#333', overflowX: 'hidden' }}>
      
      {/* 1. Hero Section */}
      <header style={{ position: 'relative', height: '80vh', minHeight: '500px', backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${destination.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: '900px', padding: '20px' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>{destination.heroTitle}</h1>
          <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontWeight: 300, marginBottom: '30px', letterSpacing: '1px' }}>{destination.heroSubtitle}</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{ backgroundColor: '#c5a059', color: 'white', border: 'none', padding: '15px 35px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}>Explore Resorts</button>
            <button style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '15px 35px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}>Enquire Now</button>
          </div>
        </div>
      </header>

      {/* 2. Read More Section with Side Image */}
      <section style={{ maxWidth: '1000px', margin: '80px auto', padding: '0 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px', justifyContent: 'center' }}>
        <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
          <span style={{ color: '#c5a059', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '13px', fontWeight: 600 }}>The Experience</span>
          <h2 style={{ fontSize: '2.5rem', margin: '15px 0', fontWeight: 400, color: '#1a1a1a' }}>{destination.experienceTitle}</h2>
          <div id="text-container" style={{ color: '#666', fontSize: '1.05rem' }}>
            <p>{destination.experienceDescription}</p>
            {readMoreOpen && <p>{destination.readMoreText}</p>}
          </div>
          <button onClick={() => setReadMoreOpen(!readMoreOpen)} style={{ background: 'none', border: 'none', color: '#c5a059', fontWeight: 700, cursor: 'pointer', padding: 0, marginTop: '10px', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px' }}>
            {readMoreOpen ? 'Read Less' : 'Read More'}
          </button>
        </div>
        <div style={{ flex: '1 1 45%', minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
          <img src={destination.experienceImage} alt={destination.name} style={{ width: '100%', maxWidth: '450px', borderRadius: '8px', boxShadow: '20px 20px 0px #f0f0f0' }} />
        </div>
      </section>

      {/* 3. Deals Carousel (Bootstrap 5) – from destination.deals (legacy) */}
      {destination.deals && destination.deals.length > 0 && (
        <section className="bg-light py-5">
          <div className="container">
            <h2 className="text-center mb-5">Exclusive {destination.name} Deals</h2>
            <div id="dealsCarousel" className="carousel slide" data-bs-ride="carousel" ref={dealsCarouselRef}>
              <div className="carousel-inner">
                {Array.from({ length: Math.ceil(destination.deals.length / 3) }).map((_, slideIdx) => (
                  <div key={slideIdx} className={`carousel-item ${slideIdx === 0 ? 'active' : ''}`}>
                    <div className="row justify-content-center gx-3 gy-0">
                      {destination.deals.slice(slideIdx * 3, slideIdx * 3 + 3).map((deal, idx) => (
                        <div key={deal._id} className="col-12 col-md-3">
                          <div className="card h-100" style={{ width: '250px', height: '300px' }}>
                            <img src={deal.image} className="card-img-top" alt={deal.title} style={{ height: '180px', objectFit: 'cover' }} />
                            <div className="card-body p-2">
                              <h6 className="card-title mb-0">{deal.title}</h6>
                              {renderStars(deal.rating)}
                              <p className="text-danger fw-bold mb-0">from £{deal.price}</p>
                              <Link to={`/deal/${deal._id}`} className="text-decoration-none small">View More</Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#dealsCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon bg-dark rounded-circle" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#dealsCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon bg-dark rounded-circle" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* NEW: Destination-specific deals from backend (linked via destinationId) */}
      {destinationDeals.length > 0 && (
        <section className="bg-light py-5">
          <div className="container">
            <h2 className="text-center mb-5">Exclusive {destination.name} Deals</h2>
            <div className="row">
              {destinationDeals.map(deal => (
                <div key={deal._id} className="col-md-3 mb-4">
                  <div className="card h-100">
                    <img src={deal.images[0]} className="card-img-top" alt={deal.title} style={{ height: '180px', objectFit: 'cover' }} />
                    <div className="card-body">
                      <h5 className="card-title">{deal.title}</h5>
                      <p className="card-text">{formatCurrency(deal.discountedPrice)}</p>
                      <Link to={`/deal/${deal._id}`} className="btn btn-primary">View Deal</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Zig-Zag Content Cards (4 Cards) */}
      <section style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 20px' }}>
        {destination.zigzagCards.map((card, idx) => (
          <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px', marginBottom: '60px' }}>
            <div style={{ flex: 1, minWidth: '300px', order: card.order === 'right' ? 2 : 1 }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>{`0${idx + 1}. ${card.title}`}</h3>
              <p style={{ color: '#666' }}>{card.description}</p>
            </div>
            <div style={{ flex: 1, minWidth: '300px', order: card.order === 'right' ? 1 : 2 }}>
              <img src={card.image} style={{ width: '100%', borderRadius: '8px' }} alt={card.title} />
            </div>
          </div>
        ))}
      </section>

      {/* 5. Map Section */}
      {/* <section style={{ height: '450px', width: '100%', background: '#eee' }}>
        <iframe src={destination.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`${destination.name} map`}></iframe>
      </section> */}
      <section style={{ height: '450px', width: '100%', background: '#eee' }}>
        <DestinationMap placeName={destination.name} />
      </section>



      {/* 6. Weather Section */}
      <section style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#1a1a1a', marginBottom: '20px', fontWeight: 400 }}>{destination.weather.title}</h2>
        <p style={{ maxWidth: '900px', margin: '0 auto 50px auto', color: '#666', fontSize: '1.1rem', lineHeight: 1.8 }}>{destination.weather.description}</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {destination.weather.cards.map((card, idx) => (
            <div key={idx} style={{ flex: '1 1 250px', maxWidth: '280px', position: 'relative', overflow: 'hidden', borderRadius: '14px', minHeight: '360px', background: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${card.image})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', display: 'flex', alignItems: 'flex-end', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}>
              <div style={{ padding: '30px', textAlign: 'left' }}>
                <div style={{ fontSize: '12px', color: '#f4d08a', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, marginBottom: '10px' }}>{card.season}</div>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '1.4rem' }}>{card.heading}</h4>
                <div style={{ fontSize: '2.3rem', fontWeight: 300, marginBottom: '10px' }}>{card.temp}</div>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.6 }}>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FULL WIDTH CAROUSEL SECTION (other destinations) */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="background" />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <span className="text-white/70 uppercase tracking-[4px] text-sm">Luxury Escapes</span>
              <h2 className="text-4xl font-bold text-white mt-2">Trending Holiday Destinations</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={() => scrollFullWidthCarousel(-1)} className="w-12 h-12 rounded-full bg-white text-black font-bold text-xl hover:bg-gray-200 transition">←</button>
              <button onClick={() => scrollFullWidthCarousel(1)} className="w-12 h-12 rounded-full bg-white text-black font-bold text-xl hover:bg-gray-200 transition">→</button>
            </div>
          </div>
          <div className="overflow-hidden">
            <div ref={fullWidthCarouselRef} className="flex gap-6 overflow-x-auto scroll-smooth pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* Example cards – you can fetch other destinations here */}
              {['Croatia', 'Greece', 'Maldives', 'Dubai'].map((dest, idx) => (
                <div key={idx} className="min-w-[350px] w-[350px] bg-white rounded-3xl overflow-hidden shadow-xl flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1200" className="h-64 w-full object-cover" alt={dest} />
                  <div className="p-6">
                    <span className="text-xs uppercase tracking-[3px] text-blue-600 font-bold">Luxury Destination</span>
                    <h3 className="text-2xl font-bold mt-3">{dest}</h3>
                    <p className="text-gray-600 mt-4 leading-7">Discover unforgettable luxury experiences in {dest}.</p>
                    <div className="mt-6 flex justify-between items-center">
                      <div><span className="text-sm text-gray-500">7 nights from</span><div className="text-3xl font-black">£699</div><span className="text-sm text-gray-500">per person</span></div>
                      <Link to={`/destination/${dest.toLowerCase()}`} className="w-14 h-14 rounded-full bg-black text-white text-xl flex items-center justify-center hover:scale-110 transition">→</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DESTINATIONS SCROLL SECTION (other destinations) – static but can be made dynamic */}     
      <section style={{ padding: '110px 0', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1280px', margin: 'auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '30px', flexWrap: 'wrap', marginBottom: '50px' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#d97706' }}>Luxury Destinations</span>
              <h2 style={{ fontSize: '62px', lineHeight: 1.1, fontWeight: 700, color: '#0f172a', marginTop: '18px' }}>Destinations designed for your escape</h2>
              <p style={{ fontSize: '16px', lineHeight: 1.9, color: '#64748b', maxWidth: '700px', marginTop: '18px' }}>Discover hand-picked destinations crafted for unforgettable journeys — from serene escapes to vibrant city adventures.</p>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Link to="/destinations" className="text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-1">View All PlanMyLuxe Exclusives →</Link>
            </div>
          </div>
          <div ref={destScrollRef} onWheel={handleWheel} style={{ display: 'flex', gap: '20px', overflowX: 'auto', cursor: 'grab', scrollBehavior: 'smooth' }}>
            {['Santorini', 'Paris', 'Rome', 'Barcelona', 'Dubai', 'Maldives', 'Bali', 'New York'].map((city, idx) => (
              <div key={idx} className="destination-card" style={{ flex: '0 0 auto', display: 'flex', gap: '18px', background: 'white', padding: '18px', border: '1px solid #e2e8f0', alignItems: 'center', minWidth: '250px', maxWidth: '300px', borderRadius: '8px' }}>
                <img src="https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=800" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} alt={city} />
                <div><h3 style={{ fontSize: '18px', margin: 0 }}>{city}</h3><p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Luxury awaits</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Banner */}
      <section className="mt-24 relative rounded-3xl overflow-hidden h-[420px]">
        <img src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=2000" alt="Luxury Banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-3xl">
            <span className="uppercase tracking-[0.3em] text-amber-400 text-sm">Luxury Beyond Expectations</span>
            <h2 className="text-4xl md:text-6xl text-white mt-4 mb-6 font-bold">Escape Into Extraordinary Destinations</h2>
            <p className="text-gray-200 text-lg leading-relaxed mb-8">Discover immersive luxury experiences crafted for unforgettable memories and timeless journeys.</p>
            <button className="bg-white text-slate-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all font-medium">Discover More</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DestinationPage;