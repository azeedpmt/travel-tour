// // src/pages/user/Top20LuxuryHolidayDealsPage.tsx
// import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { dealService } from '../../services/dealService';
// import { formatCurrency } from '../../utils/format';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import Footer from '../../components/common/Footer';

// interface Deal {
//   _id: string;
//   title: string;
//   description: string;
//   hotelId: {
//     name: string;
//     city: string;
//     country: string;
//   };
//   originalPrice: number;
//   discountedPrice: number;
//   duration: number;
//   images: string[];
//   rating: number;
// }

// const Top20LuxuryHolidayDealsPage = () => {
//   const [deals, setDeals] = useState<Deal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [hotDeal, setHotDeal] = useState<Deal | null>(null);
//   const [trendingDeals, setTrendingDeals] = useState<Deal[]>([]);
//   const [zigZagDeals, setZigZagDeals] = useState<Deal[]>([]);
//   const [memberDeals, setMemberDeals] = useState<Deal[]>([]);

//   // Carousel refs
//   const trendingRef = useRef<HTMLDivElement>(null);
//   const memberRef = useRef<HTMLDivElement>(null);
//   const bannerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     fetchDeals();
//   }, []);

//   const fetchDeals = async () => {
//     setLoading(true);
//     try {
//       const response = await dealService.getAllDeals({
//         offerType: 'top-20-luxury-deals',
//         limit: 20,
//         page: 1,
//       });
//       if (response.success && response.data && response.data.length > 0) {
//         const allDeals = response.data;
//         setDeals(allDeals);
//         setHotDeal(allDeals[0]);
//         setTrendingDeals(allDeals.slice(1, 5));   // next 4 for carousel
//         setZigZagDeals(allDeals.slice(5, 9));     // next 4 for zig-zag
//         setMemberDeals(allDeals.slice(9, 12));    // next 3 for member exclusive
//       }
//     } catch (error) {
//       console.error('Failed to fetch luxury deals:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Horizontal scroll helpers
//   const scrollTrending = (direction: number) => {
//     if (trendingRef.current) {
//       const amount = direction * 324; // card width + gap
//       trendingRef.current.scrollBy({ left: amount, behavior: 'smooth' });
//     }
//   };

//   const scrollMember = (direction: number) => {
//     if (memberRef.current) {
//       const amount = direction * 370; // card width + gap
//       memberRef.current.scrollBy({ left: amount, behavior: 'smooth' });
//     }
//   };

//   // Banner auto-slide (static images – replace later with admin data)
//   const bannerImages = [
//     'https://images.unsplash.com/photo-1512100356956-c128783910e3?auto=format&fit=crop&q=80&w=1200',
//     'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200',
//     'https://images.unsplash.com/photo-1506929197327-0e3a5ec52003?auto=format&fit=crop&q=80&w=1200',
//     'https://images.unsplash.com/photo-1483683393433-7165a2299865?auto=format&fit=crop&q=80&w=1200',
//     'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
//     'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=1200',
//   ];

//   useEffect(() => {
//     if (!bannerRef.current) return;
//     let idx = 0;
//     const total = bannerImages.length;
//     const interval = setInterval(() => {
//       idx = (idx + 1) % total;
//       if (bannerRef.current) {
//         bannerRef.current.style.transform = `translateX(-${idx * 100}%)`;
//       }
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div className="bg-gray-50 font-sans text-gray-900" style={{ margin: 0, padding: 0 }}>
//       {/* Hero Section */}
//       <header
//         className="relative flex items-center justify-center overflow-hidden"
//         style={{
//           height: '60vh',
//           background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=2000') center/cover no-repeat`,
//         }}
//       >
//         <div className="text-center px-4">
//           <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
//             Top 20 Luxury Holiday Deals
//           </h1>
//           <p className="text-lg md:text-xl text-white opacity-90 max-w-2xl mx-auto font-light">
//             Handpicked five-star escapes for the discerning traveler.
//           </p>
//         </div>
//       </header>

//       {/* Hot Deal (first deal) – horizontal card */}
//       {hotDeal && (
//         <section className="max-w-7xl mx-auto px-4 py-12">
//           <div className="bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row items-stretch border border-gray-200">
//             <div className="md:w-1/2 h-80 md:h-auto">
//               <img
//                 src={hotDeal.images?.[0] || 'https://via.placeholder.com/1200x800?text=No+Image'}
//                 alt={hotDeal.title}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
//               <span className="text-orange-600 font-bold tracking-widest text-sm uppercase mb-2">
//                 Hot Deal: {hotDeal.hotelId?.country || 'GREECE'} - {hotDeal.hotelId?.city || 'CRETE'}
//               </span>
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">{hotDeal.title}</h2>
//               <p className="text-gray-600 mb-6 leading-relaxed">{hotDeal.description}</p>
//               <div className="flex items-end justify-between border-t pt-6">
//                 <div>
//                   <p className="text-sm text-gray-400">{hotDeal.duration} nights from</p>
//                   <p className="text-4xl font-black text-gray-900">
//                     {formatCurrency(hotDeal.discountedPrice)} <span className="text-lg font-normal text-gray-500">pp</span>
//                   </p>
//                 </div>
//                 <Link
//                   to={`/deal/${hotDeal._id}`}
//                   className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
//                 >
//                   Book Now
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Trending Escapes Carousel */}
//       {trendingDeals.length > 0 && (
//         <section className="bg-gray-100 py-16">
//           <div className="max-w-7xl mx-auto px-4">
//             <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-widest text-gray-400">
//               Latest Trending Escapes
//             </h2>
//             <div className="relative overflow-hidden group">
//               <div
//                 ref={trendingRef}
//                 className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
//                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//               >
//                 {trendingDeals.map((deal) => (
//                   <div key={deal._id} className="min-w-[300px] bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0">
//                     <img
//                       src={deal.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
//                       className="w-full h-48 object-cover"
//                       alt={deal.title}
//                     />
//                     <div className="p-4">
//                       <h3 className="font-bold">{deal.title}</h3>
//                       <p className="text-sm text-gray-500">From {formatCurrency(deal.discountedPrice)}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 onClick={() => scrollTrending(-1)}
//                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 ❮
//               </button>
//               <button
//                 onClick={() => scrollTrending(1)}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 ❯
//               </button>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Zig-Zag Section (4 cards, alternating image left/right) */}
//       {zigZagDeals.length >= 4 && (
//         <section className="max-w-7xl mx-auto px-4 py-20 space-y-16">
//           {zigZagDeals.map((deal, idx) => (
//             <div
//               key={deal._id}
//               className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${
//                 idx % 2 === 1 ? 'md:flex-row-reverse' : ''
//               }`}
//             >
//               <div className="md:w-1/2">
//                 <img
//                   src={deal.images?.[0] || 'https://via.placeholder.com/800x600?text=No+Image'}
//                   className="rounded-3xl w-full h-[400px] object-cover shadow-lg"
//                   alt={deal.title}
//                 />
//               </div>
//               <div className="md:w-1/2">
//                 <h3 className="text-3xl font-bold mb-4 italic">
//                   {String(idx + 1).padStart(2, '0')}. {deal.title}
//                 </h3>
//                 <p className="text-gray-600 mb-6">{deal.description}</p>
//                 <Link to={`/deal/${deal._id}`} className="text-black font-bold border-b-2 border-black pb-1">
//                   Discover More
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </section>
//       )}

//       {/* Dual Carousel Section */}
//       <section className="bg-gray-900 py-20">
//         <div className="max-w-7xl mx-auto px-4">
//           {/* Member Only Deals Carousel */}
//           {memberDeals.length > 0 && (
//             <div className="mb-20">
//               <h2 className="text-white text-3xl font-bold mb-8 text-center">Exclusive Member Only Deals</h2>
//               <div className="relative overflow-hidden group">
//                 <div
//                   ref={memberRef}
//                   className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
//                   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//                 >
//                   {memberDeals.map((deal) => (
//                     <div key={deal._id} className="min-w-[350px] bg-white p-2 rounded-2xl flex-shrink-0">
//                       <img
//                         src={deal.images?.[0] || 'https://via.placeholder.com/500x400?text=No+Image'}
//                         className="rounded-xl h-60 w-full object-cover"
//                         alt={deal.title}
//                       />
//                       <div className="p-4 text-gray-900">
//                         <span className="text-xs text-orange-500 font-bold uppercase">{deal.hotelId?.country}</span>
//                         <h4 className="text-xl font-bold">{deal.title}</h4>
//                         <p className="text-sm mt-2 font-bold">{formatCurrency(deal.discountedPrice)} pp</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   onClick={() => scrollMember(-1)}
//                   className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   ❮
//                 </button>
//                 <button
//                   onClick={() => scrollMember(1)}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   ❯
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* 6-Image Banner Slider (auto-play) */}
//           <div className="relative w-full overflow-hidden rounded-3xl" style={{ height: '400px' }}>
//             <div ref={bannerRef} className="flex transition-transform duration-700 h-full">
//               {bannerImages.map((img, i) => (
//                 <img key={i} src={img} className="min-w-full object-cover h-full" alt={`Banner ${i + 1}`} />
//               ))}
//             </div>
//             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
//               {bannerImages.map((_, i) => (
//                 <div key={i} className="w-3 h-3 bg-white/40 rounded-full"></div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default Top20LuxuryHolidayDealsPage;

// src/pages/user/Top20LuxuryHolidayDealsPage.tsx
// import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { dealService } from '../../services/dealService';
// import { formatCurrency } from '../../utils/format';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import Footer from '../../components/common/Footer';

// interface Deal {
//   _id: string;
//   title: string;
//   description: string;
//   hotelId: {
//     name: string;
//     city: string;
//     country: string;
//   };
//   originalPrice: number;
//   discountedPrice: number;
//   duration: number;
//   images: string[];
//   rating: number;
// }

// // Fallback demo content (so the page looks alive until admin adds real deals)
// const demoDeals: Deal[] = [
//   {
//     _id: 'demo1',
//     title: 'Swiss Alps Luxury',
//     description: 'Experience the pinnacle of alpine luxury with panoramic mountain views and world-class spa facilities in the heart of Zermatt.',
//     hotelId: { name: 'Alpine Resort', city: 'Zermatt', country: 'Switzerland' },
//     originalPrice: 2499,
//     discountedPrice: 1899,
//     duration: 7,
//     images: ['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'],
//     rating: 4.8,
//   },
//   {
//     _id: 'demo2',
//     title: 'Caribbean Blue',
//     description: 'Turquoise waters meet white sands in St. Lucia. A perfect blend of adventure and relaxation awaits you in this tropical paradise.',
//     hotelId: { name: 'St Lucia Resort', city: 'Castries', country: 'St Lucia' },
//     originalPrice: 2299,
//     discountedPrice: 1699,
//     duration: 7,
//     images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80'],
//     rating: 4.9,
//   },
//   {
//     _id: 'demo3',
//     title: 'Indian Heritage',
//     description: 'Stay in a converted palace in Rajasthan. Live like royalty while exploring the rich history and vibrant culture of the Pink City.',
//     hotelId: { name: 'Palace Hotel', city: 'Jaipur', country: 'India' },
//     originalPrice: 1999,
//     discountedPrice: 1499,
//     duration: 6,
//     images: ['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'],
//     rating: 4.7,
//   },
//   {
//     _id: 'demo4',
//     title: 'Vietnamese Tranquility',
//     description: 'A serene beachfront escape in Da Nang. Enjoy modern architecture paired with traditional Vietnamese wellness rituals.',
//     hotelId: { name: 'Beach Resort', city: 'Da Nang', country: 'Vietnam' },
//     originalPrice: 1799,
//     discountedPrice: 1299,
//     duration: 7,
//     images: ['https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'],
//     rating: 4.6,
//   },
//   {
//     _id: 'demo5',
//     title: 'Phuket Luxury Pool Villa',
//     description: 'Private pool villa with ocean views and butler service.',
//     hotelId: { name: 'Villa Retreat', city: 'Phuket', country: 'Thailand' },
//     originalPrice: 1899,
//     discountedPrice: 1499,
//     duration: 5,
//     images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=80'],
//     rating: 4.9,
//   },
// ];

// const Top20LuxuryHolidayDealsPage = () => {
//   const [deals, setDeals] = useState<Deal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [hotDeal, setHotDeal] = useState<Deal | null>(null);
//   const [trendingDeals, setTrendingDeals] = useState<Deal[]>([]);
//   const [zigZagDeals, setZigZagDeals] = useState<Deal[]>([]);
//   const [memberDeals, setMemberDeals] = useState<Deal[]>([]);

//   // Carousel refs
//   const trendingRef = useRef<HTMLDivElement>(null);
//   const memberRef = useRef<HTMLDivElement>(null);
//   const bannerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     fetchDeals();
//   }, []);

//   const fetchDeals = async () => {
//     setLoading(true);
//     try {
//       const response = await dealService.getAllDeals({
//         offerType: 'top-20-luxury-deals',
//         limit: 20,
//         page: 1,
//       });
//       if (response.success && response.data && response.data.length > 0) {
//         const allDeals = response.data;
//         setDeals(allDeals);
//         setHotDeal(allDeals[0]);
//         setTrendingDeals(allDeals.slice(1, 5));
//         setZigZagDeals(allDeals.slice(5, 9));
//         setMemberDeals(allDeals.slice(9, 12));
//       } else {
//         // Use demo data so page never looks broken
//         setDeals(demoDeals);
//         setHotDeal(demoDeals[0]);
//         setTrendingDeals(demoDeals.slice(1, 5));
//         setZigZagDeals(demoDeals.slice(5, 9));
//         setMemberDeals(demoDeals.slice(9, 12));
//       }
//     } catch (error) {
//       console.error('Failed to fetch luxury deals, using demo data:', error);
//       setDeals(demoDeals);
//       setHotDeal(demoDeals[0]);
//       setTrendingDeals(demoDeals.slice(1, 5));
//       setZigZagDeals(demoDeals.slice(5, 9));
//       setMemberDeals(demoDeals.slice(9, 12));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Horizontal scroll helpers
//   const scrollTrending = (direction: number) => {
//     if (trendingRef.current) {
//       const amount = direction * 324;
//       trendingRef.current.scrollBy({ left: amount, behavior: 'smooth' });
//     }
//   };

//   const scrollMember = (direction: number) => {
//     if (memberRef.current) {
//       const amount = direction * 370;
//       memberRef.current.scrollBy({ left: amount, behavior: 'smooth' });
//     }
//   };

//   // Banner images (static – replace later with admin data)
//   const bannerImages = [
//     'https://images.unsplash.com/photo-1512100356956-c128783910e3?auto=format&fit=crop&q=80&w=1200',
//     'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200',
//     'https://images.unsplash.com/photo-1506929197327-0e3a5ec52003?auto=format&fit=crop&q=80&w=1200',
//     'https://images.unsplash.com/photo-1483683393433-7165a2299865?auto=format&fit=crop&q=80&w=1200',
//     'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
//     'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=1200',
//   ];

//   useEffect(() => {
//     if (!bannerRef.current) return;
//     let idx = 0;
//     const total = bannerImages.length;
//     const interval = setInterval(() => {
//       idx = (idx + 1) % total;
//       if (bannerRef.current) {
//         bannerRef.current.style.transform = `translateX(-${idx * 100}%)`;
//       }
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div className="bg-gray-50 font-sans text-gray-900" style={{ margin: 0, padding: 0 }}>
//       {/* Hero Section */}
//       <header
//         className="relative flex items-center justify-center overflow-hidden"
//         style={{
//           height: '60vh',
//           background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=2000') center/cover no-repeat`,
//         }}
//       >
//         <div className="text-center px-4">
//           <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
//             Top 20 Luxury Holiday Deals
//           </h1>
//           <p className="text-lg md:text-xl text-white opacity-90 max-w-2xl mx-auto font-light">
//             Handpicked five-star escapes for the discerning traveler.
//           </p>
//         </div>
//       </header>

//       {/* Hot Deal (first deal) – horizontal card */}
//       {hotDeal && (
//         <section className="max-w-7xl mx-auto px-4 py-12">
//           <div className="bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row items-stretch border border-gray-200">
//             <div className="md:w-1/2 h-80 md:h-auto">
//               <img
//                 src={hotDeal.images?.[0] || 'https://via.placeholder.com/1200x800?text=No+Image'}
//                 alt={hotDeal.title}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
//               <span className="text-orange-600 font-bold tracking-widest text-sm uppercase mb-2">
//                 Hot Deal: {hotDeal.hotelId?.country || 'GREECE'} - {hotDeal.hotelId?.city || 'CRETE'}
//               </span>
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">{hotDeal.title}</h2>
//               <p className="text-gray-600 mb-6 leading-relaxed">{hotDeal.description}</p>
//               <div className="flex items-end justify-between border-t pt-6">
//                 <div>
//                   <p className="text-sm text-gray-400">{hotDeal.duration} nights from</p>
//                   <p className="text-4xl font-black text-gray-900">
//                     {formatCurrency(hotDeal.discountedPrice)} <span className="text-lg font-normal text-gray-500">pp</span>
//                   </p>
//                 </div>
//                 <Link
//                   to={`/deal/${hotDeal._id}`}
//                   className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
//                 >
//                   Book Now
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Trending Escapes Carousel */}
//       <section className="bg-gray-100 py-16">
//         <div className="max-w-7xl mx-auto px-4">
//           <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-widest text-gray-400">
//             Latest Trending Escapes
//           </h2>
//           <div className="relative overflow-hidden group">
//             <div
//               ref={trendingRef}
//               className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
//               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//             >
//               {trendingDeals.map((deal) => (
//                 <div key={deal._id} className="min-w-[300px] bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0">
//                   <img
//                     src={deal.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
//                     className="w-full h-48 object-cover"
//                     alt={deal.title}
//                   />
//                   <div className="p-4">
//                     <h3 className="font-bold">{deal.title}</h3>
//                     <p className="text-sm text-gray-500">From {formatCurrency(deal.discountedPrice)}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <button
//               onClick={() => scrollTrending(-1)}
//               className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
//             >
//               ❮
//             </button>
//             <button
//               onClick={() => scrollTrending(1)}
//               className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
//             >
//               ❯
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Zig-Zag Section (4 cards, alternating image left/right) */}
//       {zigZagDeals.length >= 4 && (
//         <section className="max-w-7xl mx-auto px-4 py-20 space-y-16">
//           {zigZagDeals.map((deal, idx) => (
//             <div
//               key={deal._id}
//               className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${
//                 idx % 2 === 1 ? 'md:flex-row-reverse' : ''
//               }`}
//             >
//               <div className="md:w-1/2">
//                 <img
//                   src={deal.images?.[0] || 'https://via.placeholder.com/800x600?text=No+Image'}
//                   className="rounded-3xl w-full h-[400px] object-cover shadow-lg"
//                   alt={deal.title}
//                 />
//               </div>
//               <div className="md:w-1/2">
//                 <h3 className="text-3xl font-bold mb-4 italic">
//                   {String(idx + 1).padStart(2, '0')}. {deal.title}
//                 </h3>
//                 <p className="text-gray-600 mb-6">{deal.description}</p>
//                 <Link to={`/deal/${deal._id}`} className="text-black font-bold border-b-2 border-black pb-1">
//                   Discover More
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </section>
//       )}

//       {/* Dual Carousel Section */}
//       <section className="bg-gray-900 py-20">
//         <div className="max-w-7xl mx-auto px-4">
//           {/* Member Only Deals Carousel */}
//           <div className="mb-20">
//             <h2 className="text-white text-3xl font-bold mb-8 text-center">Exclusive Member Only Deals</h2>
//             <div className="relative overflow-hidden group">
//               <div
//                 ref={memberRef}
//                 className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
//                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//               >
//                 {memberDeals.map((deal) => (
//                   <div key={deal._id} className="min-w-[350px] bg-white p-2 rounded-2xl flex-shrink-0">
//                     <img
//                       src={deal.images?.[0] || 'https://via.placeholder.com/500x400?text=No+Image'}
//                       className="rounded-xl h-60 w-full object-cover"
//                       alt={deal.title}
//                     />
//                     <div className="p-4 text-gray-900">
//                       <span className="text-xs text-orange-500 font-bold uppercase">{deal.hotelId?.country}</span>
//                       <h4 className="text-xl font-bold">{deal.title}</h4>
//                       <p className="text-sm mt-2 font-bold">{formatCurrency(deal.discountedPrice)} pp</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 onClick={() => scrollMember(-1)}
//                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 ❮
//               </button>
//               <button
//                 onClick={() => scrollMember(1)}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 ❯
//               </button>
//             </div>
//           </div>

//           {/* 6-Image Banner Slider (auto-play) – always visible */}
//           <div className="relative w-full overflow-hidden rounded-3xl" style={{ height: '400px' }}>
//             <div ref={bannerRef} className="flex transition-transform duration-700 h-full">
//               {bannerImages.map((img, i) => (
//                 <img key={i} src={img} className="min-w-full object-cover h-full" alt={`Banner ${i + 1}`} />
//               ))}
//             </div>
//             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
//               {bannerImages.map((_, i) => (
//                 <div key={i} className="w-3 h-3 bg-white/40 rounded-full"></div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default Top20LuxuryHolidayDealsPage;


// src/pages/user/Top20LuxuryHolidayDealsPage.tsx
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

// Fallback demo content (so the page looks alive until admin adds real deals)
const demoDeals: Deal[] = [
  {
    _id: 'demo1',
    title: 'Swiss Alps Luxury',
    description: 'Experience the pinnacle of alpine luxury with panoramic mountain views and world-class spa facilities in the heart of Zermatt.',
    hotelId: { name: 'Alpine Resort', city: 'Zermatt', country: 'Switzerland' },
    originalPrice: 2499,
    discountedPrice: 1899,
    duration: 7,
    images: ['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'],
    rating: 4.8,
  },
  {
    _id: 'demo2',
    title: 'Caribbean Blue',
    description: 'Turquoise waters meet white sands in St. Lucia. A perfect blend of adventure and relaxation awaits you in this tropical paradise.',
    hotelId: { name: 'St Lucia Resort', city: 'Castries', country: 'St Lucia' },
    originalPrice: 2299,
    discountedPrice: 1699,
    duration: 7,
    images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80'],
    rating: 4.9,
  },
  {
    _id: 'demo3',
    title: 'Indian Heritage',
    description: 'Stay in a converted palace in Rajasthan. Live like royalty while exploring the rich history and vibrant culture of the Pink City.',
    hotelId: { name: 'Palace Hotel', city: 'Jaipur', country: 'India' },
    originalPrice: 1999,
    discountedPrice: 1499,
    duration: 6,
    images: ['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'],
    rating: 4.7,
  },
  {
    _id: 'demo4',
    title: 'Vietnamese Tranquility',
    description: 'A serene beachfront escape in Da Nang. Enjoy modern architecture paired with traditional Vietnamese wellness rituals.',
    hotelId: { name: 'Beach Resort', city: 'Da Nang', country: 'Vietnam' },
    originalPrice: 1799,
    discountedPrice: 1299,
    duration: 7,
    images: ['https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'],
    rating: 4.6,
  },
  {
    _id: 'demo5',
    title: 'Phuket Luxury Pool Villa',
    description: 'Private pool villa with ocean views and butler service.',
    hotelId: { name: 'Villa Retreat', city: 'Phuket', country: 'Thailand' },
    originalPrice: 1899,
    discountedPrice: 1499,
    duration: 5,
    images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=80'],
    rating: 4.9,
  },
];

const Top20LuxuryHolidayDealsPage = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [hotDeal, setHotDeal] = useState<Deal | null>(null);
  const [trendingDeals, setTrendingDeals] = useState<Deal[]>([]);
  const [zigZagDeals, setZigZagDeals] = useState<Deal[]>([]);
  const [memberDeals, setMemberDeals] = useState<Deal[]>([]);

  // Carousel refs
  const trendingRef = useRef<HTMLDivElement>(null);
  const memberRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const response = await dealService.getAllDeals({
        offerType: 'top-20-luxury-deals',
        limit: 20,
        page: 1,
      });
      if (response.success && response.data && response.data.length > 0) {
        const allDeals = response.data;
        setDeals(allDeals);
        setHotDeal(allDeals[0]);
        setTrendingDeals(allDeals.slice(1, 5));
        setZigZagDeals(allDeals.slice(5, 9));
        setMemberDeals(allDeals.slice(9, 12));
      } else {
        // Use demo data so page never looks broken
        setDeals(demoDeals);
        setHotDeal(demoDeals[0]);
        setTrendingDeals(demoDeals.slice(1, 5));
        setZigZagDeals(demoDeals.slice(5, 9));
        setMemberDeals(demoDeals.slice(9, 12));
      }
    } catch (error) {
      console.error('Failed to fetch luxury deals, using demo data:', error);
      setDeals(demoDeals);
      setHotDeal(demoDeals[0]);
      setTrendingDeals(demoDeals.slice(1, 5));
      setZigZagDeals(demoDeals.slice(5, 9));
      setMemberDeals(demoDeals.slice(9, 12));
    } finally {
      setLoading(false);
    }
  };

  // Horizontal scroll helpers
  const scrollTrending = (direction: number) => {
    if (trendingRef.current) {
      const amount = direction * 324;
      trendingRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const scrollMember = (direction: number) => {
    if (memberRef.current) {
      const amount = direction * 370;
      memberRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Banner images (static – replace later with admin data)
  const bannerImages = [
    'https://images.unsplash.com/photo-1512100356956-c128783910e3?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1506929197327-0e3a5ec52003?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1483683393433-7165a2299865?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=1200',
  ];

  // Banner dots state
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    if (!bannerRef.current) return;
    let idx = 0;
    const total = bannerImages.length;
    const interval = setInterval(() => {
      idx = (idx + 1) % total;
      setActiveBannerIndex(idx);
      if (bannerRef.current) {
        bannerRef.current.style.transform = `translateX(-${idx * 100}%)`;
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-gray-50 font-sans text-gray-900" style={{ margin: 0, padding: 0 }}>
      {/* Hero Section */}
      <header
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: '60vh',
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=2000') center/cover no-repeat`,
        }}
      >
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Top 20 Luxury Holiday Deals
          </h1>
          <p className="text-lg md:text-xl text-white opacity-90 max-w-2xl mx-auto font-light">
            Handpicked five-star escapes for the discerning traveler.
          </p>
        </div>
      </header>

      {/* Hot Deal (first deal) – horizontal card */}
      {hotDeal && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row items-stretch border border-gray-200">
            <div className="md:w-1/2 h-80 md:h-auto">
              <img
                src={hotDeal.images?.[0] || 'https://via.placeholder.com/1200x800?text=No+Image'}
                alt={hotDeal.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <span className="text-orange-600 font-bold tracking-widest text-sm uppercase mb-2">
                Hot Deal: {hotDeal.hotelId?.country || 'GREECE'} - {hotDeal.hotelId?.city || 'CRETE'}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{hotDeal.title}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{hotDeal.description}</p>
              <div className="flex items-end justify-between border-t pt-6">
                <div>
                  <p className="text-sm text-gray-400">{hotDeal.duration} nights from</p>
                  <p className="text-4xl font-black text-gray-900">
                    {formatCurrency(hotDeal.discountedPrice)} <span className="text-lg font-normal text-gray-500">pp</span>
                  </p>
                </div>
                <Link
                  to={`/deal/${hotDeal._id}`}
                  className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trending Escapes Carousel – arrows always visible */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-widest text-gray-400">
            Latest Trending Escapes
          </h2>
          <div className="relative">
            <div
              ref={trendingRef}
              className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {trendingDeals.map((deal) => (
                <div key={deal._id} className="min-w-[300px] bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0">
                  <img
                    src={deal.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    className="w-full h-48 object-cover"
                    alt={deal.title}
                  />
                  <div className="p-4">
                    <h3 className="font-bold">{deal.title}</h3>
                    <p className="text-sm text-gray-500">From {formatCurrency(deal.discountedPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => scrollTrending(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg transition-opacity"
            >
              ❮
            </button>
            <button
              onClick={() => scrollTrending(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg transition-opacity"
            >
              ❯
            </button>
          </div>
        </div>
      </section>

      {/* Zig-Zag Section (4 cards, alternating image left/right) */}
      {zigZagDeals.length >= 4 && (
        <section className="max-w-7xl mx-auto px-4 py-20 space-y-16">
          {zigZagDeals.map((deal, idx) => (
            <div
              key={deal._id}
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${
                idx % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="md:w-1/2">
                <img
                  src={deal.images?.[0] || 'https://via.placeholder.com/800x600?text=No+Image'}
                  className="rounded-3xl w-full h-[400px] object-cover shadow-lg"
                  alt={deal.title}
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-3xl font-bold mb-4 italic">
                  {String(idx + 1).padStart(2, '0')}. {deal.title}
                </h3>
                <p className="text-gray-600 mb-6">{deal.description}</p>
                <Link to={`/deal/${deal._id}`} className="text-black font-bold border-b-2 border-black pb-1">
                  Discover More
                </Link>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Dual Carousel Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Member Only Deals Carousel – arrows always visible */}
          <div className="mb-20">
            <h2 className="text-white text-3xl font-bold mb-8 text-center">Exclusive Member Only Deals</h2>
            <div className="relative">
              <div
                ref={memberRef}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {memberDeals.map((deal) => (
                  <div key={deal._id} className="min-w-[350px] bg-white p-2 rounded-2xl flex-shrink-0">
                    <img
                      src={deal.images?.[0] || 'https://via.placeholder.com/500x400?text=No+Image'}
                      className="rounded-xl h-60 w-full object-cover"
                      alt={deal.title}
                    />
                    <div className="p-4 text-gray-900">
                      <span className="text-xs text-orange-500 font-bold uppercase">{deal.hotelId?.country}</span>
                      <h4 className="text-xl font-bold">{deal.title}</h4>
                      <p className="text-sm mt-2 font-bold">{formatCurrency(deal.discountedPrice)} pp</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => scrollMember(-1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg transition-opacity"
              >
                ❮
              </button>
              <button
                onClick={() => scrollMember(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg transition-opacity"
              >
                ❯
              </button>
            </div>
          </div>

          {/* 6-Image Banner Slider (auto-play) – with active dots */}
          <div className="relative w-full overflow-hidden rounded-3xl" style={{ height: '400px' }}>
            <div ref={bannerRef} className="flex transition-transform duration-700 h-full">
              {bannerImages.map((img, i) => (
                <img key={i} src={img} className="min-w-full object-cover h-full" alt={`Banner ${i + 1}`} />
              ))}
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {bannerImages.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === activeBannerIndex ? 'bg-white scale-125' : 'bg-white/40'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Top20LuxuryHolidayDealsPage;