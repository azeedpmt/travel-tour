// // src/pages/user/OfferPage.tsx
// import { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { dealService } from '../../services/dealService';
// import { formatCurrency } from '../../utils/format';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import Footer from '../../components/common/Footer';

// // Define the shape of a deal (extended from existing Deal type)
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
//   startDate: string;
//   endDate: string;
//   rating: number;
//   includes?: string[];
//   excludes?: string[];
// }

// const OfferPage = () => {
//   const { slug } = useParams<{ slug: string }>();
//   const [deals, setDeals] = useState<Deal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [pageTitle, setPageTitle] = useState('');
//   const [pageDescription, setPageDescription] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
// const [totalPages, setTotalPages] = useState(1);


//   // Map slug to display title & description (temporary – will come from backend later)
//   useEffect(() => {
//     const titles: Record<string, { title: string; description: string }> = {
//       'trending-top-deals': {
//         title: 'Top 20 Trending Luxury Holiday Deals',
//         description: 'Exclusive 2026 & 2027 handpicked luxury escapes curated by our travel experts.',
//       },
//       'last-minute-bargains': {
//         title: 'Last‑Minute Luxury Bargains',
//         description: 'Spontaneous escapes at exceptional value – limited availability.',
//       },
//       'trending-multi-centres': {
//         title: 'Trending Multi‑Centre Holidays',
//         description: 'Combine two or more destinations in one seamless luxury journey.',
//       },
//       'summer-2026-early-deals': {
//         title: 'Summer 2026 – Early Deals',
//         description: 'Secure your summer escape with exclusive early booking offers.',
//       },
//       '5-star-luxury-for-less': {
//         title: '5‑Star Luxury – For Less',
//         description: 'Experience world‑class hotels and resorts at unbeatable prices.',
//       },
//       'mitsis-hotel-group': {
//         title: 'Mitsis Hotel Group Offers',
//         description: 'Premium all‑inclusive resorts in Greece and beyond.',
//       },
//     };
//     const data = titles[slug || ''] || {
//       title: 'Exclusive Deals',
//       description: 'Hand‑picked offers featuring exclusive upgrades and complimentary inclusions.',
//     };
//     setPageTitle(data.title);
//     setPageDescription(data.description);
//   }, [slug]);

//   // Fetch deals that belong to this offer type
//   // TODO: Replace with actual API call when backend is ready
//   useEffect(() => {
//     const fetchDeals = async () => {
//       setLoading(true);
//       try {
//         // Temporary: fetch all deals and filter by a mock property.
//         // In reality, the backend should accept an 'offerType' parameter.
//         const response = await dealService.getAllDeals({ limit: 20 });
//         if (response.success && response.data) {
//           // For now, just take the first 6 deals as demo.
//           // Later we will filter by response.data.filter(deal => deal.offerType === slug)
//           setDeals(response.data.slice(0, 6));
//         } else {
//           setDeals([]);
//         }
//       } catch (error) {
//         console.error('Failed to fetch deals:', error);
//         setDeals([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDeals();
//   }, [slug]);
//   const fetchDeals = async (pageNum = 1) => {
//     setLoading(true);
//     try {
//         const response = await dealService.getAllDeals({
//             offerType: slug,
//             limit: 6,
//             page: pageNum
//         });
//         if (response.success) {
//             setDeals(response.data);
//             setTotalPages(response.totalPages);
//             setCurrentPage(response.page);
//         } else {
//             setDeals([]);
//         }
//     } catch (error) {
//         console.error('Failed to fetch deals:', error);
//         setDeals([]);
//     } finally {
//         setLoading(false);
//     }
// };

// useEffect(() => {
//     fetchDeals(1);
// }, [slug]);

// const loadMore = () => {
//     if (currentPage < totalPages) {
//         fetchDeals(currentPage + 1);
//     }
// };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div className="bg-[#f2f4f7] text-[#1a1a1a] font-sans">
//       {/* Hero Banner */}
//       <section
//         className="relative w-full flex items-center justify-center text-center overflow-hidden"
//         style={{
//           height: '450px',
//           backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80')`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       >
//         <div className="relative z-10 max-w-4xl px-4 text-white">
//           <div className="font-bold text-lg tracking-[0.3em] uppercase mb-4 opacity-90 font-serif">
//             PLANMYLUXE
//           </div>
//           <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ textShadow: '0px 4px 12px rgba(0,0,0,0.4)' }}>
//             {pageTitle}
//           </h1>
//           <p className="text-lg md:text-xl font-light opacity-95 max-w-2xl mx-auto mb-8">
//             {pageDescription}
//           </p>
//           <div className="flex flex-wrap justify-center gap-4">
//             <span className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">
//               ATOL Protected
//             </span>
//             <span className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">
//               Award Winning Service
//             </span>
//           </div>
//         </div>
//       </section>

//       {/* Main Content */}
//       <main className="max-w-[1000px] mx-auto px-4 py-16">
//         {/* Section Title */}
//         <div className="mb-12 border-l-4 border-[#002b5b] pl-6">
//           <h2 className="text-2xl font-bold text-[#002b5b] uppercase tracking-tight mb-1">
//             Our Trending Selection
//           </h2>
//           <p className="text-gray-500 text-sm">
//             Hand-picked offers featuring exclusive upgrades and complimentary inclusions.
//           </p>
//         </div>

//         {/* Deals List */}
//         <div className="flex flex-col gap-10">
//           {deals.map((deal) => (
//             <div
//               key={deal._id}
//               className="bg-white rounded-[24px] overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-xl transition-all duration-500 group border border-[#eef0f2]"
//             >
//               {/* Image Section */}
//               <div className="relative w-full md:w-[42%] overflow-hidden min-h-[320px]">
//                 <img
//                   src={deal.images?.[0] || 'https://via.placeholder.com/800x500?text=No+Image'}
//                   alt={deal.title}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                 />
//                 <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
//                   <span className="text-yellow-500 text-[10px] tracking-widest">
//                     {'★'.repeat(Math.floor(deal.rating || 0))}
//                     {'☆'.repeat(5 - Math.floor(deal.rating || 0))}
//                   </span>
//                 </div>
//                 {deal.includes && deal.includes.length > 0 && (
//                   <div className="absolute bottom-8 right-0 bg-white px-5 py-2.5 flex items-center gap-3 rounded-l-full shadow-lg border-l-4 border-blue-600">
//                     <div className="bg-blue-50 p-1.5 rounded-full">
//                       <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                       </svg>
//                     </div>
//                     <span className="text-[10px] font-black uppercase text-[#002b5b] tracking-wider">
//                       {deal.includes[0]}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Content Section */}
//               <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
//                 <div>
//                   <div className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
//                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                     {deal.hotelId?.city}, {deal.hotelId?.country}
//                   </div>
//                   <h3 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-5 leading-tight group-hover:text-[#002b5b] transition-colors">
//                     {deal.title}
//                   </h3>

//                   <div className="flex flex-wrap gap-4 mb-8">
//                     <div className="flex items-center gap-2 bg-[#f8fafc] px-4 py-2 rounded-xl border border-gray-100">
//                       <span className="text-lg">🕒</span>
//                       <span className="text-xs font-bold text-gray-600">{deal.duration} Nights</span>
//                     </div>
//                     <div className="flex items-center gap-2 bg-[#f8fafc] px-4 py-2 rounded-xl border border-gray-100">
//                       <span className="text-lg">🍽</span>
//                       <span className="text-xs font-bold text-gray-600">Half Board</span>
//                     </div>
//                   </div>
//                   <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-lg">{deal.description}</p>
//                 </div>

//                 {/* Bottom Price Row */}
//                 <div className="flex items-end justify-between border-t pt-8 border-[#f1f5f9]">
//                   <div>
//                     <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-widest mb-1">
//                       Package Total From
//                     </span>
//                     <div className="flex items-baseline gap-1.5">
//                       <span className="text-3xl font-black text-[#002b5b]">
//                         {formatCurrency(deal.discountedPrice)}
//                       </span>
//                       <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
//                         per person
//                       </span>
//                     </div>
//                   </div>
//                   <Link
//                     to={`/deal/${deal._id}`}
//                     className="bg-[#002b5b] text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.15em] hover:bg-[#001f41] transition-all shadow-md"
//                   >
//                     View Deal
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Load More Button */}
//         {currentPage < totalPages && (
//     <div className="mt-16 text-center">
//         <button
//             onClick={loadMore}
//             className="bg-white border-2 border-[#002b5b] text-[#002b5b] hover:bg-[#002b5b] hover:text-white px-12 py-5 rounded-full text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-md"
//         >
//             Load More 2026/2027 Deals
//         </button>
//     </div>
// )}
//       </main>

//       {/* Bottom Banner (same as HTML) */}
//       <section
//         className="relative w-full flex items-center justify-center text-center overflow-hidden"
//         style={{
//           height: '480px',
//           backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80')`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//         }}
//       >
//         <div className="relative z-10 max-w-4xl px-4 text-white">
//           <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight">
//             Ready for your next luxury escape?
//           </h2>
//           <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto mb-10">
//             Don't miss out on these exclusive 2026 & 2027 handpicked deals. Our experts are standing by to curate your perfect journey.
//           </p>
//           <div className="flex flex-wrap justify-center gap-6 mb-8">
//             <span className="bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
//               ATOL Protected
//             </span>
//             <span className="bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
//               Award Winning Service
//             </span>
//           </div>
//           <button className="bg-white text-[#002b5b] px-12 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-gray-100 transition-all shadow-xl">
//             Enquire Now
//           </button>
//         </div>
//       </section>

//       {/* Trust Bar (Holidays you can trust) */}
//       <section className="bg-white py-16 border-t border-b border-gray-100">
//         <div className="max-w-[1100px] mx-auto px-6">
//           <h3 className="text-center text-2xl md:text-3xl font-bold text-[#002b5b] mb-12 uppercase tracking-tight">
//             Holidays you can trust
//           </h3>
//           <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-10">
//             {/* Trust Item 1 */}
//             <div className="flex flex-col items-center text-center group">
//               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#002b5b] transition-colors duration-300">
//                 <svg className="w-7 h-7 text-[#002b5b] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <p className="text-[13px] font-bold text-[#1a1a1a] leading-snug">Low deposits for as little as £29 per person</p>
//             </div>
//             {/* Trust Item 2 */}
//             <div className="flex flex-col items-center text-center group">
//               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#002b5b] transition-colors duration-300">
//                 <svg className="w-7 h-7 text-[#002b5b] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//               </div>
//               <p className="text-[13px] font-bold text-[#1a1a1a] leading-snug">Helpful spread the cost payment options</p>
//             </div>
//             {/* Trust Item 3 */}
//             <div className="flex flex-col items-center text-center group">
//               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#002b5b] transition-colors duration-300">
//                 <svg className="w-7 h-7 text-[#002b5b] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
//                 </svg>
//               </div>
//               <p className="text-[13px] font-bold text-[#1a1a1a] leading-snug">Our 24/7 support service - always here for you</p>
//             </div>
//             {/* Trust Item 4 */}
//             <div className="flex flex-col items-center text-center group">
//               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#002b5b] transition-colors duration-300">
//                 <svg className="w-7 h-7 text-[#002b5b] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//                 </svg>
//               </div>
//               <p className="text-[13px] font-bold text-[#1a1a1a] leading-snug">Price match any product against other retailers</p>
//             </div>
//             {/* Trust Item 5 */}
//             <div className="flex flex-col items-center text-center group">
//               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#002b5b] transition-colors duration-300">
//                 <svg className="w-7 h-7 text-[#002b5b] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                 </svg>
//               </div>
//               <p className="text-[13px] font-bold text-[#1a1a1a] leading-snug">Peace of mind with fully bonded holidays</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Use global Footer component */}
//       <Footer />
//     </div>
//   );
// };

// export default OfferPage;
// src/pages/user/OfferPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  startDate: string;
  endDate: string;
  rating: number;
  includes?: string[];
  excludes?: string[];
}

interface OfferTypeData {
  name: string;
  slug: string;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  description: string;
}

const OfferPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeData, setTypeData] = useState<OfferTypeData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. Fetch offer type metadata from backend
  useEffect(() => {
    const fetchTypeData = async () => {
      try {
        const res = await fetch(`/api/public/offer-types/slug/${slug}`);
        const data = await res.json();
        if (data.success) {
          setTypeData(data.data);
        } else {
          // Fallback static titles (keep as fallback)
          const titles: Record<string, { title: string; description: string }> = {
            'trending-top-deals': {
              title: 'Top 20 Trending Luxury Holiday Deals',
              description: 'Exclusive 2026 & 2027 handpicked luxury escapes curated by our travel experts.',
            },
            'last-minute-bargains': {
              title: 'Last‑Minute Luxury Bargains',
              description: 'Spontaneous escapes at exceptional value – limited availability.',
            },
            // ... other static fallbacks as before
          };
          const fallback = titles[slug || ''] || {
            title: 'Exclusive Deals',
            description: 'Hand‑picked offers featuring exclusive upgrades and complimentary inclusions.',
          };
          setTypeData({
            name: slug || '',
            slug: slug || '',
            heroImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80',
            heroTitle: fallback.title,
            heroSubtitle: fallback.description,
            description: fallback.description,
          });
        }
      } catch (error) {
        console.error('Failed to fetch offer type:', error);
      }
    };
    if (slug) fetchTypeData();
  }, [slug]);

  // 2. Fetch deals with offerType filter and pagination
  const fetchDeals = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await dealService.getAllDeals({
        offerType: slug,
        limit: 6,
        page: pageNum,
      });
      if (response.success) {
        setDeals(response.data);
        setTotalPages(response.totalPages);
        setCurrentPage(response.page);
      } else {
        setDeals([]);
      }
    } catch (error) {
      console.error('Failed to fetch deals:', error);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchDeals(1);
  }, [slug]);

  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchDeals(currentPage + 1);
    }
  };

  if (loading && !typeData) return <LoadingSpinner />;

  const heroImage = typeData?.heroImage || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80';
  const heroTitle = typeData?.heroTitle || 'Exclusive Deals';
  const heroSubtitle = typeData?.heroSubtitle || 'Hand‑picked offers featuring exclusive upgrades and complimentary inclusions.';

  return (
    <div className="bg-[#f2f4f7] text-[#1a1a1a] font-sans">
      {/* Hero Banner – now dynamic from backend */}
      <section
        className="relative w-full flex items-center justify-center text-center overflow-hidden"
        style={{
          height: '450px',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('${heroImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-4xl px-4 text-white">
          <div className="font-bold text-lg tracking-[0.3em] uppercase mb-4 opacity-90 font-serif">
            PLANMYLUXE
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ textShadow: '0px 4px 12px rgba(0,0,0,0.4)' }}>
            {heroTitle}
          </h1>
          <p className="text-lg md:text-xl font-light opacity-95 max-w-2xl mx-auto mb-8">
            {heroSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">
              ATOL Protected
            </span>
            <span className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">
              Award Winning Service
            </span>
          </div>
        </div>
      </section>

      {/* Main Content – deals list (unchanged) */}
      <main className="max-w-[1000px] mx-auto px-4 py-16">
        <div className="mb-12 border-l-4 border-[#002b5b] pl-6">
          <h2 className="text-2xl font-bold text-[#002b5b] uppercase tracking-tight mb-1">
            Our Trending Selection
          </h2>
          <p className="text-gray-500 text-sm">
            Hand-picked offers featuring exclusive upgrades and complimentary inclusions.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {deals.map((deal) => (
            // ... deal card JSX unchanged (exactly as in the original)
            <div
              key={deal._id}
              className="bg-white rounded-[24px] overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-xl transition-all duration-500 group border border-[#eef0f2]"
            >
              {/* Image Section */}
              <div className="relative w-full md:w-[42%] overflow-hidden min-h-[320px]">
                <img
                  src={deal.images?.[0] || 'https://via.placeholder.com/800x500?text=No+Image'}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                  <span className="text-yellow-500 text-[10px] tracking-widest">
                    {'★'.repeat(Math.floor(deal.rating || 0))}
                    {'☆'.repeat(5 - Math.floor(deal.rating || 0))}
                  </span>
                </div>
                {deal.includes && deal.includes.length > 0 && (
                  <div className="absolute bottom-8 right-0 bg-white px-5 py-2.5 flex items-center gap-3 rounded-l-full shadow-lg border-l-4 border-blue-600">
                    <div className="bg-blue-50 p-1.5 rounded-full">
                      <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-black uppercase text-[#002b5b] tracking-wider">
                      {deal.includes[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <div className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {deal.hotelId?.city}, {deal.hotelId?.country}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-5 leading-tight group-hover:text-[#002b5b] transition-colors">
                    {deal.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 bg-[#f8fafc] px-4 py-2 rounded-xl border border-gray-100">
                      <span className="text-lg">🕒</span>
                      <span className="text-xs font-bold text-gray-600">{deal.duration} Nights</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#f8fafc] px-4 py-2 rounded-xl border border-gray-100">
                      <span className="text-lg">🍽</span>
                      <span className="text-xs font-bold text-gray-600">Half Board</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-lg">{deal.description}</p>
                </div>

                {/* Bottom Price Row */}
                <div className="flex items-end justify-between border-t pt-8 border-[#f1f5f9]">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-widest mb-1">
                      Package Total From
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-[#002b5b]">
                        {formatCurrency(deal.discountedPrice)}
                      </span>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                        per person
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/deal/${deal._id}`}
                    className="bg-[#002b5b] text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.15em] hover:bg-[#001f41] transition-all shadow-md"
                  >
                    View Deal
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {currentPage < totalPages && (
          <div className="mt-16 text-center">
            <button
              onClick={loadMore}
              className="bg-white border-2 border-[#002b5b] text-[#002b5b] hover:bg-[#002b5b] hover:text-white px-12 py-5 rounded-full text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-md"
            >
              Load More 2026/2027 Deals
            </button>
          </div>
        )}
      </main>

      {/* Bottom Banner (unchanged) */}
      <section
        className="relative w-full flex items-center justify-center text-center overflow-hidden"
        style={{
          height: '480px',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-4xl px-4 text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight">
            Ready for your next luxury escape?
          </h2>
          <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto mb-10">
            Don't miss out on these exclusive 2026 & 2027 handpicked deals. Our experts are standing by to curate your perfect journey.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <span className="bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
              ATOL Protected
            </span>
            <span className="bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
              Award Winning Service
            </span>
          </div>
          <button className="bg-white text-[#002b5b] px-12 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-gray-100 transition-all shadow-xl">
            Enquire Now
          </button>
        </div>
      </section>

      {/* Trust Bar (unchanged) */}
      <section className="bg-white py-16 border-t border-b border-gray-100">
        <div className="max-w-[1100px] mx-auto px-6">
          <h3 className="text-center text-2xl md:text-3xl font-bold text-[#002b5b] mb-12 uppercase tracking-tight">
            Holidays you can trust
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-10">
            {/* Trust Items – same as original */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#002b5b] transition-colors duration-300">
                <svg className="w-7 h-7 text-[#002b5b] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[13px] font-bold text-[#1a1a1a] leading-snug">Low deposits for as little as £29 per person</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#002b5b] transition-colors duration-300">
                <svg className="w-7 h-7 text-[#002b5b] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-[13px] font-bold text-[#1a1a1a] leading-snug">Helpful spread the cost payment options</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#002b5b] transition-colors duration-300">
                <svg className="w-7 h-7 text-[#002b5b] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-[13px] font-bold text-[#1a1a1a] leading-snug">Our 24/7 support service - always here for you</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#002b5b] transition-colors duration-300">
                <svg className="w-7 h-7 text-[#002b5b] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <p className="text-[13px] font-bold text-[#1a1a1a] leading-snug">Price match any product against other retailers</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#002b5b] transition-colors duration-300">
                <svg className="w-7 h-7 text-[#002b5b] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-[13px] font-bold text-[#1a1a1a] leading-snug">Peace of mind with fully bonded holidays</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OfferPage;