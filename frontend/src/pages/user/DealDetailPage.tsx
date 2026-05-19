// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { dealService } from '../../services/dealService';
// import type { Deal } from '../../types';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { useAppData } from '../../contexts/AppContext';
// import {  formatDate } from '../../utils/format';
// import { FiStar, FiClock, FiUsers, FiCheck, FiX, FiMapPin, FiCalendar } from 'react-icons/fi';
// import type { Hotel } from '../../types';
// const DealDetailPage = () => {
 
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { isAuth } = useAppData();
//   const [deal, setDeal] = useState<Deal | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [review, setReview] = useState({ rating: 5, comment: '' });
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetchDeal();
//   }, [id]);

//   const fetchDeal = async () => {
//     if (!id) return;
//     try {
//       const response = await dealService.getDealById(id);
//       if (response.success) {
//         setDeal(response.data);
//       }
//     } catch (error) {
//       console.error('Failed to fetch deal:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookNow = () => {
//     if (!isAuth) {
//       navigate('/login');
//       return;
//     }
//     navigate(`/booking/${id}`);
//   };

//   const handleSubmitReview = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isAuth) {
//       navigate('/login');
//       return;
//     }
//     setSubmitting(true);
//     try {
//       await dealService.addReview(id!, review.rating, review.comment);
//       setReview({ rating: 5, comment: '' });
//       fetchDeal();
//     } catch (error) {
//       console.error('Failed to submit review:', error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (!deal) return <div className="text-center py-16">Deal not found</div>;

//   const isAvailable = deal.status === 'active' && new Date(deal.endDate) > new Date();
//   const discount = Math.round(((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100);
//   const spotsLeft = deal.maxBookings - deal.currentBookings;
//   const hotel = deal.hotelId as Hotel;
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="text-sm text-gray-500 mb-6">
//         <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/')}>Home</span>
//         {' / '}
//         <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/deals')}>Deals</span>
//         {' / '}
//         <span className="text-gray-800">{deal.title}</span>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2">
//           <div className="bg-gray-100 rounded-lg overflow-hidden">
//             <img
//               src={deal.images?.[selectedImage] || 'https://via.placeholder.com/800x500'}
//               alt={deal.title}
//               className="w-full h-96 object-cover"
//             />
//           </div>
//           {deal.images && deal.images.length > 1 && (
//             <div className="flex space-x-2 mt-4">
//               {deal.images.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={img}
//                   alt={`Thumbnail ${idx + 1}`}
//                   onClick={() => setSelectedImage(idx)}
//                   className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
//                     selectedImage === idx ? 'border-blue-600' : 'border-transparent'
//                   }`}
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         <div>
//           <div className="bg-white rounded-lg shadow p-6 sticky top-24">
//             <div className="flex justify-between items-start mb-4">
//               <h1 className="text-2xl font-bold text-gray-800">{deal.title}</h1>
//               <div className="flex items-center">
//                 <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
//                 <span className="ml-1 font-semibold">{deal.rating?.toFixed(1) || 'New'}</span>
//               </div>
//             </div>

//             <div className="flex items-center text-gray-500 mb-4">
//               <FiMapPin className="w-4 h-4 mr-1" />
//               <span>{deal.hotelId?.name}, {deal.hotelId?.city}</span>
//             </div>

//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <span className="text-gray-400 line-through text-lg">₹{deal.originalPrice.toLocaleString()}</span>
//                 <span className="text-3xl font-bold text-blue-600 ml-2">₹{deal.discountedPrice.toLocaleString()}</span>
//                 <span className="text-gray-500 text-sm">/person</span>
//               </div>
//               <div className="bg-red-100 text-red-600 px-3 py-1 rounded-lg font-bold text-sm">{discount}% OFF</div>
//             </div>

//             <div className="space-y-3 mb-6">
//               <div className="flex items-center text-gray-600">
//                 <FiClock className="w-4 h-4 mr-2" />
//                 <span>{deal.duration} days package</span>
//               </div>
//               <div className="flex items-center text-gray-600">
//                 <FiCalendar className="w-4 h-4 mr-2" />
//                 <span>Valid until {formatDate(deal.endDate)}</span>
//               </div>
//               <div className="flex items-center text-gray-600">
//                 <FiUsers className="w-4 h-4 mr-2" />
//                 <span>{spotsLeft} spots left</span>
//               </div>
//             </div>

//             <button
//               onClick={handleBookNow}
//               disabled={!isAvailable || spotsLeft === 0}
//               className={`w-full py-3 rounded-lg font-semibold transition ${
//                 isAvailable && spotsLeft > 0
//                   ? 'bg-blue-600 text-white hover:bg-blue-700'
//                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               }`}
//             >
//               {!isAvailable ? 'Deal Expired' : spotsLeft === 0 ? 'Sold Out' : 'Book Now'}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="mt-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-bold mb-4">About This Package</h2>
//           <p className="text-gray-600 leading-relaxed">{deal.description}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold mb-4 flex items-center">
//             <FiCheck className="w-5 h-5 text-green-600 mr-2" />
//             What's Included
//           </h3>
//           <ul className="space-y-2">
//             {deal.includes?.map((item, idx) => (
//               <li key={idx} className="flex items-start">
//                 <FiCheck className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
//                 <span className="text-gray-600">{item}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold mb-4 flex items-center">
//             <FiX className="w-5 h-5 text-red-600 mr-2" />
//             What's Excluded
//           </h3>
//           <ul className="space-y-2">
//             {deal.excludes?.map((item, idx) => (
//               <li key={idx} className="flex items-start">
//                 <FiX className="w-4 h-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
//                 <span className="text-gray-600">{item}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       <div className="mt-6 bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
        
//         {isAuth && (
//           <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
//             <h3 className="font-semibold mb-3">Write a Review</h3>
//             <div className="mb-3">
//               <label className="block text-sm font-medium mb-1">Rating</label>
//               <div className="flex space-x-2">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button key={star} type="button" onClick={() => setReview({ ...review, rating: star })} className="focus:outline-none">
//                     <FiStar className={`w-6 h-6 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="mb-3">
//               <textarea
//                 placeholder="Share your experience..."
//                 value={review.comment}
//                 onChange={(e) => setReview({ ...review, comment: e.target.value })}
//                 rows={3}
//                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
//               {submitting ? 'Submitting...' : 'Submit Review'}
//             </button>
//           </form>
//         )}

//         {deal.reviews && deal.reviews.length > 0 ? (
//           <div className="space-y-4">
//             {deal.reviews.map((review, idx) => (
//               <div key={idx} className="border-b pb-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center">
//                     <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                       <span className="text-blue-600 font-semibold">{review.userId?.toString().charAt(0).toUpperCase()}</span>
//                     </div>
//                     <span className="ml-2 font-medium">User</span>
//                   </div>
//                   <div className="flex items-center">
//                     {[...Array(5)].map((_, i) => (
//                       <FiStar key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
//                     ))}
//                   </div>
//                 </div>
//                 <p className="text-gray-600">{review.comment}</p>
//                 <p className="text-xs text-gray-400 mt-2">{formatDate(review.createdAt?.toString() || new Date().toString())}</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DealDetailPage;

// src/pages/user/DealDetailPage.tsx
// import { useState, useEffect, useRef } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { dealService } from '../../services/dealService';
// import { hotelService } from '../../services/hotelService';
// import { useAppData } from '../../contexts/AppContext';
// import { formatCurrency, formatDate } from '../../utils/format';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import toast from 'react-hot-toast';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// interface Deal {
//   _id: string;
//   title: string;
//   description: string;
//   hotelId: {
//     _id: string;
//     name: string;
//     city: string;
//     country: string;
//     images?: string[];
//     rating?: number;
//     description?: string;
//     facilities?: string[];
//     address?: string;
//     latitude?: number;
//     longitude?: number;
//   };
//   originalPrice: number;
//   discountedPrice: number;
//   discountPercent: number;
//   duration: number;
//   startDate: string;
//   endDate: string;
//   includes: string[];
//   excludes: string[];
//   images: string[];
//   rating: number;
//   reviews?: Array<{ userId: string; rating: number; comment: string; createdAt: string }>;
//   excursion?: { title: string; description: string; included: boolean };
//   whyLove?: string[];
// }

// // Demo data fallback (matches your HTML example)
// // const demoDeal: Deal = {
// //   _id: 'demo1',
// //   title: 'Premium Srebreno: Stylish Dubrovnik Coast Escape Including A Romantic Sunset Cruise',
// //   description: 'Premium Apartments Srebreno offers stylish, self-catering accommodation just moments from the beach in a peaceful coastal setting. Ideal for couples and families wanting flexibility and space, these contemporary apartments combine modern comforts with easy access to Dubrovnik.',
// //   hotelId: {
// //     _id: 'hotel1',
// //     name: 'Premium Apartments Srebreno',
// //     city: 'Dubrovnik',
// //     country: 'Croatia',
// //     images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e'],
// //     rating: 4,
// //     description: 'Premium Apartments Srebreno combines modern apartment living with the charm of Croatia’s stunning coastline.',
// //     facilities: ['Free WiFi', 'Swimming Pool', 'Beach Access', 'Airport Transfer', 'Family Rooms', 'Restaurant'],
// //     address: 'Premium Apartments Srebreno, Dubrovnik Coast, Croatia',
// //     latitude: 42.6507,
// //     longitude: 18.0944,
// //   },
// //   originalPrice: 410,
// //   discountedPrice: 369,
// //   discountPercent: 13,
// //   duration: 5,
// //   startDate: '2026-05-22',
// //   endDate: '2026-05-27',
// //   includes: [
// //     'Return Flights from/to the UK',
// //     'All known current airport and security charges.',
// //     'One piece of hand baggage per person.',
// //     'FREE Airport Fastrack Security (*if available)',
// //     '5 Night Accommodation at exclusive PlanMyLuxe rates',
// //     'Board Basis: Room Only',
// //     'Tours and excursions as stated',
// //     'The services of PlanMyLuxe local representative\'s or holiday support centre',
// //   ],
// //   excludes: [],
// //   images: [
// //     'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
// //     'https://images.unsplash.com/photo-1493558103817-58b2924bce98',
// //     'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
// //   ],
// //   rating: 4,
// //   reviews: [
// //     { userId: 'user1', rating: 5, comment: 'Amazing location and beautiful apartment. Loved the sunset cruise and friendly staff.', createdAt: '2025-01-10T00:00:00Z' },
// //     { userId: 'user2', rating: 4, comment: 'Great holiday package with excellent facilities and easy access to Dubrovnik.', createdAt: '2025-02-15T00:00:00Z' },
// //   ],
// //   excursion: {
// //     title: 'Romantic Sunset Cruise with Unlimited Drinks',
// //     description: 'Set off on a memorable 45-minute sunset boat trip from the charming harbour of Cavtat. As golden hour unfolds, cruise across the tranquil waters of Župa Bay, soaking in stunning Adriatic views and the beauty of the surrounding coastline. Enjoy unlimited drinks on board, adding a touch of indulgence to this relaxing experience.',
// //     included: true,
// //   },
// //   whyLove: [
// //     'Apartment-style accommodation',
// //     'Close to the beach',
// //     'Modern, spacious interiors',
// //     'Peaceful Srebreno location',
// //     'Easy access to Dubrovnik',
// //     'Ideal for flexible self-catering stays',
// //   ],
// // };

// const DealDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { isAuth } = useAppData();
//   const [deal, setDeal] = useState<Deal | null>(null);
//   const [similarHotels, setSimilarHotels] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('hotel');
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [departure, setDeparture] = useState('Any London');
//   const [nights, setNights] = useState('5 Nights');
//   const [board, setBoard] = useState('Bed And Breakfast');
//   const [selectedMonth, setSelectedMonth] = useState('May 2026');
//   const [selectedDate, setSelectedDate] = useState(15);
//   const [pricePerPerson, setPricePerPerson] = useState(334);
//   const [flightFrom, setFlightFrom] = useState('Stansted (STN)');

//   // Calendar days mock (simplified)
//   const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

//   useEffect(() => {
//     fetchDeal();
//   }, [id]);

//   const fetchDeal = async () => {
//     setLoading(true);
//     try {
//       const response = await dealService.getDealById(id!);
//       if (response.success && response.data) {
//         setDeal(response.data);
//         // Fetch similar hotels based on destination
//         if (response.data.hotelId?.city) {
//           const similarRes = await hotelService.getAllHotels({ city: response.data.hotelId.city, limit: 4 });
//           if (similarRes.success) setSimilarHotels(similarRes.data);
//           else setSimilarHotels([]);
//         }
//       } else {
//         // Fallback to demo
//         setDeal(demoDeal);
//         setSimilarHotels([]);
//       }
//     } catch (error) {
//       console.error('Failed to fetch deal, using demo data:', error);
//       setDeal(demoDeal);
//       setSimilarHotels([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookNow = () => {
//     if (!isAuth) {
//       toast.error('Please login to book');
//       navigate('/login');
//       return;
//     }
//     navigate(`/booking/${deal?._id}`);
//   };

//   const renderStars = (rating: number) => {
//     const fullStars = Math.floor(rating);
//     const halfStar = rating % 1 >= 0.5;
//     const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//     return (
//       <div className="flex items-center gap-1">
//         {[...Array(fullStars)].map((_, i) => <span key={i} className="text-[#CB2187] text-[20px]">★</span>)}
//         {halfStar && <span className="text-[#CB2187] text-[20px]">½</span>}
//         {[...Array(emptyStars)].map((_, i) => <span key={i} className="text-gray-300 text-[20px]">★</span>)}
//       </div>
//     );
//   };

//   if (loading) return <LoadingSpinner />;
//   if (!deal) return <div className="text-center py-20">Deal not found</div>;

//   return (
//     <div className="bg-white font-sans">
//       <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6">
//         {/* TOP TITLE & PRICE */}
//         <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
//           <div className="max-w-[850px]">
//             <h1 className="text-[32px] leading-[42px] font-bold text-[#CB2187]">{deal.title}</h1>// dynamic needed
//             <p className="text-[#595858] text-[18px] mt-2 font-medium">
//               Exclusive offer to Plan My Luxe - Hurry Limited Seats and Availability - Selling Fast!!!
//             </p>
//           </div>
//           <div className="flex flex-col items-end">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="bg-[#25D366] text-white text-[13px] px-3 py-1 rounded font-semibold">Save {deal.discountPercent}%</div>//fynmic needed
//               <div className="relative text-[#595858] font-bold text-[18px]">
//                 {formatCurrency(deal.originalPrice)} //dynmic needed
//                 <div className="absolute left-0 top-[50%] w-full h-[2px] bg-[#595858] rotate-[-10deg]"></div>
//               </div>
//             </div>
//             <div className="flex items-end">
//               <span className="text-[#CB2187] text-[18px] font-medium mr-1 mb-1">from</span>
//               <span className="text-[#CB2187] text-[44px] font-bold leading-none">{formatCurrency(deal.discountedPrice)}</span>//dynmic needed
//               <span className="text-[#CB2187] text-[24px] mb-1">/pp</span>
//             </div>
//             <div className="text-[13px] text-[#595858] mt-1">
//               {Math.floor(deal.discountedPrice * 0.97)} + {Math.floor(deal.discountedPrice * 0.03)} (Local Tax)//dynmic needed
//             </div>
//             <button onClick={handleBookNow} className="mt-4 w-[190px] h-[60px] rounded-lg text-white font-bold text-[18px]" style={{ background: 'linear-gradient(to bottom,#ED0791,#CB2187)' }}>
//               Enquiry Now
//             </button>
//           </div>
//         </div>

//         {/* IMAGE GALLERY */}
//         <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
//           <div>
//             <img src={deal.images[0] || 'https://via.placeholder.com/1200x500'} className="w-full h-[500px] object-cover rounded-xl" alt="main" />
//           </div>
//           <div className="grid grid-rows-2 gap-4">
//             <img src={deal.images[1] || deal.images[0]} className="w-full h-[242px] object-cover rounded-xl" alt="secondary" />
//             <div className="relative">
//               <img src={deal.images[2] || deal.images[0]} className="w-full h-[242px] object-cover rounded-xl" alt="third" />
//               <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg text-[#CB2187] font-semibold flex items-center gap-2">
//                 📷 More Images
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* SHARE BUTTON */}
//         <div className="flex justify-end mt-6">
//           <button className="bg-[#9F9F9F] hover:bg-[#7d7d7d] text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2">
//             🔗 Share This Offer
//           </button>
//         </div>

//         {/* CONTENT AREA (Left & Right Sidebar) */}
//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 mt-10">
//           {/* LEFT CONTENT */}
//           <div>
//             {renderStars(deal.rating)} //dynmic needed
//             <h2 className="text-[34px] font-bold text-[#242F40] mt-2">{deal.hotelId.name}</h2>//dynmic needed
//             <div className="flex items-center gap-2 text-[#595858] mt-3 font-semibold tracking-wide uppercase">
//               📍 {deal.hotelId.city}, {deal.hotelId.country}//dynmic needed
//             </div>
//             <p className="text-[#595858] text-[17px] leading-[32px] mt-6">{deal.description}</p>//dynmic needed

//             {/* ABOUT DEAL */}
//             <div className="mt-14">
//               <h2 className="text-[34px] font-bold text-[#242F40] mb-6">About the deal</h2>
//               <p className="text-[#595858] text-[17px] leading-[34px]">
//                 With this deal you can enjoy exclusive member prices at up to {deal.discountPercent}//dynmic needed % off high street or online travel agents as well as other inclusive extras.
//               </p>

//               {/* WHAT'S INCLUDED */}
//               <div className="mt-10">
//                 <h3 className="text-[28px] font-bold text-[#CB2187] mb-5">What's Included:</h3>
//                 <div className="space-y-4">
//                   {deal.includes.map((item, idx) => (
//                     <div key={idx} className="flex gap-4 items-start">
//                       <div className="text-[#CB2187] text-[20px]">✓</div>
//                       <p className="text-[#595858] text-[17px]">{item}</p>
//                     </div>
//                   ))}//dynmic needed
//                 </div>
//               </div>

//               {/* EXCURSION (if any) */}
//               {deal.excursion && (
//                 <div className="mt-14 bg-[#FFF5FB] border border-[#ffd5ef] rounded-2xl p-8">
//                   <h3 className="text-[30px] font-bold text-[#CB2187] mb-6">Excursion Included: {deal.excursion.title}</h3>//dynmic needed
//                   <p className="text-[#595858] text-[17px] leading-[34px] whitespace-pre-line">{deal.excursion.description}</p>//dynmic needed
//                 </div>
//               )}

//               {/* WHY WE LOVE THIS HOTEL */}
//               {deal.whyLove && deal.whyLove.length > 0 && (
//                 <div className="mt-14">
//                   <h3 className="text-[30px] font-bold text-[#242F40] mb-8">Why we love this hotel</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     {deal.whyLove.map((item, idx) => (
//                       <div key={idx} className="border rounded-xl p-5 shadow-sm bg-white">
//                         <h4 className="font-semibold text-[18px] text-[#242F40]">{item}</h4>
//                       </div>
//                     ))}//dynmic needed
//                   </div>
//                 </div>
//               )}

//               {/* DISCOVER SECTION */}
//               <div className="mt-16 bg-[#CB2187] rounded-3xl p-10 text-center">
//                 <h2 className="text-white text-[36px] font-bold">TOP TRENDING DEALS</h2>
//                 <p className="text-white text-[20px] mt-3">DISCOVER EXCLUSIVES</p>
//                 <button className="mt-8 bg-white text-[#CB2187] font-bold px-10 py-4 rounded-full text-[18px]" onClick={() => navigate('/deals')}>
//                   Click Here
//                 </button>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
//                   <div className="bg-white rounded-2xl p-6">
//                     <h4 className="font-bold text-[#242F40] text-[20px]">Call Us</h4>
//                     <p className="text-[#595858] mt-2">Our team are available 24 hours, 7 days</p>
//                   </div>
//                   <div className="bg-white rounded-2xl p-6">
//                     <h4 className="font-bold text-[#242F40] text-[20px]">Chat Online</h4>
//                     <p className="text-[#595858] mt-2">Speak directly with our travel experts</p>
//                   </div>
//                   <div className="bg-white rounded-2xl p-6">
//                     <h4 className="font-bold text-[#242F40] text-[20px]">Whatsapp</h4>
//                     <p className="text-[#595858] mt-2">Message us anytime for instant support</p>
//                   </div>
//                 </div>
//               </div>

//               {/* TABS */}
//               <div className="mt-16">
//                 <div className="flex flex-wrap gap-4 border-b pb-4">
//                   {['hotel', 'location', 'facilities', 'reviews', 'fineprint'].map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       className={`px-6 py-3 rounded-full font-semibold ${activeTab === tab ? 'bg-[#CB2187] text-white' : 'bg-gray-100'}`}
//                     >
//                       {tab === 'hotel' ? 'Hotel Details' : tab === 'location' ? 'Location' : tab === 'facilities' ? 'Facilities' : tab === 'reviews' ? 'Reviews' : 'Fine Print'}
//                     </button>
//                   ))}
//                 </div>

//                 {/* HOTEL DETAILS */}
//                 {activeTab === 'hotel' && (
//                   <div className="mt-8">
//                     <h3 className="text-[28px] font-bold text-[#242F40] mb-5">Hotel Details</h3>
//                     <p className="text-[#595858] text-[17px] leading-[34px]">{deal.hotelId.description || deal.description}</p>
//                   </div>
//                 )}//dynmic needed

//                 {/* LOCATION */}
//                 {activeTab === 'location' && (
//                   <div className="mt-8">
//                     <h3 className="text-[28px] font-bold text-[#242F40] mb-5">Location</h3>
//                     <div className="rounded-2xl overflow-hidden">
//                       <iframe
//                         src={`https://maps.google.com/maps?q=${deal.hotelId.latitude || deal.hotelId.city}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
//                         className="w-full h-[400px] border-0 rounded-2xl"
//                         title="location map"
//                       ></iframe>
//                     </div>
//                     <p className="mt-5 text-[#595858] text-[17px]">{deal.hotelId.address || `${deal.hotelId.city}, ${deal.hotelId.country}`}</p>
//                   </div>
//                 )}//dynmic needed

//                 {/* FACILITIES */}
//                 {activeTab === 'facilities' && (
//                   <div className="mt-8">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                       {(deal.hotelId.facilities || ['Free WiFi', 'Swimming Pool', 'Beach Access', 'Airport Transfer', 'Family Rooms', 'Restaurant']).map((fac, idx) => (
//                         <div key={idx} className="border rounded-xl p-5">{fac}</div>
//                       ))}
//                     </div>
//                   </div>
//                 )}//dynmic needed

//                 {/* REVIEWS */}
//                 {activeTab === 'reviews' && (
//                   <div className="mt-8 space-y-6">
//                     {deal.reviews && deal.reviews.length > 0 ? (
//                       deal.reviews.map((rev, idx) => (
//                         <div key={idx} className="border rounded-2xl p-6">
//                           <div className="flex items-center justify-between">
//                             <h4 className="font-bold text-[20px]">{rev.userId === 'user1' ? 'Sarah Williams' : 'John Peterson'}</h4>
//                             <div className="text-[#CB2187]">{renderStars(rev.rating)}</div>
//                           </div>
//                           <p className="mt-4 text-[#595858] leading-[32px]">{rev.comment}</p>
//                         </div>
//                       ))
//                     ) : (
//                       <p>No reviews yet.</p>
//                     )}
//                   </div>//dynmic needed
//                 )}

//                 {/* FINE PRINT */}
//                 {activeTab === 'fineprint' && (
//                   <div className="mt-8">
//                     <p className="text-[#595858] text-[17px] leading-[34px]">
//                       Prices are subject to availability and may change without notice. Local taxes may apply. Terms and conditions apply.
//                     </p>
//                   </div>
//                 )}
//               </div>
// //dynmic needed-where hotels are also fetched under this deal it should be ctrl select then i t come under the deal
//               {/* SIMILAR HOTELS CAROUSEL */}
//               {similarHotels.length > 0 && (
//                 <div className="mt-16 w-full overflow-hidden">
//                   <h2 className="text-[32px] font-bold text-[#242F40] mb-8 text-center">Similar Hotels</h2>
//                   <div className="relative w-full">
//                     <div id="similarCarousel" className="carousel slide" data-bs-ride="carousel">
//                       <div className="carousel-inner">
//                         {Array.from({ length: Math.ceil(similarHotels.length / 4) }).map((_, slideIdx) => (
//                           <div key={slideIdx} className={`carousel-item ${slideIdx === 0 ? 'active' : ''}`}>
//                             <div className="row g-4 justify-content-center px-3 mx-0">
//                               {similarHotels.slice(slideIdx * 4, slideIdx * 4 + 4).map((hotel) => (
//                                 <div key={hotel._id} className="col-lg-3 col-md-6 col-12 px-1">
//                                   <div className="bg-white rounded-[20px] overflow-hidden shadow-md border border-[#ececec] h-[320px] flex flex-col">
//                                     <div className="w-full h-[140px] overflow-hidden flex-shrink-0">
//                                       <img src={hotel.images?.[0] || 'https://via.placeholder.com/400x200'} className="w-full h-full object-cover" alt={hotel.name} />
//                                     </div>
//                                     <div className="flex flex-col justify-between flex-1 p-[6px]">
//                                       <div className="pr-[2px]">
//                                         <div className="flex gap-1 text-[13px] text-[#CB2187] mb-[3px]">{renderStars(hotel.rating || 0)}</div>
//                                         <h3 className="text-[16px] font-bold text-[#242F40] mb-[2px] leading-tight truncate">{hotel.name}</h3>
//                                         <p className="text-[#777] text-[12px] mb-[3px] truncate">{hotel.city}, {hotel.country}</p>
//                                       </div>
//                                       <div className="mt-[2px]">
//                                         <div className="flex items-end gap-1 mb-[3px]">
//                                           <span className="text-[#CB2187] text-[20px] font-bold">{formatCurrency(hotel.price || 299)}</span>
//                                           <span className="text-[#777] text-[11px]">/ person</span>
//                                         </div>
//                                         <button className="w-full h-[32px] rounded-full text-white font-bold text-[12px] border-0 mt-[1px]" style={{ background: 'linear-gradient(to bottom,#ED0791,#CB2187)' }}>
//                                           View Deal
//                                         </button>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                       <button className="carousel-control-prev" type="button" data-bs-target="#similarCarousel" data-bs-slide="prev">
//                         <span className="carousel-control-prev-icon bg-dark rounded-circle" aria-hidden="true"></span>
//                       </button>
//                       <button className="carousel-control-next" type="button" data-bs-target="#similarCarousel" data-bs-slide="next">
//                         <span className="carousel-control-next-icon bg-dark rounded-circle" aria-hidden="true"></span>
//                       </button>
//                     </div>
//                     {/* Custom arrows (optional) – reuse the existing style */}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* RIGHT SIDEBAR (BOOKING FORM) */}
//             <div className="container-fluid p-3">
//               <div className="sidebar-card bg-white border border-light rounded-3 p-3 mx-auto sticky-top" style={{ top: '20px', maxWidth: '420px' }}>
//                 {/* Action Buttons */}
//                 <div className="row g-2 mb-3">
//                   <div className="col-4"><button className="btn btn-pink btn-sm w-100 py-2 fw-bold text-white shadow-sm"><i className="fas fa-phone-alt me-1"></i>Call</button></div>
//                   <div className="col-4"><button className="btn btn-outline-pink btn-sm w-100 py-2 fw-bold"><i className="fas fa-comment-dots me-1"></i>Chat</button></div>
//                   <div className="col-4"><button className="btn btn-whatsapp btn-sm w-100 py-2 fw-bold text-white shadow-sm"><i className="fab fa-whatsapp me-1"></i>WhatsApp</button></div>
//                 </div>
//                 <h6 className="fw-bold text-dark mb-3 d-flex align-items-center"><i className="fas fa-calendar-check text-danger me-2"></i>Check Availability</h6>
//                 <form className="row g-2">
//                   <div className="col-12">
//                     <label className="form-label text-muted small mb-1">Departure</label>
//                     <div className="input-group input-group-sm">
//                       <span className="input-group-text bg-white border-end-0"><i className="fas fa-plane-departure text-danger"></i></span>
//                       <select className="form-select form-select-custom border-start-0" value={departure} onChange={(e) => setDeparture(e.target.value)}>//dynmic needed
//                         <option>Any London</option><option>Gatwick (LGW)</option><option>Heathrow (LHR)</option><option>Stansted (STN)</option><option>Luton (LTN)</option>
//                       </select>
//                     </div>
//                   </div>
//                   <div className="col-6">
//                     <label className="form-label text-muted small mb-1">Nights</label>
//                     <div className="input-group input-group-sm">
//                       <span className="input-group-text bg-white border-end-0"><i className="fas fa-moon text-danger"></i></span>
//                       <select className="form-select form-select-custom border-start-0" value={nights} onChange={(e) => setNights(e.target.value)}>
//                         <option>4 Nights</option><option>3 Nights</option><option>7 Nights</option><option>10 Nights</option><option>14 Nights</option>
//                       </select>
//                     </div>
//                   </div>
//                   <div className="col-6">
//                     <label className="form-label text-muted small mb-1">Board</label>
//                     <div className="input-group input-group-sm">
//                       <span className="input-group-text bg-white border-end-0"><i className="fas fa-utensils text-danger"></i></span>
//                       <select className="form-select form-select-custom border-start-0" value={board} onChange={(e) => setBoard(e.target.value)}>
//                         <option>Bed And Breakfast</option><option>Room Only</option><option>Half Board</option><option>Full Board</option><option>All Inclusive</option>
//                       </select>
//                     </div>
//                   </div>
//                   <div className="col-12">
//                     <div className="card border shadow-sm" style={{ height: '280px' }}>
//                       <div className="card-header bg-light border-0 py-2">
//                         <div className="row align-items-center g-1">
//                           <div className="col-auto"><button className="btn btn-sm btn-outline-secondary p-1"><i className="fas fa-chevron-left"></i></button></div>
//                           <div className="col"><select className="form-select form-select-sm bg-white border-0 fw-bold text-primary mx-1" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ fontSize: '13px' }}><option>May 2026</option><option>Jun 2026</option><option>Jul 2026</option></select></div>
//                           <div className="col-auto"><button className="btn btn-sm btn-outline-secondary p-1"><i className="fas fa-chevron-right"></i></button></div>
//                         </div>
//                       </div>
//                       <div className="card-body p-2">
//                         <div className="row text-center text-muted small fw-semibold mb-1"><div className="col">M</div><div className="col">T</div><div className="col">W</div><div className="col">T</div><div className="col">F</div><div className="col">S</div><div className="col">S</div></div>
//                         <div className="row g-1 mb-0">
//                           {daysInMonth.map(day => (
//                             <div key={day} className={`col calendar-day bg-white border rounded text-center fw-medium ${day === selectedDate ? 'selected-date' : ''}`} onClick={() => setSelectedDate(day)}>
//                               {day}<br /><small className={day === selectedDate ? 'text-white' : ''}>£{334 + (day % 10) * 2}</small>//dynmic needed but based on the price it fetched on that do 
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-12">
//                     <div className="d-flex justify-content-between align-items-center p-2 bg-white border rounded shadow-sm">
//                       <small className="text-danger"><i className="fas fa-plane me-1"></i>Flight from</small>
//                       <small className="fw-bold text-dark">{flightFrom}</small>//dynmic needed
//                     </div>
//                   </div>
//                 </form>
//                 <div className="border-top pt-3 mt-2">
//                   <div className="d-flex justify-content-between align-items-baseline mb-1"><small className="text-muted">Price per person</small><div><span className="text-danger fw-bold h5 mb-0">from </span><span className="text-danger fw-bold h4 mb-0">{formatCurrency(pricePerPerson)}</span></div></div>//dynmic needed
//                   <div className="d-flex justify-content-between small text-muted mb-2"><span>(*Flights Included)</span><span>{formatCurrency(pricePerPerson - 6)} + £6 (Local Tax)</span></div>
//                   <div className="d-flex justify-content-between small"><span>Quote Ref:</span><span className="fw-bold text-uppercase">Teff8a8t</span></div>
//                 </div>
//                 <button className="btn btn-pink w-100 py-3 fw-bold mt-3 shadow-lg text-pink fs-5 rounded-3" onClick={handleBookNow}>Enquiry Now</button>
//                 <div className="mt-3 p-2 bg-pink-50 border border-danger-subtle rounded-2 text-center">
//                   <div className="text-uppercase fw-bold text-muted small mb-1">Trusted & Protected</div>
//                   <div className="d-flex justify-content-around mb-2"><div className="bg-light rounded px-2 py-1 small fw-monospace">TTA</div><div className="bg-light rounded-circle px-1 py-1 small fw-bold">ATOL</div></div>
//                   <div className="mb-1"><div className="d-flex justify-content-center gap-1 mb-1"><i className="text-success fs-6">★</i><i className="text-success fs-6">★</i><i className="text-success fs-6">★</i><i className="text-success fs-6">★</i><i className="text-success fs-6">★</i></div><small className="text-muted">Trustpilot <strong>4.9</strong> | 7,735 reviews</small></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* TRUST SECTION (static) */}
//       <section className="w-full bg-gradient-to-r from-[#f8f9fa] to-white py-16 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-12 px-4">
//             <h2 className="text-[36px] font-bold text-[#242F40] mb-4 leading-tight">Holidays you can trust....</h2>
//             <p className="text-[18px] text-[#242F40] font-semibold mb-8 max-w-2xl mx-auto leading-relaxed">We offer low deposits for as little as <span className="text-[#CB2187] font-bold">£29 per person</span></p>
//           </div>
//           <div className="flex flex-nowrap overflow-x-auto gap-4 pb-6 -mx-4 px-4 scrollbar-hide bg-white rounded-lg shadow-sm">
//             {/* 5 trust items – exactly as HTML */}
//             <div className="flex-shrink-0 w-[220px] bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#f5f5f5] flex flex-col items-center text-center min-h-[200px] justify-between">
//               <div className="w-14 h-14 bg-gradient-to-r from-[#ED0791] to-[#CB2187] rounded-lg flex items-center justify-center mb-4 shadow-lg hover:scale-110 transition-transform duration-300"><i className="fas fa-credit-card text-white text-lg"></i></div>
//               <div className="space-y-1"><h3 className="text-base font-bold text-[#242F40] leading-tight">Helpful spread the cost</h3><p className="text-[#CB2187] font-semibold text-sm">payment options</p></div>
//             </div>
//             <div className="flex-shrink-0 w-[220px] bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#f5f5f5] flex flex-col items-center text-center min-h-[200px] justify-between">
//               <div className="w-14 h-14 bg-gradient-to-r from-[#ED0791] to-[#CB2187] rounded-lg flex items-center justify-center mb-4 shadow-lg hover:scale-110 transition-transform duration-300"><i className="fas fa-headset text-white text-lg"></i></div>
//               <div className="space-y-1"><h3 className="text-base font-bold text-[#242F40] leading-tight">Our 24/7 support service -</h3><p className="text-[#CB2187] font-semibold text-sm">always here to help you.</p></div>
//             </div>
//             <div className="flex-shrink-0 w-[220px] bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#f5f5f5] flex flex-col items-center text-center min-h-[200px] justify-between">
//               <div className="w-14 h-14 bg-gradient-to-r from-[#ED0791] to-[#CB2187] rounded-lg flex items-center justify-center mb-4 shadow-lg hover:scale-110 transition-transform duration-300"><i className="fas fa-tags text-white text-lg"></i></div>
//               <div className="space-y-1"><h3 className="text-base font-bold text-[#242F40] leading-tight">We'll price match any product</h3><p className="text-[#CB2187] font-semibold text-sm">against any other retailer</p></div>
//             </div>
//             <div className="flex-shrink-0 w-[220px] bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#f5f5f5] flex flex-col items-center text-center min-h-[200px] justify-between">
//               <div className="w-14 h-14 bg-gradient-to-r from-[#ED0791] to-[#CB2187] rounded-lg flex items-center justify-center mb-4 shadow-lg hover:scale-110 transition-transform duration-300"><i className="fas fa-shield-alt text-white text-lg"></i></div>
//               <div className="space-y-1"><h3 className="text-base font-bold text-[#242F40] leading-tight">Enjoy peace of mind with</h3><p className="text-[#CB2187] font-semibold text-sm">fully bonded holidays</p></div>
//             </div>
//           </div>
//           <div className="flex items-center justify-center gap-9 mt-12">
//             <a href="#" className="text-[#CB2187] text-lg font-bold underline">Learn more about us</a>
//             <button className="px-10 py-4 bg-gradient-to-r from-[#ED0791] to-[#CB2187] hover:from-[#CB2187] hover:to-[#ED0791] text-white text-lg font-bold rounded-[8px] shadow-xl hover:shadow-2xl transition-all duration-300 border-0">chat us</button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-[#0f172a] text-white py-24">
//         <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
//           <div className="md:col-span-2">
//             <div className="font-bold text-3xl tracking-tighter mb-6">PLANMYLUXE</div>
//             <p className="text-gray-400 text-sm max-w-sm font-medium leading-relaxed">Redefining luxury travel through spontaneous exploration and curated comfort since 2012.</p>
//           </div>
//           <div>
//             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-gray-500">Contact</h4>
//             <p className="text-sm font-bold mb-2">020 8000 0000</p>
//             <p className="text-sm text-gray-400">concierge@planmyluxe.co.uk</p>
//           </div>
//           <div>
//             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-gray-500">Quick Links</h4>
//             <ul className="space-y-3 text-sm text-gray-400 font-bold uppercase tracking-widest text-[10px]">
//               <li><a href="#" className="hover:text-white transition-colors">T&Cs</a></li>
//               <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
//             </ul>
//           </div>
//         </div>
//         <div className="max-w-[1100px] mx-auto px-6 mt-20 pt-12 border-t border-white/5 text-center text-[10px] font-bold text-gray-600 uppercase tracking-widest">
//           © 2026 PlanMyLuxe Holiday Group. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default DealDetailPage;




// src/pages/user/DealDetailPage.tsx
// import { useState, useEffect, useRef } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { dealService } from '../../services/dealService';
// import { hotelService } from '../../services/hotelService';
// import { useAppData } from '../../contexts/AppContext';
// import { formatCurrency, formatDate } from '../../utils/format';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import toast from 'react-hot-toast';

// interface Deal {
//   _id: string;
//   title: string;
//   description: string;
//   hotelId: {
//     _id: string;
//     name: string;
//     city: string;
//     country: string;
//     images?: string[];
//     rating?: number;
//     description?: string;
//     facilities?: string[];
//     address?: string;
//     latitude?: number;
//     longitude?: number;
//   };
//   originalPrice: number;
//   discountedPrice: number;
//   discountPercent: number;
//   duration: number;
//   startDate: string;
//   endDate: string;
//   includes: string[];
//   excludes: string[];
//   images: string[];
//   rating: number;
//   reviews?: Array<{ userId: string; rating: number; comment: string; createdAt: string }>;
//   excursion?: { title: string; description: string; included: boolean };
//   whyLove?: string[];
// }

// const DealDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { isAuth } = useAppData();
//   const [deal, setDeal] = useState<Deal | null>(null);
//   const [similarHotels, setSimilarHotels] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('hotel');
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [departure, setDeparture] = useState('Any London');
//   const [nights, setNights] = useState('5 Nights');
//   const [board, setBoard] = useState('Bed And Breakfast');
//   const [selectedMonth, setSelectedMonth] = useState('May 2026');
//   const [selectedDate, setSelectedDate] = useState<number | null>(null);
//   const [flightFrom, setFlightFrom] = useState('Stansted (STN)');
//   const [calendarDays, setCalendarDays] = useState<{ date: Date; day: number; price: number }[]>([]);

//   useEffect(() => {
//     fetchDeal();
//   }, [id]);

//   useEffect(() => {
//     if (deal) {
//       setNights(`${deal.duration} Nights`);
//       generateCalendarDays();
//     }
//   }, [deal]);

//   const generateCalendarDays = () => {
//     if (!deal) return;
//     const start = new Date(deal.startDate);
//     const days = [];
//     const pricePerDay = Math.round(deal.discountedPrice / deal.duration);
//     for (let i = 0; i < deal.duration; i++) {
//       const date = new Date(start);
//       date.setDate(start.getDate() + i);
//       days.push({
//         date,
//         day: date.getDate(),
//         price: pricePerDay,
//       });
//     }
//     setCalendarDays(days);
//     if (days.length > 0) setSelectedDate(days[0].day);
//   };

//   const fetchDeal = async () => {
//     setLoading(true);
//     try {
//       const response = await dealService.getDealById(id!);
//       if (response.success && response.data) {
//         setDeal(response.data);
//         if (response.data.hotelId?.city) {
//           const similarRes = await hotelService.getAllHotels({ city: response.data.hotelId.city, limit: 4 });
//           if (similarRes.success) setSimilarHotels(similarRes.data);
//           else setSimilarHotels([]);
//         }
//       } else {
//         toast.error('Deal not found');
//         navigate('/deals');
//       }
//     } catch (error) {
//       console.error('Failed to fetch deal:', error);
//       toast.error('Failed to load deal details');
//       navigate('/deals');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookNow = () => {
//     if (!isAuth) {
//       toast.error('Please login to book');
//       navigate('/login');
//       return;
//     }
//     navigate(`/booking/${deal?._id}`);
//   };

//   const renderStars = (rating: number) => {
//     const fullStars = Math.floor(rating);
//     const halfStar = rating % 1 >= 0.5;
//     const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//     return (
//       <div className="flex items-center gap-1">
//         {[...Array(fullStars)].map((_, i) => <span key={i} className="text-[#CB2187] text-[20px]">★</span>)}
//         {halfStar && <span className="text-[#CB2187] text-[20px]">½</span>}
//         {[...Array(emptyStars)].map((_, i) => <span key={i} className="text-gray-300 text-[20px]">★</span>)}
//       </div>
//     );
//   };

//   if (loading) return <LoadingSpinner />;
//   if (!deal) return <div className="text-center py-20">Deal not found</div>;

//   const discountPercent = Math.round(((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100);
//   const spotsLeft = (deal as any).maxBookings - (deal as any).currentBookings;
//   const isAvailable = deal.status === 'active' && new Date(deal.endDate) > new Date();

//   return (
//     <div className="bg-white font-sans">
//       <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6">
//         {/* TOP TITLE & PRICE */}
//         <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
//           <div className="max-w-[850px]">
//             <h1 className="text-[32px] leading-[42px] font-bold text-[#CB2187]">{deal.title}</h1>
//             <p className="text-[#595858] text-[18px] mt-2 font-medium">
//               Exclusive offer to Plan My Luxe - Hurry Limited Seats and Availability - Selling Fast!!!
//             </p>
//           </div>
//           <div className="flex flex-col items-end">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="bg-[#25D366] text-white text-[13px] px-3 py-1 rounded font-semibold">Save {discountPercent}%</div>
//               <div className="relative text-[#595858] font-bold text-[18px]">
//                 {formatCurrency(deal.originalPrice)}
//                 <div className="absolute left-0 top-[50%] w-full h-[2px] bg-[#595858] rotate-[-10deg]"></div>
//               </div>
//             </div>
//             <div className="flex items-end">
//               <span className="text-[#CB2187] text-[18px] font-medium mr-1 mb-1">from</span>
//               <span className="text-[#CB2187] text-[44px] font-bold leading-none">{formatCurrency(deal.discountedPrice)}</span>
//               <span className="text-[#CB2187] text-[24px] mb-1">/pp</span>
//             </div>
//             <div className="text-[13px] text-[#595858] mt-1">
//               {Math.floor(deal.discountedPrice * 0.97)} + {Math.floor(deal.discountedPrice * 0.03)} (Local Tax)
//             </div>
//             <button onClick={handleBookNow} className="mt-4 w-[190px] h-[60px] rounded-lg text-white font-bold text-[18px]" style={{ background: 'linear-gradient(to bottom,#ED0791,#CB2187)' }}>
//               Enquiry Now
//             </button>
//           </div>
//         </div>

//         {/* IMAGE GALLERY */}
//         <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
//           <div>
//             <img src={deal.images[0] || 'https://via.placeholder.com/1200x500'} className="w-full h-[500px] object-cover rounded-xl" alt="main" />
//           </div>
//           <div className="grid grid-rows-2 gap-4">
//             <img src={deal.images[1] || deal.images[0]} className="w-full h-[242px] object-cover rounded-xl" alt="secondary" />
//             <div className="relative">
//               <img src={deal.images[2] || deal.images[0]} className="w-full h-[242px] object-cover rounded-xl" alt="third" />
//               <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg text-[#CB2187] font-semibold flex items-center gap-2">
//                 📷 More Images
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* SHARE BUTTON */}
//         <div className="flex justify-end mt-6">
//           <button className="bg-[#9F9F9F] hover:bg-[#7d7d7d] text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2">
//             🔗 Share This Offer
//           </button>
//         </div>

//         {/* CONTENT AREA (Left & Right Sidebar) */}
//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 mt-10">
//           {/* LEFT CONTENT */}
//           <div>
//             {renderStars(deal.rating)}
//             <h2 className="text-[34px] font-bold text-[#242F40] mt-2">{deal.hotelId.name}</h2>
//             <div className="flex items-center gap-2 text-[#595858] mt-3 font-semibold tracking-wide uppercase">
//               📍 {deal.hotelId.city}, {deal.hotelId.country}
//             </div>
//             <p className="text-[#595858] text-[17px] leading-[32px] mt-6">{deal.description}</p>

//             {/* ABOUT DEAL */}
//             <div className="mt-14">
//               <h2 className="text-[34px] font-bold text-[#242F40] mb-6">About the deal</h2>
//               <p className="text-[#595858] text-[17px] leading-[34px]">
//                 With this deal you can enjoy exclusive member prices at up to {discountPercent}% off high street or online travel agents as well as other inclusive extras.
//               </p>

//               {/* WHAT'S INCLUDED */}
//               <div className="mt-10">
//                 <h3 className="text-[28px] font-bold text-[#CB2187] mb-5">What's Included:</h3>
//                 <div className="space-y-4">
//                   {deal.includes.map((item, idx) => (
//                     <div key={idx} className="flex gap-4 items-start">
//                       <div className="text-[#CB2187] text-[20px]">✓</div>
//                       <p className="text-[#595858] text-[17px]">{item}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* EXCURSION */}
//               {deal.excursion && deal.excursion.included && (
//                 <div className="mt-14 bg-[#FFF5FB] border border-[#ffd5ef] rounded-2xl p-8">
//                   <h3 className="text-[30px] font-bold text-[#CB2187] mb-6">Excursion Included: {deal.excursion.title}</h3>
//                   <p className="text-[#595858] text-[17px] leading-[34px] whitespace-pre-line">{deal.excursion.description}</p>
//                 </div>
//               )}

//               {/* WHY WE LOVE THIS HOTEL */}
//               {deal.whyLove && deal.whyLove.length > 0 && (
//                 <div className="mt-14">
//                   <h3 className="text-[30px] font-bold text-[#242F40] mb-8">Why we love this hotel</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     {deal.whyLove.map((item, idx) => (
//                       <div key={idx} className="border rounded-xl p-5 shadow-sm bg-white">
//                         <h4 className="font-semibold text-[18px] text-[#242F40]">{item}</h4>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* DISCOVER SECTION */}
//               <div className="mt-16 bg-[#CB2187] rounded-3xl p-10 text-center">
//                 <h2 className="text-white text-[36px] font-bold">TOP TRENDING DEALS</h2>
//                 <p className="text-white text-[20px] mt-3">DISCOVER EXCLUSIVES</p>
//                 <button className="mt-8 bg-white text-[#CB2187] font-bold px-10 py-4 rounded-full text-[18px]" onClick={() => navigate('/deals')}>
//                   Click Here
//                 </button>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
//                   <div className="bg-white rounded-2xl p-6"><h4 className="font-bold text-[#242F40] text-[20px]">Call Us</h4><p className="text-[#595858] mt-2">Our team are available 24 hours, 7 days</p></div>
//                   <div className="bg-white rounded-2xl p-6"><h4 className="font-bold text-[#242F40] text-[20px]">Chat Online</h4><p className="text-[#595858] mt-2">Speak directly with our travel experts</p></div>
//                   <div className="bg-white rounded-2xl p-6"><h4 className="font-bold text-[#242F40] text-[20px]">Whatsapp</h4><p className="text-[#595858] mt-2">Message us anytime for instant support</p></div>
//                 </div>
//               </div>

//               {/* TABS */}
//               <div className="mt-16">
//                 <div className="flex flex-wrap gap-4 border-b pb-4">
//                   {['hotel', 'location', 'facilities', 'reviews', 'fineprint'].map((tab) => (
//                     <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-full font-semibold ${activeTab === tab ? 'bg-[#CB2187] text-white' : 'bg-gray-100'}`}>
//                       {tab === 'hotel' ? 'Hotel Details' : tab === 'location' ? 'Location' : tab === 'facilities' ? 'Facilities' : tab === 'reviews' ? 'Reviews' : 'Fine Print'}
//                     </button>
//                   ))}
//                 </div>

//                 {activeTab === 'hotel' && (
//                   <div className="mt-8"><h3 className="text-[28px] font-bold text-[#242F40] mb-5">Hotel Details</h3><p className="text-[#595858] text-[17px] leading-[34px]">{deal.hotelId.description || deal.description}</p></div>
//                 )}
//                 {activeTab === 'location' && (
//                   <div className="mt-8">
//                     <h3 className="text-[28px] font-bold text-[#242F40] mb-5">Location</h3>
//                     <div className="rounded-2xl overflow-hidden">
//                       <iframe src={`https://maps.google.com/maps?q=${deal.hotelId.latitude || deal.hotelId.city}&t=&z=13&ie=UTF8&iwloc=&output=embed`} className="w-full h-[400px] border-0 rounded-2xl" title="location map"></iframe>
//                     </div>
//                     <p className="mt-5 text-[#595858] text-[17px]">{deal.hotelId.address || `${deal.hotelId.city}, ${deal.hotelId.country}`}</p>
//                   </div>
//                 )}
//                 {activeTab === 'facilities' && (
//                   <div className="mt-8">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                       {(deal.hotelId.facilities || ['Free WiFi', 'Swimming Pool', 'Beach Access', 'Airport Transfer', 'Family Rooms', 'Restaurant']).map((fac, idx) => <div key={idx} className="border rounded-xl p-5">{fac}</div>)}
//                     </div>
//                   </div>
//                 )}
//                 {activeTab === 'reviews' && (
//                   <div className="mt-8 space-y-6">
//                     {deal.reviews && deal.reviews.length > 0 ? deal.reviews.map((rev, idx) => (
//                       <div key={idx} className="border rounded-2xl p-6">
//                         <div className="flex items-center justify-between"><h4 className="font-bold text-[20px]">Customer</h4><div className="text-[#CB2187]">{renderStars(rev.rating)}</div></div>
//                         <p className="mt-4 text-[#595858] leading-[32px]">{rev.comment}</p>
//                       </div>
//                     )) : <p>No reviews yet.</p>}
//                   </div>
//                 )}
//                 {activeTab === 'fineprint' && (
//                   <div className="mt-8"><p className="text-[#595858] text-[17px] leading-[34px]">Prices are subject to availability and may change without notice. Local taxes may apply. Terms and conditions apply.</p></div>
//                 )}
//               </div>

//               {/* SIMILAR HOTELS CAROUSEL */}
//               {similarHotels.length > 0 && (
//                 <div className="mt-16 w-full overflow-hidden">
//                   <h2 className="text-[32px] font-bold text-[#242F40] mb-8 text-center">Similar Hotels</h2>
//                   <div className="relative w-full">
//                     <div id="similarCarousel" className="carousel slide" data-bs-ride="carousel">
//                       <div className="carousel-inner">
//                         {Array.from({ length: Math.ceil(similarHotels.length / 4) }).map((_, slideIdx) => (
//                           <div key={slideIdx} className={`carousel-item ${slideIdx === 0 ? 'active' : ''}`}>
//                             <div className="row g-4 justify-content-center px-3 mx-0">
//                               {similarHotels.slice(slideIdx * 4, slideIdx * 4 + 4).map((hotel) => (
//                                 <div key={hotel._id} className="col-lg-3 col-md-6 col-12 px-1">
//                                   <div className="bg-white rounded-[20px] overflow-hidden shadow-md border border-[#ececec] h-[320px] flex flex-col">
//                                     <div className="w-full h-[140px] overflow-hidden flex-shrink-0"><img src={hotel.images?.[0] || 'https://via.placeholder.com/400x200'} className="w-full h-full object-cover" alt={hotel.name} /></div>
//                                     <div className="flex flex-col justify-between flex-1 p-[6px]">
//                                       <div className="pr-[2px]">
//                                         <div className="flex gap-1 text-[13px] text-[#CB2187] mb-[3px]">{renderStars(hotel.rating || 0)}</div>
//                                         <h3 className="text-[16px] font-bold text-[#242F40] mb-[2px] leading-tight truncate">{hotel.name}</h3>
//                                         <p className="text-[#777] text-[12px] mb-[3px] truncate">{hotel.city}, {hotel.country}</p>
//                                       </div>
//                                       <div className="mt-[2px]">
//                                         <div className="flex items-end gap-1 mb-[3px]"><span className="text-[#CB2187] text-[20px] font-bold">{formatCurrency(hotel.price || 299)}</span><span className="text-[#777] text-[11px]">/ person</span></div>
//                                         <button className="w-full h-[32px] rounded-full text-white font-bold text-[12px] border-0 mt-[1px]" style={{ background: 'linear-gradient(to bottom,#ED0791,#CB2187)' }}>View Deal</button>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                       <button className="carousel-control-prev" type="button" data-bs-target="#similarCarousel" data-bs-slide="prev"><span className="carousel-control-prev-icon bg-dark rounded-circle"></span></button>
//                       <button className="carousel-control-next" type="button" data-bs-target="#similarCarousel" data-bs-slide="next"><span className="carousel-control-next-icon bg-dark rounded-circle"></span></button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* RIGHT SIDEBAR (BOOKING FORM) - STICKY */}
//             <div className="relative">
//               <div className="sticky top-20 z-10">
//                 <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-lg" style={{ maxWidth: '420px', width: '100%' }}>
//                   <div className="grid grid-cols-3 gap-2 mb-3">
//                     <button className="bg-gradient-to-r from-[#ED0791] to-[#CB2187] text-white py-2 rounded-full text-xs font-bold">Call</button>
//                     <button className="border border-[#CB2187] text-[#CB2187] py-2 rounded-full text-xs font-bold">Chat</button>
//                     <button className="bg-[#25D366] text-white py-2 rounded-full text-xs font-bold">WhatsApp</button>
//                   </div>
//                   <h6 className="font-bold text-dark mb-3 flex items-center"><i className="fas fa-calendar-check text-red-500 mr-2"></i>Check Availability</h6>
//                   <form className="space-y-3">
//                     <div>
//                       <label className="text-muted small mb-1">Departure</label>
//                       <div className="flex items-center border rounded-lg overflow-hidden">
//                         <span className="bg-white px-2"><i className="fas fa-plane-departure text-red-500"></i></span>
//                         <select className="w-full p-2 text-sm focus:outline-none" value={departure} onChange={(e) => setDeparture(e.target.value)}>
//                           <option>Any London</option><option>Gatwick (LGW)</option><option>Heathrow (LHR)</option><option>Stansted (STN)</option><option>Luton (LTN)</option>
//                         </select>
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="text-muted small mb-1">Nights</label>
//                         <div className="flex items-center border rounded-lg overflow-hidden">
//                           <span className="bg-white px-2"><i className="fas fa-moon text-red-500"></i></span>
//                           <select className="w-full p-2 text-sm focus:outline-none" value={nights} onChange={(e) => setNights(e.target.value)}>
//                             <option>{deal.duration} Nights</option>
//                           </select>
//                         </div>
//                       </div>
//                       <div>
//                         <label className="text-muted small mb-1">Board</label>
//                         <div className="flex items-center border rounded-lg overflow-hidden">
//                           <span className="bg-white px-2"><i className="fas fa-utensils text-red-500"></i></span>
//                           <select className="w-full p-2 text-sm focus:outline-none" value={board} onChange={(e) => setBoard(e.target.value)}>
//                             <option>Bed And Breakfast</option><option>Room Only</option><option>Half Board</option><option>Full Board</option><option>All Inclusive</option>
//                           </select>
//                         </div>
//                       </div>
//                     </div>
//                     {/* Dynamic Calendar */}
//                     <div className="border rounded-lg overflow-hidden">
//                       <div className="bg-gray-50 p-2 flex justify-between items-center">
//                         <button className="text-sm"><i className="fas fa-chevron-left"></i></button>
//                         <span className="font-semibold">{new Date(deal.startDate).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
//                         <button className="text-sm"><i className="fas fa-chevron-right"></i></button>
//                       </div>
//                       <div className="p-2">
//                         <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-1">
//                           <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
//                         </div>
//                         <div className="grid grid-cols-7 gap-1">
//                           {calendarDays.map((day, idx) => (
//                             <div key={idx} onClick={() => setSelectedDate(day.day)} className={`text-center p-1 rounded cursor-pointer ${selectedDate === day.day ? 'bg-[#CB2187] text-white' : 'bg-white border'}`}>
//                               <div className="text-xs font-medium">{day.day}</div>
//                               <div className="text-[10px]">£{day.price}</div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="border rounded-lg p-2 flex justify-between items-center">
//                       <small className="text-danger"><i className="fas fa-plane mr-1"></i>Flight from</small>
//                       <small className="font-bold">{flightFrom}</small>
//                     </div>
//                   </form>
//                   <div className="border-t pt-3 mt-3">
//                     <div className="flex justify-between items-baseline mb-1">
//                       <small className="text-muted">Price per person</small>
//                       <div><span className="text-red-500 font-bold">from </span><span className="text-red-500 text-2xl font-bold">{formatCurrency(deal.discountedPrice)}</span></div>
//                     </div>
//                     <div className="flex justify-between text-xs text-muted mb-2">
//                       <span>(*Flights Included)</span>
//                       <span>{formatCurrency(deal.discountedPrice - Math.floor(deal.discountedPrice * 0.03))} + £{Math.floor(deal.discountedPrice * 0.03)} (Local Tax)</span>
//                     </div>
//                     <div className="flex justify-between text-xs">
//                       <span>Quote Ref:</span>
//                       <span className="font-bold uppercase">REF{deal._id.slice(-6)}</span>
//                     </div>
//                   </div>
//                   <button onClick={handleBookNow} className="w-full bg-gradient-to-r from-[#ED0791] to-[#CB2187] text-white py-3 rounded-full font-bold mt-3 shadow-lg">Enquiry Now</button>
//                   <div className="mt-3 p-2 bg-pink-50 border border-pink-200 rounded-lg text-center">
//                     <div className="text-muted text-xs uppercase font-bold">Trusted & Protected</div>
//                     <div className="flex justify-center gap-3 my-1">
//                       <span className="bg-gray-100 px-2 py-0.5 text-[10px] rounded">TTA</span>
//                       <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">ATOL</span>
//                     </div>
//                     <div className="text-xs">★★★★★ <span className="text-muted">Trustpilot <strong>4.9</strong> | 7,735 reviews</span></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* TRUST SECTION (static) */}
//       <section className="w-full bg-gradient-to-r from-[#f8f9fa] to-white py-16 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-12 px-4">
//             <h2 className="text-[36px] font-bold text-[#242F40] mb-4 leading-tight">Holidays you can trust....</h2>
//             <p className="text-[18px] text-[#242F40] font-semibold mb-8 max-w-2xl mx-auto leading-relaxed">We offer low deposits for as little as <span className="text-[#CB2187] font-bold">£29 per person</span></p>
//           </div>
//           <div className="flex flex-nowrap overflow-x-auto gap-4 pb-6 -mx-4 px-4 scrollbar-hide bg-white rounded-lg shadow-sm">
//             <div className="flex-shrink-0 w-[220px] bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#f5f5f5] flex flex-col items-center text-center min-h-[200px] justify-between">
//               <div className="w-14 h-14 bg-gradient-to-r from-[#ED0791] to-[#CB2187] rounded-lg flex items-center justify-center mb-4 shadow-lg hover:scale-110 transition-transform duration-300"><i className="fas fa-credit-card text-white text-lg"></i></div>
//               <div className="space-y-1"><h3 className="text-base font-bold text-[#242F40] leading-tight">Helpful spread the cost</h3><p className="text-[#CB2187] font-semibold text-sm">payment options</p></div>
//             </div>
//             <div className="flex-shrink-0 w-[220px] bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#f5f5f5] flex flex-col items-center text-center min-h-[200px] justify-between">
//               <div className="w-14 h-14 bg-gradient-to-r from-[#ED0791] to-[#CB2187] rounded-lg flex items-center justify-center mb-4 shadow-lg hover:scale-110 transition-transform duration-300"><i className="fas fa-headset text-white text-lg"></i></div>
//               <div className="space-y-1"><h3 className="text-base font-bold text-[#242F40] leading-tight">Our 24/7 support service -</h3><p className="text-[#CB2187] font-semibold text-sm">always here to help you.</p></div>
//             </div>
//             <div className="flex-shrink-0 w-[220px] bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#f5f5f5] flex flex-col items-center text-center min-h-[200px] justify-between">
//               <div className="w-14 h-14 bg-gradient-to-r from-[#ED0791] to-[#CB2187] rounded-lg flex items-center justify-center mb-4 shadow-lg hover:scale-110 transition-transform duration-300"><i className="fas fa-tags text-white text-lg"></i></div>
//               <div className="space-y-1"><h3 className="text-base font-bold text-[#242F40] leading-tight">We'll price match any product</h3><p className="text-[#CB2187] font-semibold text-sm">against any other retailer</p></div>
//             </div>
//             <div className="flex-shrink-0 w-[220px] bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#f5f5f5] flex flex-col items-center text-center min-h-[200px] justify-between">
//               <div className="w-14 h-14 bg-gradient-to-r from-[#ED0791] to-[#CB2187] rounded-lg flex items-center justify-center mb-4 shadow-lg hover:scale-110 transition-transform duration-300"><i className="fas fa-shield-alt text-white text-lg"></i></div>
//               <div className="space-y-1"><h3 className="text-base font-bold text-[#242F40] leading-tight">Enjoy peace of mind with</h3><p className="text-[#CB2187] font-semibold text-sm">fully bonded holidays</p></div>
//             </div>
//           </div>
//           <div className="flex items-center justify-center gap-9 mt-12">
//             <a href="#" className="text-[#CB2187] text-lg font-bold underline">Learn more about us</a>
//             <button className="px-10 py-4 bg-gradient-to-r from-[#ED0791] to-[#CB2187] hover:from-[#CB2187] hover:to-[#ED0791] text-white text-lg font-bold rounded-[8px] shadow-xl hover:shadow-2xl transition-all duration-300 border-0">chat us</button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-[#0f172a] text-white py-24">
//         <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
//           <div className="md:col-span-2"><div className="font-bold text-3xl tracking-tighter mb-6">PLANMYLUXE</div><p className="text-gray-400 text-sm max-w-sm font-medium leading-relaxed">Redefining luxury travel through spontaneous exploration and curated comfort since 2012.</p></div>
//           <div><h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-gray-500">Contact</h4><p className="text-sm font-bold mb-2">020 8000 0000</p><p className="text-sm text-gray-400">concierge@planmyluxe.co.uk</p></div>
//           <div><h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-gray-500">Quick Links</h4><ul className="space-y-3 text-sm text-gray-400 font-bold uppercase tracking-widest text-[10px]"><li><a href="#" className="hover:text-white transition-colors">T&Cs</a></li><li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li></ul></div>
//         </div>
//         <div className="max-w-[1100px] mx-auto px-6 mt-20 pt-12 border-t border-white/5 text-center text-[10px] font-bold text-gray-600 uppercase tracking-widest">© 2026 PlanMyLuxe Holiday Group. All rights reserved.</div>
//       </footer>
//     </div>
//   );
// };

// export default DealDetailPage;


// src/pages/user/DealDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { dealService } from '../../services/dealService';
import { hotelService } from '../../services/hotelService';
import { formatCurrency, formatDate } from '../../utils/format';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAppData } from '../../contexts/AppContext';

interface Deal {
  _id: string;
  title: string;
  description: string;
  hotelId: {
    _id: string;
    name: string;
    city: string;
    country: string;
    description?: string;
    facilities?: string[];
    address?: string;
    latitude?: number;
    longitude?: number;
    rating?: number;
  };
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  duration: number;
  startDate: string;
  endDate: string;
  includes: string[];
  excludes: string[];
  images: string[];
  rating: number;
  reviews?: Array<{ userId: string; rating: number; comment: string; createdAt: string }>;
  excursion?: { title: string; description: string; included: boolean };
  whyLove?: string[];
  maxBookings?: number;
  currentBookings?: number;
  status?: string;
}

const DealDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuth } = useAppData();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [similarHotels, setSimilarHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hotel');
  const [selectedImage, setSelectedImage] = useState(0);
  const [calendarDays, setCalendarDays] = useState<{ day: number; price: number }[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [departure, setDeparture] = useState('Any London');
  const [nights, setNights] = useState('');
  const [board, setBoard] = useState('Bed And Breakfast');
  const [flightFrom] = useState('Stansted (STN)');

  useEffect(() => {
    if (id) fetchDeal();
  }, [id]);

  const fetchDeal = async () => {
    setLoading(true);
    try {
      const res = await dealService.getDealById(id!);
      if (res.success && res.data) {
        setDeal(res.data);
        setNights(`${res.data.duration} Nights`);
        generateCalendarDays(res.data);
        if (res.data.hotelId?.city) {
          const similar = await hotelService.getAllHotels({ city: res.data.hotelId.city, limit: 4 });
          if (similar.success) setSimilarHotels(similar.data);
        }
      } else {
        toast.error('Deal not found');
        navigate('/deals');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load deal');
      navigate('/deals');
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarDays = (deal: Deal) => {
    const start = new Date(deal.startDate);
    const days = [];
    const pricePerDay = Math.round(deal.discountedPrice / deal.duration);
    for (let i = 0; i < deal.duration; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push({ day: date.getDate(), price: pricePerDay });
    }
    setCalendarDays(days);
    if (days.length) setSelectedDate(days[0].day);
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const empty = 5 - full;
    return (
      <div className="flex items-center gap-1">
        {[...Array(full)].map((_, i) => <span key={i} className="text-[#CB2187] text-xl">★</span>)}
        {[...Array(empty)].map((_, i) => <span key={i} className="text-gray-300 text-xl">★</span>)}
      </div>
    );
  };

  const handleBookNow = () => {
    if (!isAuth) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }
    navigate(`/booking/${deal?._id}`);
  };

  if (loading) return <LoadingSpinner />;
  if (!deal) return <div className="text-center py-20">Deal not found</div>;

  const discountPercent = Math.round(((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100);
  const spotsLeft = (deal.maxBookings || 0) - (deal.currentBookings || 0);
  const isAvailable = deal.status === 'active' && new Date(deal.endDate) > new Date();

  return (
    <div className="bg-white font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">
        {/* Top Title & Price */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
          <div className="max-w-[850px]">
            <h1 className="text-[32px] leading-[42px] font-bold text-[#CB2187]">{deal.title}</h1>
            <p className="text-[#595858] text-lg mt-2 font-medium">Exclusive offer – limited availability!</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#25D366] text-white text-xs px-3 py-1 rounded font-semibold">Save {discountPercent}%</div>
              <div className="relative text-[#595858] font-bold text-lg">
                {formatCurrency(deal.originalPrice)}
                <div className="absolute left-0 top-1/2 w-full h-[2px] bg-[#595858] rotate-[-10deg]"></div>
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-[#CB2187] text-lg font-medium mr-1 mb-1">from</span>
              <span className="text-[#CB2187] text-5xl font-bold leading-none">{formatCurrency(deal.discountedPrice)}</span>
              <span className="text-[#CB2187] text-2xl mb-1">/pp</span>
            </div>
            <div className="text-xs text-[#595858] mt-1">
              {Math.floor(deal.discountedPrice * 0.97)} + {Math.floor(deal.discountedPrice * 0.03)} (Local Tax)
            </div>
            <button onClick={handleBookNow} className="mt-4 w-[190px] h-[60px] rounded-lg text-white font-bold text-lg bg-gradient-to-b from-[#ED0791] to-[#CB2187]">
              Enquiry Now
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
          <img src={deal.images[0] || '/placeholder.jpg'} className="w-full h-[500px] object-cover rounded-xl" alt={deal.title} />
          <div className="grid grid-rows-2 gap-4">
            <img src={deal.images[1] || deal.images[0]} className="w-full h-[242px] object-cover rounded-xl" alt="" />
            <div className="relative">
              <img src={deal.images[2] || deal.images[0]} className="w-full h-[242px] object-cover rounded-xl" alt="" />
              <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg text-[#CB2187] font-semibold flex items-center gap-2">
                📷 More Images
              </button>
            </div>
          </div>
        </div>

        {/* Share Button */}
        <div className="flex justify-end mt-6">
          <button className="bg-[#9F9F9F] hover:bg-[#7d7d7d] text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2">
            🔗 Share This Offer
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 mt-10">
          {/* Left Content */}
          <div>
            {renderStars(deal.rating)}
            <h2 className="text-[34px] font-bold text-[#242F40] mt-2">{deal.hotelId.name}</h2>
            <div className="flex items-center gap-2 text-[#595858] mt-3 font-semibold uppercase">
              📍 {deal.hotelId.city}, {deal.hotelId.country}
            </div>
            <p className="text-[#595858] text-lg leading-8 mt-6">{deal.description}</p>

            {/* About Deal */}
            <div className="mt-14">
              <h2 className="text-[34px] font-bold text-[#242F40] mb-6">About the deal</h2>
              <p className="text-[#595858] text-lg leading-8">
                Enjoy exclusive member prices at up to {discountPercent}% off.
              </p>

              {/* What's Included */}
              <div className="mt-10">
                <h3 className="text-[28px] font-bold text-[#CB2187] mb-5">What's Included:</h3>
                <div className="space-y-4">
                  {deal.includes.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="text-[#CB2187] text-xl">✓</div>
                      <p className="text-[#595858] text-lg">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Excursion */}
              {deal.excursion?.included && (
                <div className="mt-14 bg-[#FFF5FB] border border-[#ffd5ef] rounded-2xl p-8">
                  <h3 className="text-[30px] font-bold text-[#CB2187] mb-6">Excursion: {deal.excursion.title}</h3>
                  <p className="text-[#595858] text-lg leading-8 whitespace-pre-line">{deal.excursion.description}</p>
                </div>
              )}

              {/* Why Love */}
              {deal.whyLove && deal.whyLove.length > 0 && (
                <div className="mt-14">
                  <h3 className="text-[30px] font-bold text-[#242F40] mb-8">Why we love this hotel</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {deal.whyLove.map((item, idx) => (
                      <div key={idx} className="border rounded-xl p-5 shadow-sm bg-white">
                        <h4 className="font-semibold text-lg text-[#242F40]">{item}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Discover Section */}
              <div className="mt-16 bg-[#CB2187] rounded-3xl p-10 text-center">
                <h2 className="text-white text-4xl font-bold">TOP TRENDING DEALS</h2>
                <p className="text-white text-xl mt-3">DISCOVER EXCLUSIVES</p>
                <button className="mt-8 bg-white text-[#CB2187] font-bold px-10 py-4 rounded-full text-lg" onClick={() => navigate('/deals')}>
                  Click Here
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
                  <div className="bg-white rounded-2xl p-6"><h4 className="font-bold text-[#242F40] text-xl">Call Us</h4><p className="text-[#595858] mt-2">24/7 support</p></div>
                  <div className="bg-white rounded-2xl p-6"><h4 className="font-bold text-[#242F40] text-xl">Chat Online</h4><p className="text-[#595858] mt-2">Live experts</p></div>
                  <div className="bg-white rounded-2xl p-6"><h4 className="font-bold text-[#242F40] text-xl">WhatsApp</h4><p className="text-[#595858] mt-2">Instant messaging</p></div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mt-16">
                <div className="flex flex-wrap gap-4 border-b pb-4">
                  {['hotel', 'location', 'facilities', 'reviews', 'fineprint'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-full font-semibold ${activeTab === tab ? 'bg-[#CB2187] text-white' : 'bg-gray-100'}`}>
                      {tab === 'hotel' ? 'Hotel Details' : tab === 'location' ? 'Location' : tab === 'facilities' ? 'Facilities' : tab === 'reviews' ? 'Reviews' : 'Fine Print'}
                    </button>
                  ))}
                </div>
                <div className="mt-8">
                  {activeTab === 'hotel' && <p className="text-[#595858] text-lg leading-8">{deal.hotelId.description || deal.description}</p>}
                  {activeTab === 'location' && (
                    <>
                      <div className="rounded-2xl overflow-hidden h-[400px]">
                        <iframe
                          src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(deal.hotelId.city + ', ' + deal.hotelId.country)}`}
                          className="w-full h-full border-0"
                          title="map"
                        ></iframe>
                      </div>
                      <p className="mt-5 text-[#595858] text-lg">{deal.hotelId.address || `${deal.hotelId.city}, ${deal.hotelId.country}`}</p>
                    </>
                  )}
                  {activeTab === 'facilities' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {(deal.hotelId.facilities || ['Free WiFi', 'Swimming Pool', 'Beach Access', 'Airport Transfer', 'Family Rooms', 'Restaurant']).map((fac, idx) => (
                        <div key={idx} className="border rounded-xl p-5">{fac}</div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                      {deal.reviews && deal.reviews.length > 0 ? deal.reviews.map((rev, idx) => (
                        <div key={idx} className="border rounded-2xl p-6">
                          <div className="flex justify-between items-center"><h4 className="font-bold text-xl">Customer</h4><div>{renderStars(rev.rating)}</div></div>
                          <p className="mt-4 text-[#595858] leading-8">{rev.comment}</p>
                        </div>
                      )) : <p>No reviews yet.</p>}
                    </div>
                  )}
                  {activeTab === 'fineprint' && <p className="text-[#595858] text-lg leading-8">Prices subject to availability. Terms apply.</p>}
                </div>
              </div>

              {/* Similar Hotels Carousel */}
              {similarHotels.length > 0 && (
                <div className="mt-16">
                  <h2 className="text-3xl font-bold text-[#242F40] mb-8 text-center">Similar Hotels</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {similarHotels.map(hotel => (
                      <div key={hotel._id} className="bg-white rounded-xl shadow-md overflow-hidden border">
                        <img src={hotel.images?.[0] || '/placeholder.jpg'} className="w-full h-40 object-cover" alt={hotel.name} />
                        <div className="p-4">
                          <h3 className="font-bold text-lg">{hotel.name}</h3>
                          <p className="text-gray-500 text-sm">{hotel.city}, {hotel.country}</p>
                          <button className="mt-3 w-full bg-gradient-to-r from-[#ED0791] to-[#CB2187] text-white py-2 rounded-full text-sm font-semibold">View Deal</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar (Booking Form) - Sticky */}
          <div className="relative">
            <div className="sticky top-20 z-10">
              <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-lg">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button className="bg-gradient-to-r from-[#ED0791] to-[#CB2187] text-white py-2 rounded-full text-xs font-bold">Call</button>
                  <button className="border border-[#CB2187] text-[#CB2187] py-2 rounded-full text-xs font-bold">Chat</button>
                  <button className="bg-[#25D366] text-white py-2 rounded-full text-xs font-bold">WhatsApp</button>
                </div>
                <h6 className="font-bold text-dark mb-3 flex items-center"><i className="fas fa-calendar-check text-red-500 mr-2"></i>Check Availability</h6>
                <div className="space-y-3">
                  <div>
                    <label className="text-muted small mb-1">Departure</label>
                    <select className="w-full border rounded-lg p-2 text-sm" value={departure} onChange={(e) => setDeparture(e.target.value)}>
                      <option>Any London</option><option>Gatwick (LGW)</option><option>Heathrow (LHR)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-muted small mb-1">Nights</label>
                      <select className="w-full border rounded-lg p-2 text-sm" value={nights} onChange={(e) => setNights(e.target.value)}>
                        <option>{deal.duration} Nights</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-muted small mb-1">Board</label>
                      <select className="w-full border rounded-lg p-2 text-sm" value={board} onChange={(e) => setBoard(e.target.value)}>
                        <option>Bed And Breakfast</option><option>Room Only</option><option>All Inclusive</option>
                      </select>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-2 flex justify-between items-center">
                      <button className="text-sm"><i className="fas fa-chevron-left"></i></button>
                      <span className="font-semibold">{new Date(deal.startDate).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                      <button className="text-sm"><i className="fas fa-chevron-right"></i></button>
                    </div>
                    <div className="p-2">
                      <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-1">
                        <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, idx) => (
                          <div key={idx} onClick={() => setSelectedDate(day.day)} className={`text-center p-1 rounded cursor-pointer ${selectedDate === day.day ? 'bg-[#CB2187] text-white' : 'bg-white border'}`}>
                            <div className="text-xs font-medium">{day.day}</div>
                            <div className="text-[10px]">£{day.price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-2 flex justify-between items-center">
                    <small className="text-danger"><i className="fas fa-plane mr-1"></i>Flight from</small>
                    <small className="font-bold">{flightFrom}</small>
                  </div>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-baseline mb-1">
                    <small className="text-muted">Price per person</small>
                    <div><span className="text-red-500 font-bold">from </span><span className="text-red-500 text-2xl font-bold">{formatCurrency(deal.discountedPrice)}</span></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted mb-2">
                    <span>(*Flights Included)</span>
                    <span>{formatCurrency(deal.discountedPrice - Math.floor(deal.discountedPrice * 0.03))} + £{Math.floor(deal.discountedPrice * 0.03)} (Local Tax)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Quote Ref:</span>
                    <span className="font-bold uppercase">REF{deal._id.slice(-6)}</span>
                  </div>
                </div>
                <button onClick={handleBookNow} className="w-full bg-gradient-to-r from-[#ED0791] to-[#CB2187] text-white py-3 rounded-full font-bold mt-3 shadow-lg">Enquiry Now</button>
                <div className="mt-3 p-2 bg-pink-50 border border-pink-200 rounded-lg text-center">
                  <div className="text-muted text-xs uppercase font-bold">Trusted & Protected</div>
                  <div className="flex justify-center gap-3 my-1">
                    <span className="bg-gray-100 px-2 py-0.5 text-[10px] rounded">TTA</span>
                    <span className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">ATOL</span>
                  </div>
                  <div className="text-xs">★★★★★ <span className="text-muted">Trustpilot <strong>4.9</strong> | 7,735 reviews</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer (same as before) */}
      <footer className="bg-[#0f172a] text-white py-24">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="md:col-span-2"><div className="font-bold text-3xl tracking-tighter mb-6">PLANMYLUXE</div><p className="text-gray-400 text-sm max-w-sm font-medium leading-relaxed">Redefining luxury travel.</p></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-gray-500">Contact</h4><p className="text-sm font-bold mb-2">020 8000 0000</p><p className="text-sm text-gray-400">concierge@planmyluxe.co.uk</p></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-gray-500">Quick Links</h4><ul className="space-y-3 text-sm text-gray-400 font-bold uppercase tracking-widest text-[10px]"><li><a href="#" className="hover:text-white">T&Cs</a></li><li><a href="#" className="hover:text-white">Privacy</a></li></ul></div>
        </div>
        <div className="max-w-[1100px] mx-auto px-6 mt-20 pt-12 border-t border-white/5 text-center text-[10px] font-bold text-gray-600 uppercase tracking-widest">© 2026 PlanMyLuxe Holiday Group.</div>
      </footer>
    </div>
  );
};

export default DealDetailPage;