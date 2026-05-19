

// import { Link, useNavigate } from 'react-router-dom';
// import { useAppData } from '../../contexts/AppContext';
// import { 
//     FiLogOut, 
//     FiMenu, 
//     FiX, 
//     FiHome, 
//     FiTag, 
//     FiBookOpen, 
//     FiMail, 
//     FiShield, 
//     FiUser,
//     FiSun,
//     FiMapPin
// } from 'react-icons/fi';
// import { useState,useEffect } from 'react';

// const Navbar = () => {
//     const { user, logout, isAuth, isAdmin } = useAppData();
//     const navigate = useNavigate();
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [offerTypes, setOfferTypes] = useState([]);
// const [holidayStyles, setHolidayStyles] = useState([]);

// useEffect(() => {
//   if (isAuth) {
//     fetch('/api/public/offer-types').then(res => res.json()).then(data => setOfferTypes(data.data));
//     fetch('/api/public/holiday-styles').then(res => res.json()).then(data => setHolidayStyles(data.data));
//   }
// }, [isAuth]);
//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };

//     const navLinks = [
//         { path:  '/home', label: 'Home', icon: FiHome },
//         { path: '/deals', label: 'Deals', icon: FiTag },
//         { path: '/my-bookings', label: 'My Bookings', icon: FiBookOpen },
//         { path: '/enquiry', label: 'Enquiry', icon: FiMail },
//     ];

//     const adminLinks = [
//         { path: '/admin', label: 'Dashboard' },
//         { path: '/admin/hotels', label: 'Hotels' },
//         { path: '/admin/deals', label: 'Deals' },
//         { path: '/admin/food', label: 'Food Items' },
//         { path: '/admin/bookings', label: 'Bookings' },
//     ];

//     return (
//         <nav className="bg-white shadow-lg sticky top-0 z-50">
//             <div className="container mx-auto px-4">
//                 <div className="flex justify-between items-center h-16">
//                     <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                         TourTravel
//                     </Link>

//                     {/* Desktop Menu */}
//                     <div className="hidden md:flex items-center space-x-6">
//                         {navLinks.map((link) => (
//                             <Link 
//                                 key={link.path} 
//                                 to={link.path} 
//                                 className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
//                             >
//                                 <link.icon className="w-4 h-4" />
//                                 <span>{link.label}</span>
//                             </Link>
//                         ))}

//                         {/* Deals & Offers */}
//                         {isAuth && (
//                             <div className="relative group">
//                                 <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
//                                     <FiTag className="w-4 h-4" />
//                                     <span>Deals & Offers</span>
//                                 </button>

//                                 <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg hidden group-hover:block border z-50">
//                                     <Link to="/offers/trending-top-deals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Trending Top Deals
//                                     </Link>

//                                     <Link to="/offers/last-minute-bargains" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Last-Minute Bargains
//                                     </Link>

//                                     <Link to="/offers/trending-multi-centres" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Trending Multi Centres
//                                     </Link>

//                                     <Link to="/offers/summer-2026-early-deals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Summer 2026 - Early Deals
//                                     </Link>

//                                     <Link to="/offers/5-star-luxury-for-less" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         5-Star Luxury - For Less
//                                     </Link>

//                                     <Link to="/offers/mitsis-hotel-group" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Mitsis Hotel Group Offers
//                                     </Link>

//                                     <div className="border-t my-1"></div>

//                                     <Link 
//                                         to="/deals" 
//                                         className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100"
//                                     >
//                                         All Our Deals & Offers →
//                                     </Link>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Holiday Styles */}
//                         {isAuth && (
//                             <div className="relative group">
//                                 <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
//                                     <FiSun className="w-4 h-4" />
//                                     <span>Holiday Styles</span>
//                                 </button>

//                                 <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg hidden group-hover:block border z-50">
//                                     <Link to="/holiday-style/all-inclusive" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         All Inclusive Holidays
//                                     </Link>

//                                     <Link to="/holiday-style/adults-only" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Adults Only Holidays
//                                     </Link>

//                                     <Link to="/holiday-style/city-breaks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         City Breaks
//                                     </Link>

//                                     <Link to="/holiday-style/beach-holidays" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Beach Holidays
//                                     </Link>

//                                     <Link to="/holiday-style/family-holidays" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Family Holidays
//                                     </Link>

//                                     <Link to="/holiday-style/multi-centre" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Multi Centre Holidays
//                                     </Link>

//                                     <div className="border-t my-1"></div>

//                                     <Link 
//                                         to="/holiday-styles" 
//                                         className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100"
//                                     >
//                                         Discover more →
//                                     </Link>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Destinations */}
//                         {isAuth && (
//                             <div className="relative group">
//                                 <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
//                                     <FiMapPin className="w-4 h-4" />
//                                     <span>Destinations</span>
//                                 </button>

//                                 <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg hidden group-hover:block border z-50 max-h-96 overflow-y-auto">
//                                     <Link to="/destination/european-cities" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         European Cities
//                                     </Link>

//                                     <Link to="/destination/mediterranean-beach" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Mediterranean Beach
//                                     </Link>

//                                     <Link to="/destination/tenerife" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Tenerife
//                                     </Link>

//                                     <Link to="/destination/gran-canaria" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Gran Canaria
//                                     </Link>

//                                     <Link to="/destination/lanzarote" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Lanzarote
//                                     </Link>

//                                     <Link to="/destination/fuerteventura" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Fuerteventura
//                                     </Link>

//                                     <Link to="/destination/mainland-spain" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Mainland Spain
//                                     </Link>

//                                     <Link to="/destination/costa-blanca" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Costa Blanca
//                                     </Link>

//                                     <Link to="/destination/costa-del-sol" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Costa del Sol
//                                     </Link>

//                                     <Link to="/destination/mallorca" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Mallorca
//                                     </Link>

//                                     <Link to="/destination/ibiza" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Ibiza
//                                     </Link>

//                                     <Link to="/destination/greece" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Greece
//                                     </Link>

//                                     <Link to="/destination/crete" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Crete
//                                     </Link>

//                                     <div className="border-t my-1"></div>

//                                     <Link 
//                                         to="/destinations" 
//                                         className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100"
//                                     >
//                                         All our destinations →
//                                     </Link>
//                                 </div>
//                             </div>
//                         )}
                        
//                         {/* Admin Menu */}
//                         {isAuth && isAdmin && (
//                             <div className="relative group">
//                                 <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
//                                     <FiShield className="w-4 h-4" />
//                                     <span>Admin</span>
//                                 </button>

//                                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block border">
//                                     {adminLinks.map((link) => (
//                                         <Link 
//                                             key={link.path} 
//                                             to={link.path} 
//                                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                         >
//                                             {link.label}
//                                         </Link>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {/* User Section */}
//                         {isAuth ? (
//                             <div className="flex items-center space-x-4">
//                                 <div className="flex items-center space-x-2">
//                                     {user?.avatar ? (
//                                         <img 
//                                             src={user.avatar} 
//                                             alt={user.name} 
//                                             className="w-8 h-8 rounded-full" 
//                                         />
//                                     ) : (
//                                         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                                             <FiUser className="w-4 h-4 text-blue-600" />
//                                         </div>
//                                     )}

//                                     <span className="text-gray-700">
//                                         Hi, {user?.name?.split(' ')[0] || 'User'}
//                                     </span>
//                                 </div>

//                                 <button 
//                                     onClick={handleLogout} 
//                                     className="flex items-center space-x-1 text-red-600 hover:text-red-700"
//                                 >
//                                     <FiLogOut className="w-4 h-4" />
//                                     <span>Logout</span>
//                                 </button>
//                             </div>
//                         ) : (
//                             <Link 
//                                 to="/login" 
//                                 className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
//                             >
//                                 Sign In with Google
//                             </Link>
//                         )}
//                     </div>

//                     {/* Mobile Menu Button */}
//                     <button 
//                         className="md:hidden text-gray-700" 
//                         onClick={() => setIsMenuOpen(!isMenuOpen)}
//                     >
//                         {isMenuOpen ? (
//                             <FiX className="w-6 h-6" />
//                         ) : (
//                             <FiMenu className="w-6 h-6" />
//                         )}
//                     </button>
//                 </div>

//                 {/* Mobile Menu */}
//                 {isMenuOpen && (
//                     <div className="md:hidden py-4 border-t">
//                         {navLinks.map((link) => (
//                             <Link
//                                 key={link.path}
//                                 to={link.path}
//                                 className="flex items-center space-x-2 py-2 text-gray-700"
//                                 onClick={() => setIsMenuOpen(false)}
//                             >
//                                 <link.icon className="w-4 h-4" />
//                                 <span>{link.label}</span>
//                             </Link>
//                         ))}

//                         {/* Mobile Extra Menus */}
//                         {isAuth && (
//                             <>
//                                 <Link to="/deals" className="block py-2 text-gray-700">
//                                     Deals & Offers
//                                 </Link>

//                                 <Link to="/holiday-styles" className="block py-2 text-gray-700">
//                                     Holiday Styles
//                                 </Link>

//                                 <Link to="/destinations" className="block py-2 text-gray-700">
//                                     Destinations
//                                 </Link>
//                             </>
//                         )}

//                         {isAuth && isAdmin && adminLinks.map((link) => (
//                             <Link
//                                 key={link.path}
//                                 to={link.path}
//                                 className="block py-2 pl-4 text-gray-700"
//                                 onClick={() => setIsMenuOpen(false)}
//                             >
//                                 {link.label}
//                             </Link>
//                         ))}

//                         {isAuth ? (
//                             <button 
//                                 onClick={handleLogout} 
//                                 className="flex items-center space-x-2 py-2 text-red-600 w-full"
//                             >
//                                 <FiLogOut className="w-4 h-4" />
//                                 <span>Logout</span>
//                             </button>
//                         ) : (
//                             <div className="pt-2">
//                                 <Link
//                                     to="/login"
//                                     className="block px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg"
//                                     onClick={() => setIsMenuOpen(false)}
//                                 >
//                                     Sign In with Google
//                                 </Link>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </nav>
//     );
// };

// export default Navbar;


//==========================
//with correct drop down
//===========================
// src/components/common/Navbar.tsx
// import { Link, useNavigate } from 'react-router-dom';
// import { useAppData } from '../../contexts/AppContext';
// import { destinationService } from '../../services/destinationService';
// import {
//     FiLogOut,
//     FiMenu,
//     FiX,
//     FiHome,
//     FiTag,
//     FiBookOpen,
//     FiMail,
//     FiShield,
//     FiUser,
//     FiSun,
//     FiMapPin
// } from 'react-icons/fi';
// import { useState, useEffect } from 'react';

// const Navbar = () => {
//     const { user, logout, isAuth, isAdmin } = useAppData();
//     const navigate = useNavigate();
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [destinations, setDestinations] = useState<any[]>([]);

//     useEffect(() => {
//         if (isAuth) {
//             fetchDestinations();
//         }
//     }, [isAuth]);

//     const fetchDestinations = async () => {
//         try {
//             const res = await destinationService.getAllDestinations();
//             if (res.success) setDestinations(res.data);
//         } catch (error) {
//             console.error('Failed to fetch destinations:', error);
//         }
//     };

//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };

//     const navLinks = [
//         { path: '/home', label: 'Home', icon: FiHome },
//         { path: '/deals', label: 'Deals', icon: FiTag },
//         { path: '/my-bookings', label: 'My Bookings', icon: FiBookOpen },
//         { path: '/enquiry', label: 'Enquiry', icon: FiMail },
//     ];

//     const adminLinks = [
//         { path: '/admin', label: 'Dashboard' },
//         { path: '/admin/hotels', label: 'Hotels' },
//         { path: '/admin/deals', label: 'Deals' },
//         { path: '/admin/food', label: 'Food Items' },
//         { path: '/admin/bookings', label: 'Bookings' },
//     ];

//     return (
//         <nav className="bg-white shadow-lg sticky top-0 z-50">
//             <div className="container mx-auto px-4">
//                 <div className="flex justify-between items-center h-16">
//                     <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                         TourTravel
//                     </Link>

//                     {/* Desktop Menu */}
//                     <div className="hidden md:flex items-center space-x-6">
//                         {navLinks.map((link) => (
//                             <Link
//                                 key={link.path}
//                                 to={link.path}
//                                 className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
//                             >
//                                 <link.icon className="w-4 h-4" />
//                                 <span>{link.label}</span>
//                             </Link>
//                         ))}

//                         {/* Deals & Offers */}
//                         {isAuth && (
//                             <div className="relative group">
//                                 <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
//                                     <FiTag className="w-4 h-4" />
//                                     <span>Deals & Offers</span>
//                                 </button>
//                                 <div className="absolute left-0 pt-1 w-56">
//                                     <div className="bg-white rounded-md shadow-lg border hidden group-hover:block z-50">
//                                         <div className="py-2">
//                                             <Link to="/offers/trending-top-deals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Trending Top Deals</Link>
//                                             <Link to="/offers/last-minute-bargains" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Last-Minute Bargains</Link>
//                                             <Link to="/offers/trending-multi-centres" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Trending Multi Centres</Link>
//                                             <Link to="/offers/summer-2026-early-deals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Summer 2026 - Early Deals</Link>
//                                             <Link to="/offers/5-star-luxury-for-less" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">5-Star Luxury - For Less</Link>
//                                             <Link to="/offers/mitsis-hotel-group" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mitsis Hotel Group Offers</Link>
//                                             <div className="border-t my-1"></div>
//                                             <Link to="/deals" className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100">All Our Deals & Offers →</Link>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Holiday Styles */}
//                         {isAuth && (
//                             <div className="relative group">
//                                 <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
//                                     <FiSun className="w-4 h-4" />
//                                     <span>Holiday Styles</span>
//                                 </button>
//                                 <div className="absolute left-0 pt-1 w-56">
//                                     <div className="bg-white rounded-md shadow-lg border hidden group-hover:block z-50">
//                                         <div className="py-2">
//                                             <Link to="/holiday-style/all-inclusive" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">All Inclusive Holidays</Link>
//                                             <Link to="/holiday-style/adults-only" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Adults Only Holidays</Link>
//                                             <Link to="/holiday-style/city-breaks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">City Breaks</Link>
//                                             <Link to="/holiday-style/beach-holidays" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Beach Holidays</Link>
//                                             <Link to="/holiday-style/family-holidays" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Family Holidays</Link>
//                                             <Link to="/holiday-style/multi-centre" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Multi Centre Holidays</Link>
//                                             <div className="border-t my-1"></div>
//                                             <Link to="/holiday-styles" className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100">Discover more →</Link>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Destinations (dynamic, multi‑column) */}
//                         {isAuth && (
//                             <div className="relative group">
//                                 <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
//                                     <FiMapPin className="w-4 h-4" />
//                                     <span>Destinations</span>
//                                 </button>
//                                 <div className="absolute left-0 pt-1 w-96">
//                                     <div className="bg-white rounded-md shadow-lg border hidden group-hover:block z-50 p-4">
//                                         {destinations.length > 0 ? (
//                                             <>
//                                                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                                                     {destinations.map((dest) => (
//                                                         <Link
//                                                             key={dest._id}
//                                                             to={`/destination/${dest.slug}`}
//                                                             className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
//                                                         >
//                                                             {dest.name}
//                                                         </Link>
//                                                     ))}
//                                                 </div>
//                                                 <div className="border-t my-2"></div>
//                                                 <Link
//                                                     to="/destinations"
//                                                     className="block px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100 rounded-md"
//                                                 >
//                                                     All our destinations →
//                                                 </Link>
//                                             </>
//                                         ) : (
//                                             <div className="text-center py-4 text-gray-500">No destinations yet</div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Admin Menu */}
//                         {isAuth && isAdmin && (
//                             <div className="relative group">
//                                 <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
//                                     <FiShield className="w-4 h-4" />
//                                     <span>Admin</span>
//                                 </button>
//                                 <div className="absolute right-0 pt-1 w-48">
//                                     <div className="bg-white rounded-md shadow-lg border hidden group-hover:block z-50">
//                                         <div className="py-2">
//                                             {adminLinks.map((link) => (
//                                                 <Link key={link.path} to={link.path} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                                     {link.label}
//                                                 </Link>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* User Section */}
//                         {isAuth ? (
//                             <div className="flex items-center space-x-4">
//                                 <div className="flex items-center space-x-2">
//                                     {user?.avatar ? (
//                                         <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
//                                     ) : (
//                                         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                                             <FiUser className="w-4 h-4 text-blue-600" />
//                                         </div>
//                                     )}
//                                     <span className="text-gray-700">Hi, {user?.name?.split(' ')[0] || 'User'}</span>
//                                 </div>
//                                 <button onClick={handleLogout} className="flex items-center space-x-1 text-red-600 hover:text-red-700">
//                                     <FiLogOut className="w-4 h-4" />
//                                     <span>Logout</span>
//                                 </button>
//                             </div>
//                         ) : (
//                             <Link to="/login" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition">
//                                 Sign In with Google
//                             </Link>
//                         )}
//                     </div>

//                     {/* Mobile Menu Toggle */}
//                     <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//                         {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
//                     </button>
//                 </div>

//                 {/* Mobile Menu */}
//                 {isMenuOpen && (
//                     <div className="md:hidden py-4 border-t">
//                         {navLinks.map((link) => (
//                             <Link key={link.path} to={link.path} className="flex items-center space-x-2 py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>
//                                 <link.icon className="w-4 h-4" />
//                                 <span>{link.label}</span>
//                             </Link>
//                         ))}
//                         {isAuth && (
//                             <>
//                                 <Link to="/deals" className="block py-2 text-gray-700">Deals & Offers</Link>
//                                 <Link to="/holiday-styles" className="block py-2 text-gray-700">Holiday Styles</Link>
//                                 <Link to="/destinations" className="block py-2 text-gray-700">Destinations</Link>
//                             </>
//                         )}
//                         {isAuth && isAdmin && adminLinks.map((link) => (
//                             <Link key={link.path} to={link.path} className="block py-2 pl-4 text-gray-700" onClick={() => setIsMenuOpen(false)}>
//                                 {link.label}
//                             </Link>
//                         ))}
//                         {isAuth ? (
//                             <button onClick={handleLogout} className="flex items-center space-x-2 py-2 text-red-600 w-full">
//                                 <FiLogOut className="w-4 h-4" />
//                                 <span>Logout</span>
//                             </button>
//                         ) : (
//                             <div className="pt-2">
//                                 <Link to="/login" className="block px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg" onClick={() => setIsMenuOpen(false)}>
//                                     Sign In with Google
//                                 </Link>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </nav>
//     );
// };

// export default Navbar;

//=================================
//
//====================================
// src/components/common/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAppData } from '../../contexts/AppContext';
import { destinationService } from '../../services/destinationService';
import {
    FiLogOut,
    FiMenu,
    FiX,
    FiHome,
    FiTag,
    FiBookOpen,
    FiMail,
    FiShield,
    FiUser,
    FiSun,
    FiMapPin
} from 'react-icons/fi';
import { useState, useEffect } from 'react';

// Demo destinations in case API fails (so dropdown always shows something)
const demoDestinations = [
    { _id: 'demo1', name: 'Croatia', slug: 'croatia' },
    { _id: 'demo2', name: 'Greece', slug: 'greece' },
    { _id: 'demo3', name: 'Maldives', slug: 'maldives' },
    { _id: 'demo4', name: 'Dubai', slug: 'dubai' },
];

const Navbar = () => {
    const { user, logout, isAuth, isAdmin } = useAppData();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [destinations, setDestinations] = useState<any[]>([]);
    const [loadingDestinations, setLoadingDestinations] = useState(true);

    useEffect(() => {
        if (isAuth) {
            fetchDestinations();
        } else {
            setLoadingDestinations(false);
        }
    }, [isAuth]);

    const fetchDestinations = async () => {
        try {
            const res = await destinationService.getPublicDestinations();
            if (res.success && res.data && res.data.length > 0) {
                setDestinations(res.data);
            } else {
                // Fallback to demo destinations
                console.warn('No destinations from API, using demo data');
                setDestinations(demoDestinations);
            }
        } catch (error) {
            console.error('Failed to fetch destinations, using demo data:', error);
            setDestinations(demoDestinations);
        } finally {
            setLoadingDestinations(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { path: '/home', label: 'Home', icon: FiHome },
        { path: '/deals', label: 'Deals', icon: FiTag },
        { path: '/my-bookings', label: 'My Bookings', icon: FiBookOpen },
        { path: '/enquiry', label: 'Enquiry', icon: FiMail },
    ];

    // const adminLinks = [
    //     { path: '/admin', label: 'Dashboard' },
    //     { path: '/admin/hotels', label: 'Hotels' },
    //     { path: '/admin/deals', label: 'Deals' },
    //     { path: '/admin/food', label: 'Food Items' },
    //     { path: '/admin/bookings', label: 'Bookings' },
    // ];

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        TourTravel
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
                            >
                                <link.icon className="w-4 h-4" />
                                <span>{link.label}</span>
                            </Link>
                        ))}

                        {/* Deals & Offers */}
                        {isAuth && (
                            <div className="relative group">
                                <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                                    <FiTag className="w-4 h-4" />
                                    <span>Deals & Offers</span>
                                </button>
                                <div className="absolute left-0 pt-1 w-56">
                                    <div className="bg-white rounded-md shadow-lg border hidden group-hover:block z-50">
                                        <div className="py-2">
                                            <Link to="/offers/trending-top-deals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Trending Top Deals</Link>
                                            <Link to="/offers/last-minute-bargains" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Last-Minute Bargains</Link>
                                            <Link to="/offers/trending-multi-centres" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Trending Multi Centres</Link>
                                            <Link to="/offers/summer-2026-early-deals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Summer 2026 - Early Deals</Link>
                                            <Link to="/offers/5-star-luxury-for-less" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">5-Star Luxury - For Less</Link>
                                            <Link to="/offers/mitsis-hotel-group" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mitsis Hotel Group Offers</Link>
                                            <div className="border-t my-1"></div>
                                            <Link to="/deals" className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100">All Our Deals & Offers →</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Holiday Styles */}
                        {isAuth && (
                            <div className="relative group">
                                <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                                    <FiSun className="w-4 h-4" />
                                    <span>Holiday Styles</span>
                                </button>
                                <div className="absolute left-0 pt-1 w-56">
                                    <div className="bg-white rounded-md shadow-lg border hidden group-hover:block z-50">
                                        <div className="py-2">
                                            <Link to="/holiday-style/all-inclusive" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">All Inclusive Holidays</Link>
                                            <Link to="/holiday-style/adults-only" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Adults Only Holidays</Link>
                                            <Link to="/holiday-style/city-breaks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">City Breaks</Link>
                                            <Link to="/holiday-style/beach-holidays" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Beach Holidays</Link>
                                            <Link to="/holiday-style/family-holidays" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Family Holidays</Link>
                                            <Link to="/holiday-style/multi-centre" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Multi Centre Holidays</Link>
                                            <div className="border-t my-1"></div>
                                            <Link to="/holiday-styles" className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100">Discover more →</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Destinations (dynamic, multi‑column) */}
                        {isAuth && destinations.length > 0 && (
                            <div className="relative group">
                                <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                                    <FiMapPin className="w-4 h-4" />
                                    <span>Destinations</span>
                                </button>
                                <div className="absolute left-0 pt-1 w-96">
                                    <div className="bg-white rounded-md shadow-lg border hidden group-hover:block z-50 p-4">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {destinations.map((dest) => (
                                                <Link
                                                    key={dest._id}
                                                    to={`/destination/${dest.slug}`}
                                                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    {dest.name}
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="border-t my-2"></div>
                                        <Link
                                            to="/destinations"
                                            className="block px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100 rounded-md"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            All our destinations →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Admin Menu */}
                        {isAuth && isAdmin && (
                            <div className="relative group">
                                <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                                    <FiShield className="w-4 h-4" />
                                    <span>Admin</span>
                                </button>
                                <div className="absolute right-0 pt-1 w-48">
                                    <div className="bg-white rounded-md shadow-lg border hidden group-hover:block z-50">
                                        <div className="py-2">
                                            {/* {adminLinks.map((link) => (
                                                <Link key={link.path} to={link.path} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    {link.label}
                                                </Link>
                                            ))} */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* User Section */}
                        {isAuth ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                    ) : (
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <FiUser className="w-4 h-4 text-blue-600" />
                                        </div>
                                    )}
                                    <span className="text-gray-700">Hi, {user?.name?.split(' ')[0] || 'User'}</span>
                                </div>
                                <button onClick={handleLogout} className="flex items-center space-x-1 text-red-600 hover:text-red-700">
                                    <FiLogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition">
                                Sign In with Google
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path} className="flex items-center space-x-2 py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>
                                <link.icon className="w-4 h-4" />
                                <span>{link.label}</span>
                            </Link>
                        ))}
                        {isAuth && (
                            <>
                                <Link to="/deals" className="block py-2 text-gray-700">Deals & Offers</Link>
                                <Link to="/holiday-styles" className="block py-2 text-gray-700">Holiday Styles</Link>
                                <Link to="/destinations" className="block py-2 text-gray-700">Destinations</Link>
                            </>
                        )}
                        {/* {isAuth && isAdmin && adminLinks.map((link) => (
                            <Link key={link.path} to={link.path} className="block py-2 pl-4 text-gray-700" onClick={() => setIsMenuOpen(false)}>
                                {link.label}
                            </Link>
                        ))} */}
                        {isAuth ? (
                            <button onClick={handleLogout} className="flex items-center space-x-2 py-2 text-red-600 w-full">
                                <FiLogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <div className="pt-2">
                                <Link to="/login" className="block px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg" onClick={() => setIsMenuOpen(false)}>
                                    Sign In with Google
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;