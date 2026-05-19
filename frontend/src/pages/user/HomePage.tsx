// import { useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAppData } from "../../contexts/AppContext";
// import { FiTrendingUp, FiShield, FiHeadphones, FiStar, FiMapPin, FiSearch } from "react-icons/fi";
// import Footer from "../../components/common/Footer";

// const HomePage = () => {
//     const { user, isAuth, loading } = useAppData();
//     const navigate = useNavigate();

//     useEffect(() => {
//         console.log("HomePage - isAuth:", isAuth, "user:", user);
        
//         if (!loading && !isAuth) {
//             navigate('/login', { replace: true });
//         }
//     }, [isAuth, loading, navigate]);

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                     <p className="text-gray-600">Loading...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!isAuth) {
//         return null;
//     }

//     return (
//         <div>
//             {/* Hero Section */}
//             <section className="relative h-[500px] bg-gradient-to-r from-blue-600 to-indigo-600">
//                 <div className="absolute inset-0 bg-black opacity-40"></div>
//                 <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
//                     <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome {user?.name?.split(' ')[0]}!</h1>
//                     <p className="text-xl md:text-2xl mb-8">Discover Amazing Travel Deals</p>
                    
//                     <div className="w-full max-w-2xl">
//                         <div className="flex bg-white rounded-lg overflow-hidden shadow-lg">
//                             <div className="flex-1 relative">
//                                 <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search by city or destination..."
//                                     className="w-full pl-12 pr-4 py-4 text-gray-800 focus:outline-none"
//                                 />
//                             </div>
//                             <button className="bg-blue-600 px-8 py-4 hover:bg-blue-700 transition">
//                                 <FiSearch className="w-5 h-5 text-white" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Features */}
//             <section className="py-16">
//                 <div className="container mx-auto px-4">
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                         <div className="text-center">
//                             <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
//                                 <FiTrendingUp className="w-8 h-8 text-blue-600" />
//                             </div>
//                             <h3 className="font-semibold text-lg mb-2">Best Price Guarantee</h3>
//                             <p className="text-gray-600 text-sm">We offer the best prices on all deals</p>
//                         </div>
//                         <div className="text-center">
//                             <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
//                                 <FiShield className="w-8 h-8 text-green-600" />
//                             </div>
//                             <h3 className="font-semibold text-lg mb-2">Secure Booking</h3>
//                             <p className="text-gray-600 text-sm">Your payments are 100% secure</p>
//                         </div>
//                         <div className="text-center">
//                             <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
//                                 <FiHeadphones className="w-8 h-8 text-purple-600" />
//                             </div>
//                             <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
//                             <p className="text-gray-600 text-sm">We're here to help anytime</p>
//                         </div>
//                         <div className="text-center">
//                             <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
//                                 <FiStar className="w-8 h-8 text-orange-600" />
//                             </div>
//                             <h3 className="font-semibold text-lg mb-2">Verified Hotels</h3>
//                             <p className="text-gray-600 text-sm">All hotels are verified by us</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* CTA */}
//             <section className="py-16 bg-gray-100">
//                 <div className="container mx-auto px-4 text-center">
//                     <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready for Your Next Adventure?</h2>
//                     <p className="text-gray-600 mb-8">Explore our exclusive deals and start your journey today!</p>
//                     <Link to="/deals" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
//                         Browse Deals
//                     </Link>
//                 </div>
//             </section>

//             <Footer/>
//         </div>
//     );
// };

// export default HomePage;

//----------------------------------first cdeis above one-------------------------



//----------------------------second cde is below one----------------------------
// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAppData } from '../../contexts/AppContext';
// import { dealService } from '../../services/dealService';
// import { hotelService } from '../../services/hotelService';
// import { foodService } from '../../services/foodService';
// import type { Deal, Hotel, FoodItem } from '../../types';
// import { FiMapPin, FiSearch, FiTrendingUp, FiShield, FiHeadphones, FiStar } from 'react-icons/fi';
// import DealCard from '../../components/user/DealCard';
// import Footer from '../../components/common/Footer';
// import toast from 'react-hot-toast';

// const HomePage = () => {
//   const { user, isAuth, loading } = useAppData();
//   const navigate = useNavigate();
//   const [featuredDeals, setFeaturedDeals] = useState<Deal[]>([]);
//   const [topHotels, setTopHotels] = useState<Hotel[]>([]);
//   const [popularFood, setPopularFood] = useState<FoodItem[]>([]);
//   const [dealsLoading, setDealsLoading] = useState(true);

//   useEffect(() => {
//     console.log("HomePage - isAuth:", isAuth, "user:", user);
    
//     if (!loading && !isAuth) {
//       navigate('/login', { replace: true });
//     }
//   }, [isAuth, loading, navigate]);

//   // Fetch featured deals
//   useEffect(() => {
//     const fetchFeaturedDeals = async () => {
//       try {
//         const response = await dealService.getFeaturedDeals();
//         if (response.success && response.data) {
//           setFeaturedDeals(response.data.slice(0, 6));
//         }
//       } catch (error) {
//         console.error('Error fetching featured deals:', error);
//         toast.error('Failed to load deals');
//       }
//     };

//     const fetchTopHotels = async () => {
//       try {
//         const response = await hotelService.getAllHotels({ status: 'approved', limit: 6 });
//         if (response.success && response.data) {
//           setTopHotels(response.data.slice(0, 6));
//         }
//       } catch (error) {
//         console.error('Error fetching hotels:', error);
//       }
//     };

//     const fetchPopularFood = async () => {
//       try {
//         const response = await foodService.getPopularFoodItems(6);
//         if (response.success && response.data) {
//           setPopularFood(response.data);
//         }
//       } catch (error) {
//         console.error('Error fetching food items:', error);
//       } finally {
//         setDealsLoading(false);
//       }
//     };

//     fetchFeaturedDeals();
//     fetchTopHotels();
//     fetchPopularFood();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuth) {
//     return null;
//   }

//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="relative h-[500px] bg-gradient-to-r from-blue-600 to-indigo-600">
//         <div className="absolute inset-0 bg-black opacity-40"></div>
//         <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
//           <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome {user?.name?.split(' ')[0]}!</h1>
//           <p className="text-xl md:text-2xl mb-8">Discover Amazing Travel Deals, Hotels & Dining</p>
          
//           <div className="w-full max-w-2xl">
//             <div className="flex bg-white rounded-lg overflow-hidden shadow-lg">
//               <div className="flex-1 relative">
//                 <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by city or destination..."
//                   className="w-full pl-12 pr-4 py-4 text-gray-800 focus:outline-none"
//                 />
//               </div>
//               <button className="bg-blue-600 px-8 py-4 hover:bg-blue-700 transition">
//                 <FiSearch className="w-5 h-5 text-white" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
//                 <FiTrendingUp className="w-8 h-8 text-blue-600" />
//               </div>
//               <h3 className="font-semibold text-lg mb-2">Best Price Guarantee</h3>
//               <p className="text-gray-600 text-sm">We offer the best prices on all deals</p>
//             </div>
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
//                 <FiShield className="w-8 h-8 text-green-600" />
//               </div>
//               <h3 className="font-semibold text-lg mb-2">Secure Booking</h3>
//               <p className="text-gray-600 text-sm">Your payments are 100% secure</p>
//             </div>
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
//                 <FiHeadphones className="w-8 h-8 text-purple-600" />
//               </div>
//               <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
//               <p className="text-gray-600 text-sm">We're here to help anytime</p>
//             </div>
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
//                 <FiStar className="w-8 h-8 text-orange-600" />
//               </div>
//               <h3 className="font-semibold text-lg mb-2">Verified Hotels</h3>
//               <p className="text-gray-600 text-sm">All hotels are verified by us</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Featured Deals Section */}
//       {!dealsLoading && (
//         <>
//           <section className="py-16 bg-gray-100">
//             <div className="container mx-auto px-4">
//               <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-3xl font-bold text-gray-800">Featured Deals</h2>
//                 <Link to="/deals" className="text-blue-600 hover:text-blue-700 font-semibold">
//                   View All Deals →
//                 </Link>
//               </div>

//               {featuredDeals.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {featuredDeals.map((deal) => (
//                     <DealCard key={deal._id} deal={deal} />
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-12 text-gray-600">
//                   <p>No deals available at the moment</p>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* Top Hotels Section */}
//           <section className="py-16">
//             <div className="container mx-auto px-4">
//               <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-3xl font-bold text-gray-800">Top Hotels</h2>
//                 <Link to="/hotels" className="text-blue-600 hover:text-blue-700 font-semibold">
//                   View All Hotels →
//                 </Link>
//               </div>

//               {topHotels.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {topHotels.map((hotel) => (
//                     <Link
//                       key={hotel._id}
//                       to={`/hotel/${hotel._id}`}
//                       className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//                     >
//                       <div className="relative h-48">
//                         <img
//                           src={hotel.images?.[0] || 'https://via.placeholder.com/400x300'}
//                           alt={hotel.name}
//                           className="w-full h-full object-cover"
//                         />
//                         <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 flex items-center gap-1">
//                           <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
//                           <span className="text-sm font-semibold">{hotel.rating || 'N/A'}</span>
//                         </div>
//                       </div>
//                       <div className="p-4">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-2">{hotel.name}</h3>
//                         <p className="text-sm text-gray-600 flex items-center">
//                           <FiMapPin className="w-4 h-4 mr-1" />
//                           {hotel.city}, {hotel.state}
//                         </p>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-12 text-gray-600">
//                   <p>No hotels available at the moment</p>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* Popular Food Section */}
//           <section className="py-16 bg-gray-100">
//             <div className="container mx-auto px-4">
//               <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-3xl font-bold text-gray-800">Popular Food Items</h2>
//                 <Link to="/food" className="text-blue-600 hover:text-blue-700 font-semibold">
//                   View All Food →
//                 </Link>
//               </div>

//               {popularFood.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {popularFood.map((food) => (
//                     <div
//                       key={food._id}
//                       className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//                     >
//                       <div className="relative h-48">
//                         <img
//                           src={food.images?.[0] || 'https://via.placeholder.com/400x300'}
//                           alt={food.name}
//                           className="w-full h-full object-cover"
//                         />
//                         <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 flex items-center gap-1">
//                           <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
//                           <span className="text-sm font-semibold">{food.rating || 'N/A'}</span>
//                         </div>
//                       </div>
//                       <div className="p-4">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-2">{food.name}</h3>
//                         <p className="text-sm text-gray-500 mb-2">{food.category}</p>
//                         <span className="text-xl font-bold text-blue-600">₹{food.price}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-12 text-gray-600">
//                   <p>No food items available at the moment</p>
//                 </div>
//               )}
//             </div>
//           </section>
//         </>
//       )}

//       {/* CTA Section */}
//       <section className="py-16 bg-blue-50">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready for Your Next Adventure?</h2>
//           <p className="text-gray-600 mb-8">Explore our exclusive deals, hotels, and delicious food options!</p>
//           <div className="flex flex-wrap justify-center gap-4">
//             <Link to="/deals" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
//               Browse Deals
//             </Link>
//             <Link to="/hotels" className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
//               Explore Hotels
//             </Link>
//             <Link to="/food" className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
//               Order Food
//             </Link>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default HomePage;


//-----------------------------------------------------------------------
//-------------------third-one code below one-deepseek given---------------------------
// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAppData } from '../../contexts/AppContext';
// import { dealService } from '../../services/dealService';
// import { hotelService } from '../../services/hotelService';
// import { foodService } from '../../services/foodService';
// import type { Deal, Hotel, FoodItem } from '../../types';
// import { FiMapPin, FiSearch, FiTrendingUp, FiShield, FiHeadphones, FiStar } from 'react-icons/fi';
// import DealCard from '../../components/user/DealCard';
// import Footer from '../../components/common/Footer';
// import toast from 'react-hot-toast';

// const HomePage = () => {
//   const { user, isAuth, loading } = useAppData();
//   const navigate = useNavigate();
//   const [featuredDeals, setFeaturedDeals] = useState<Deal[]>([]);
//   const [topHotels, setTopHotels] = useState<Hotel[]>([]);
//   const [foodItems, setFoodItems] = useState<FoodItem[]>([]); // changed from popularFood
//   const [dealsLoading, setDealsLoading] = useState(true);

//   // Redirect if not authenticated
//   useEffect(() => {
//     if (!loading && !isAuth) {
//       navigate('/login', { replace: true });
//     }
//   }, [isAuth, loading, navigate]);

//   // Fetch all data
//   useEffect(() => {
//     const fetchData = async () => {
//       setDealsLoading(true);

//       // 1. Fetch top hotels (already working)
//       let hotels: Hotel[] = [];
//       try {
//         const response = await hotelService.getAllHotels({ status: 'approved', limit: 6 });
//         if (response.success && response.data) {
//           hotels = response.data.slice(0, 6);
//           setTopHotels(hotels);
//         }
//       } catch (error) {
//         console.error('Error fetching hotels:', error);
//         toast.error('Could not load hotels');
//       }

//       // 2. Fetch deals (fallback to all deals if featured fails)
//       try {
//         let deals: Deal[] = [];
//         try {
//           const featuredRes = await dealService.getFeaturedDeals();
//           if (featuredRes.success && featuredRes.data) {
//             deals = featuredRes.data;
//           }
//         } catch (e) {
//           console.warn('Featured deals failed, fetching all deals');
//           const allRes = await dealService.getAllDeals();
//           if (allRes.success && allRes.data) deals = allRes.data;
//         }
//         setFeaturedDeals(deals.slice(0, 6));
//       } catch (error) {
//         console.error('Error fetching deals:', error);
//         toast.error('Could not load deals');
//       }

//       // 3. Fetch food items by hotel ID (based on top hotels)
//       if (hotels.length > 0) {
//         try {
//           // Fetch menu for each hotel and aggregate unique items
//           const menuPromises = hotels.map(hotel =>
//             foodService.getMenuByHotel(hotel._id).catch(() => ({ success: false, data: {} }))
//           );
//           const menuResponses = await Promise.all(menuPromises);

//           const uniqueFoodMap = new Map<string, FoodItem>();
//           menuResponses.forEach(res => {
//             if (res.success && res.data) {
//               // res.data is grouped by category (object), so flatten categories
//               Object.values(res.data).forEach((items: any) => {
//                 items.forEach((item: FoodItem) => {
//                   if (!uniqueFoodMap.has(item._id)) {
//                     uniqueFoodMap.set(item._id, item);
//                   }
//                 });
//               });
//             }
//           });

//           const foodArray = Array.from(uniqueFoodMap.values());
//           setFoodItems(foodArray.slice(0, 6)); // show up to 6 food items
//         } catch (error) {
//           console.error('Error fetching food by hotel:', error);
//           toast.error('Could not load food items');
//         }
//       }

//       setDealsLoading(false);
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuth) return null;

//   return (
//     <div>
//       {/* Hero Section (unchanged) */}
//       <section className="relative h-[500px] bg-gradient-to-r from-blue-600 to-indigo-600">
//         <div className="absolute inset-0 bg-black opacity-40"></div>
//         <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
//           <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome {user?.name?.split(' ')[0]}!</h1>
//           <p className="text-xl md:text-2xl mb-8">Discover Amazing Travel Deals, Hotels & Dining</p>
//           <div className="w-full max-w-2xl">
//             <div className="flex bg-white rounded-lg overflow-hidden shadow-lg">
//               <div className="flex-1 relative">
//                 <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input type="text" placeholder="Search by city or destination..." className="w-full pl-12 pr-4 py-4 text-gray-800 focus:outline-none" />
//               </div>
//               <button className="bg-blue-600 px-8 py-4 hover:bg-blue-700 transition">
//                 <FiSearch className="w-5 h-5 text-white" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
//                 <FiTrendingUp className="w-8 h-8 text-blue-600" />
//               </div>
//               <h3 className="font-semibold text-lg mb-2">Best Price Guarantee</h3>
//               <p className="text-gray-600 text-sm">We offer the best prices on all deals</p>
//             </div>
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
//                 <FiShield className="w-8 h-8 text-green-600" />
//               </div>
//               <h3 className="font-semibold text-lg mb-2">Secure Booking</h3>
//               <p className="text-gray-600 text-sm">Your payments are 100% secure</p>
//             </div>
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
//                 <FiHeadphones className="w-8 h-8 text-purple-600" />
//               </div>
//               <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
//               <p className="text-gray-600 text-sm">We're here to help anytime</p>
//             </div>
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
//                 <FiStar className="w-8 h-8 text-orange-600" />
//               </div>
//               <h3 className="font-semibold text-lg mb-2">Verified Hotels</h3>
//               <p className="text-gray-600 text-sm">All hotels are verified by us</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Deals Section */}
//       {!dealsLoading && (
//         <section className="py-16 bg-gray-100">
//           <div className="container mx-auto px-4">
//             <div className="flex justify-between items-center mb-8">
//               <h2 className="text-3xl font-bold text-gray-800">Exclusive Deals</h2>
//               <Link to="/deals" className="text-blue-600 hover:text-blue-700 font-semibold">View All Deals →</Link>
//             </div>
//             {featuredDeals.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {featuredDeals.map((deal) => (
//                   <DealCard key={deal._id} deal={deal} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12 text-gray-600">
//                 <p>No deals available at the moment</p>
//               </div>
//             )}
//           </div>
//         </section>
//       )}

//       {/* Top Hotels Section */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-3xl font-bold text-gray-800">Top Hotels</h2>
//             <Link to="/hotels" className="text-blue-600 hover:text-blue-700 font-semibold">View All Hotels →</Link>
//           </div>
//           {topHotels.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {topHotels.map((hotel) => (
//                 <Link key={hotel._id} to={`/hotel/${hotel._id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//                   <div className="relative h-48">
//                     <img src={hotel.images?.[0] || 'https://via.placeholder.com/400x300'} alt={hotel.name} className="w-full h-full object-cover" />
//                     <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 flex items-center gap-1">
//                       <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
//                       <span className="text-sm font-semibold">{hotel.rating || 'N/A'}</span>
//                     </div>
//                   </div>
//                   <div className="p-4">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">{hotel.name}</h3>
//                     <p className="text-sm text-gray-600 flex items-center"><FiMapPin className="w-4 h-4 mr-1" />{hotel.city}, {hotel.state}</p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12 text-gray-600"><p>No hotels available at the moment</p></div>
//           )}
//         </div>
//       </section>

//       {/* Food Section – now fetched by hotel IDs */}
//       {!dealsLoading && (
//         <section className="py-16 bg-gray-100">
//           <div className="container mx-auto px-4">
//             <div className="flex justify-between items-center mb-8">
//               <h2 className="text-3xl font-bold text-gray-800">Delicious Food From Our Hotels</h2>
//               <Link to="/food" className="text-blue-600 hover:text-blue-700 font-semibold">View All Food →</Link>
//             </div>
//             {foodItems.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {foodItems.map((food) => (
//                   <div key={food._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//                     <div className="relative h-48">
//                       <img src={food.images?.[0] || 'https://via.placeholder.com/400x300'} alt={food.name} className="w-full h-full object-cover" />
//                       <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 flex items-center gap-1">
//                         <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
//                         <span className="text-sm font-semibold">{food.rating || 'N/A'}</span>
//                       </div>
//                     </div>
//                     <div className="p-4">
//                       <h3 className="text-lg font-semibold text-gray-800 mb-2">{food.name}</h3>
//                       <p className="text-sm text-gray-500 mb-2">{food.category}</p>
//                       <span className="text-xl font-bold text-blue-600">₹{food.price}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12 text-gray-600"><p>No food items available for our top hotels</p></div>
//             )}
//           </div>
//         </section>
//       )}

//       {/* CTA Section */}
//       <section className="py-16 bg-blue-50">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready for Your Next Adventure?</h2>
//           <p className="text-gray-600 mb-8">Explore our exclusive deals, hotels, and delicious food options!</p>
//           <div className="flex flex-wrap justify-center gap-4">
//             <Link to="/deals" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Browse Deals</Link>
//             <Link to="/hotels" className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Explore Hotels</Link>
//             <Link to="/food" className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Order Food</Link>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default HomePage;

// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAppData } from '../../contexts/AppContext';
// import { dealService } from '../../services/dealService';
// import { hotelService } from '../../services/hotelService';
// import { foodService } from '../../services/foodService';
// import type { Deal, Hotel, FoodItem } from '../../types';
// import { FiMapPin, FiSearch, FiTrendingUp, FiShield, FiHeadphones, FiStar } from 'react-icons/fi';
// import DealCard from '../../components/user/DealCard';
// import Footer from '../../components/common/Footer';
// import toast from 'react-hot-toast';

// const HomePage = () => {
//   const { user, isAuth, loading } = useAppData();
//   const navigate = useNavigate();
//   const [deals, setDeals] = useState<Deal[]>([]);        // stores deals based on top hotels
//   const [topHotels, setTopHotels] = useState<Hotel[]>([]);
//   const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
//   const [dealsLoading, setDealsLoading] = useState(true);

//   // Redirect if not authenticated
//   useEffect(() => {
//     if (!loading && !isAuth) {
//       navigate('/login', { replace: true });
//     }
//   }, [isAuth, loading, navigate]);

//   // Fetch all data
//   useEffect(() => {
//     const fetchData = async () => {
//       setDealsLoading(true);

//       // 1. Fetch top hotels
//       let hotels: Hotel[] = [];
//       try {
//         const response = await hotelService.getAllHotels({ status: 'approved', limit: 6 });
//         if (response.success && response.data) {
//           hotels = response.data.slice(0, 6);
//           setTopHotels(hotels);
//         }
//       } catch (error) {
//         console.error('Error fetching hotels:', error);
//         toast.error('Could not load hotels');
//       }

//       // 2. Fetch deals (based on top hotels, no limit)
//       try {
//         let allDeals: Deal[] = [];
//         try {
//           const featuredRes = await dealService.getFeaturedDeals();
//           if (featuredRes.success && featuredRes.data) {
//             allDeals = featuredRes.data;
//           }
//         } catch (e) {
//           console.warn('Featured deals failed, fetching all deals');
//           const allRes = await dealService.getAllDeals();
//           if (allRes.success && allRes.data) allDeals = allRes.data;
//         }

//         // Filter deals that belong to the top hotels (by hotelId)
//         const hotelIds = new Set(hotels.map(h => h._id));
//         let filteredDeals = allDeals.filter(deal => 
//           deal.hotelId && hotelIds.has(typeof deal.hotelId === 'string' ? deal.hotelId : deal.hotelId._id)
//         );

//         // If no deals match top hotels, show all deals (or keep empty)
//         if (filteredDeals.length === 0 && allDeals.length > 0) {
//           filteredDeals = allDeals;
//           toast('Showing all deals (none match your top hotels)', { icon: 'ℹ️' });
//         }
//         setDeals(filteredDeals); // no slice → no limit
//       } catch (error) {
//         console.error('Error fetching deals:', error);
//         toast.error('Could not load deals');
//       }

//       // 3. Fetch food items by hotel ID (based on top hotels)
//       if (hotels.length > 0) {
//         try {
//           const menuPromises = hotels.map(hotel =>
//             foodService.getMenuByHotel(hotel._id).catch(() => ({ success: false, data: {} }))
//           );
//           const menuResponses = await Promise.all(menuPromises);

//           const uniqueFoodMap = new Map<string, FoodItem>();
//           menuResponses.forEach(res => {
//             if (res.success && res.data) {
//               Object.values(res.data).forEach((items: any) => {
//                 items.forEach((item: FoodItem) => {
//                   if (!uniqueFoodMap.has(item._id)) {
//                     uniqueFoodMap.set(item._id, item);
//                   }
//                 });
//               });
//             }
//           });
//           const foodArray = Array.from(uniqueFoodMap.values());
//           setFoodItems(foodArray.slice(0, 6)); // keep limit 6 for food, as requested earlier
//         } catch (error) {
//           console.error('Error fetching food by hotel:', error);
//           toast.error('Could not load food items');
//         }
//       }

//       setDealsLoading(false);
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuth) return null;

//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="relative h-[500px] bg-gradient-to-r from-blue-600 to-indigo-600">
//         <div className="absolute inset-0 bg-black opacity-40"></div>
//         <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
//           <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome {user?.name?.split(' ')[0]}!</h1>
//           <p className="text-xl md:text-2xl mb-8">Discover Amazing Travel Deals, Hotels & Dining</p>
//           <div className="w-full max-w-2xl">
//             <div className="flex bg-white rounded-lg overflow-hidden shadow-lg">
//               <div className="flex-1 relative">
//                 <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input type="text" placeholder="Search by city or destination..." className="w-full pl-12 pr-4 py-4 text-gray-800 focus:outline-none" />
//               </div>
//               <button className="bg-blue-600 px-8 py-4 hover:bg-blue-700 transition">
//                 <FiSearch className="w-5 h-5 text-white" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
//                 <FiTrendingUp className="w-8 h-8 text-blue-600" />
//               </div>
//               <h3 className="font-semibold text-lg mb-2">Best Price Guarantee</h3>
//               <p className="text-gray-600 text-sm">We offer the best prices on all deals</p>
//             </div>
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
//                 <FiShield className="w-8 h-8 text-green-600" />
//               </div>
//               <h3 className="font-semibold text-lg mb-2">Secure Booking</h3>
//               <p className="text-gray-600 text-sm">Your payments are 100% secure</p>
//             </div>
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
//                 <FiHeadphones className="w-8 h-8 text-purple-600" />
//               </div>
//               <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
//               <p className="text-gray-600 text-sm">We're here to help anytime</p>
//             </div>
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
//                 <FiStar className="w-8 h-8 text-orange-600" />
//               </div>
//               <h3 className="font-semibold text-lg mb-2">Verified Hotels</h3>
//               <p className="text-gray-600 text-sm">All hotels are verified by us</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Deals Section – based on top hotels, no limit */}
//       {!dealsLoading && (
//         <section className="py-16 bg-gray-100">
//           <div className="container mx-auto px-4">
//             <div className="flex justify-between items-center mb-8">
//               <h2 className="text-3xl font-bold text-gray-800">Exclusive Deals for You</h2>
//               <Link to="/deals" className="text-blue-600 hover:text-blue-700 font-semibold">View All Deals →</Link>
//             </div>
//             {deals.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {deals.map((deal) => (
//                   <DealCard key={deal._id} deal={deal} />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12 text-gray-600">
//                 <p>No deals available for our top hotels</p>
//               </div>
//             )}
//           </div>
//         </section>
//       )}

//       {/* Top Hotels Section */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-3xl font-bold text-gray-800">Top Hotels</h2>
//             <Link to="/hotels" className="text-blue-600 hover:text-blue-700 font-semibold">View All Hotels →</Link>
//           </div>
//           {topHotels.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {topHotels.map((hotel) => (
//                 <Link key={hotel._id} to={`/hotel/${hotel._id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//                   <div className="relative h-48">
//                     <img src={hotel.images?.[0] || 'https://via.placeholder.com/400x300'} alt={hotel.name} className="w-full h-full object-cover" />
//                     <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 flex items-center gap-1">
//                       <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
//                       <span className="text-sm font-semibold">{hotel.rating || 'N/A'}</span>
//                     </div>
//                   </div>
//                   <div className="p-4">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">{hotel.name}</h3>
//                     <p className="text-sm text-gray-600 flex items-center"><FiMapPin className="w-4 h-4 mr-1" />{hotel.city}, {hotel.state}</p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12 text-gray-600"><p>No hotels available at the moment</p></div>
//           )}
//         </div>
//       </section>

//       {/* Food Section – from top hotels */}
//       {!dealsLoading && (
//         <section className="py-16 bg-gray-100">
//           <div className="container mx-auto px-4">
//             <div className="flex justify-between items-center mb-8">
//               <h2 className="text-3xl font-bold text-gray-800">Delicious Food From Our Hotels</h2>
//               <Link to="/food" className="text-blue-600 hover:text-blue-700 font-semibold">View All Food →</Link>
//             </div>
//             {foodItems.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {foodItems.map((food) => (
//                   <div key={food._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//                     <div className="relative h-48">
//                       <img src={food.images?.[0] || 'https://via.placeholder.com/400x300'} alt={food.name} className="w-full h-full object-cover" />
//                       <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 flex items-center gap-1">
//                         <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
//                         <span className="text-sm font-semibold">{food.rating || 'N/A'}</span>
//                       </div>
//                     </div>
//                     <div className="p-4">
//                       <h3 className="text-lg font-semibold text-gray-800 mb-2">{food.name}</h3>
//                       <p className="text-sm text-gray-500 mb-2">{food.category}</p>
//                       <span className="text-xl font-bold text-blue-600">₹{food.price}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12 text-gray-600"><p>No food items available for our top hotels</p></div>
//             )}
//           </div>
//         </section>
//       )}

//       {/* CTA Section */}
//       <section className="py-16 bg-blue-50">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready for Your Next Adventure?</h2>
//           <p className="text-gray-600 mb-8">Explore our exclusive deals, hotels, and delicious food options!</p>
//           <div className="flex flex-wrap justify-center gap-4">
//             <Link to="/deals" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Browse Deals</Link>
//             <Link to="/hotels" className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Explore Hotels</Link>
//             <Link to="/food" className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Order Food</Link>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default HomePage;


import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppData } from '../../contexts/AppContext';
import { dealService } from '../../services/dealService';
import { hotelService } from '../../services/hotelService';
import { foodService } from '../../services/foodService';
import type { Deal, Hotel, FoodItem } from '../../types';
import { FiMapPin, FiSearch, FiTrendingUp, FiShield, FiHeadphones, FiStar } from 'react-icons/fi';
import DealCard from '../../components/user/DealCard';
import Footer from '../../components/common/Footer';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { user, isAuth, loading } = useAppData();
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [topHotels, setTopHotels] = useState<Hotel[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [dealsLoading, setDealsLoading] = useState(true);
  const [dealsError, setDealsError] = useState(false);   // 👈 NEW STATE

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuth) {
      navigate('/login', { replace: true });
    }
  }, [isAuth, loading, navigate]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setDealsLoading(true);
      setDealsError(false);

      // 1. Fetch top hotels
      let hotels: Hotel[] = [];
      try {
        const response = await hotelService.getAllHotels({ status: 'approved', limit: 6 });
        if (response.success && response.data) {
          hotels = response.data.slice(0, 6);
          setTopHotels(hotels);
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
        toast.error('Could not load hotels');
      }

      // 2. Fetch deals (with full error handling)
      let filteredDeals: Deal[] = [];
      let dealsErrorOccurred = false;

      try {
        let allDeals: Deal[] = [];
        try {
          const featuredRes = await dealService.getFeaturedDeals();
          if (featuredRes.success && featuredRes.data) {
            allDeals = featuredRes.data;
          }
        } catch (e) {
          console.warn('Featured deals failed, trying all deals endpoint');
          try {
            const allRes = await dealService.getAllDeals();
            if (allRes.success && allRes.data) {
              allDeals = allRes.data;
            } else {
              throw new Error('All deals endpoint returned no data');
            }
          } catch (err) {
            console.error('All deals endpoint also failed:', err);
            dealsErrorOccurred = true;
          }
        }

        // ✅ FIX: show all active deals up to 6 — removed the hotel-ID cross-filter
        // that was hiding deals whose hotel wasn't in the top-6 slice
        if (!dealsErrorOccurred && allDeals.length > 0) {
          filteredDeals = allDeals.slice(0, 6);
        } else if (dealsErrorOccurred) {
          filteredDeals = [];
        }
      } catch (error) {
        console.error('Unexpected error fetching deals:', error);
        dealsErrorOccurred = true;
      }

      setDeals(filteredDeals);
      setDealsError(dealsErrorOccurred);

      // 3. Fetch food items by hotel ID (based on top hotels)
      if (hotels.length > 0) {
        try {
          const menuPromises = hotels.map(hotel =>
            foodService.getMenuByHotel(hotel._id).catch(() => ({ success: false, data: {} }))
          );
          const menuResponses = await Promise.all(menuPromises);

          const uniqueFoodMap = new Map<string, FoodItem>();
          menuResponses.forEach(res => {
            if (res.success && res.data) {
              Object.values(res.data).forEach((items: any) => {
                items.forEach((item: FoodItem) => {
                  if (!uniqueFoodMap.has(item._id)) {
                    uniqueFoodMap.set(item._id, item);
                  }
                });
              });
            }
          });
          const foodArray = Array.from(uniqueFoodMap.values());
          setFoodItems(foodArray.slice(0, 6));
        } catch (error) {
          console.error('Error fetching food by hotel:', error);
          toast.error('Could not load food items');
        }
      }

      setDealsLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) return null;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome {user?.name?.split(' ')[0]}!</h1>
          <p className="text-xl md:text-2xl mb-8">Discover Amazing Travel Deals, Hotels & Dining</p>
          <div className="w-full max-w-2xl">
            <div className="flex bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="flex-1 relative">
                <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search by city or destination..." className="w-full pl-12 pr-4 py-4 text-gray-800 focus:outline-none" />
              </div>
              <button className="bg-blue-600 px-8 py-4 hover:bg-blue-700 transition">
                <FiSearch className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <FiTrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Best Price Guarantee</h3>
              <p className="text-gray-600 text-sm">We offer the best prices on all deals</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <FiShield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Booking</h3>
              <p className="text-gray-600 text-sm">Your payments are 100% secure</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <FiHeadphones className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">We're here to help anytime</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <FiStar className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Verified Hotels</h3>
              <p className="text-gray-600 text-sm">All hotels are verified by us</p>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Section – with error handling */}
      {!dealsLoading && (
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Exclusive Deals for You</h2>
              <Link to="/deals" className="text-blue-600 hover:text-blue-700 font-semibold">View All Deals →</Link>
            </div>
            {dealsError ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-5xl mb-3">⚠️</div>
                <p className="text-gray-700 font-medium">Unable to load deals at the moment.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : deals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map((deal) => (
                  <DealCard key={deal._id} deal={deal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-600">
                <p>No deals available at the moment</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Top Hotels Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Top Hotels</h2>
            <Link to="/hotels" className="text-blue-600 hover:text-blue-700 font-semibold">View All Hotels →</Link>
          </div>
          {topHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topHotels.map((hotel) => (
                <Link key={hotel._id} to={`/hotel/${hotel._id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img src={hotel.images?.[0] || 'https://via.placeholder.com/400x300'} alt={hotel.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                      <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{hotel.rating || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{hotel.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center"><FiMapPin className="w-4 h-4 mr-1" />{hotel.city}, {hotel.state}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600"><p>No hotels available at the moment</p></div>
          )}
        </div>
      </section>

      {/* Food Section – from top hotels */}
      {!dealsLoading && (
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Delicious Food From Our Hotels</h2>
              <Link to="/food" className="text-blue-600 hover:text-blue-700 font-semibold">View All Food →</Link>
            </div>
            {foodItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {foodItems.map((food) => (
                  <div key={food._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <img src={food.images?.[0] || 'https://via.placeholder.com/400x300'} alt={food.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                        <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">{food.rating || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{food.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{food.category}</p>
                      <span className="text-xl font-bold text-blue-600">₹{food.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-600"><p>No food items available for our top hotels</p></div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-gray-600 mb-8">Explore our exclusive deals, hotels, and delicious food options!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/deals" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Browse Deals</Link>
            <Link to="/hotels" className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Explore Hotels</Link>
            <Link to="/food" className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Order Food</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;