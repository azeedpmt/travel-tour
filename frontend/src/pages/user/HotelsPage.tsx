// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { hotelService } from '../../services/hotelService';
// import type { Hotel } from '../../types';
// import { FiSearch, FiMapPin, FiStar, FiPhone, FiMail } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const HotelsPage = () => {
//   const [hotels, setHotels] = useState<Hotel[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

//   useEffect(() => {
//     fetchHotels();
//   }, []);

//   const fetchHotels = async () => {
//     setLoading(true);
//     try {
//       const response = await hotelService.getAllHotels({ status: 'approved' });
//       if (response.success && response.data) {
//         setHotels(response.data);
//         setFilteredHotels(response.data);
//       } else {
//         toast.error('Failed to load hotels');
//       }
//     } catch (error) {
//       console.error('Error fetching hotels:', error);
//       toast.error('Failed to fetch hotels');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (value: string) => {
//     setSearchTerm(value);
//     if (value.trim() === '') {
//       setFilteredHotels(hotels);
//     } else {
//       const filtered = hotels.filter(hotel =>
//         hotel.name.toLowerCase().includes(value.toLowerCase()) ||
//         hotel.city.toLowerCase().includes(value.toLowerCase()) ||
//         hotel.state.toLowerCase().includes(value.toLowerCase()) ||
//         hotel.description?.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredHotels(filtered);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading hotels...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Search Header */}
//       <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
//         <div className="container mx-auto px-4">
//           <h1 className="text-4xl font-bold mb-6">Explore Our Hotels</h1>
          
//           <div className="flex gap-4">
//             <div className="flex-1 relative">
//               <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by hotel name, city, or state..."
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Hotels Grid */}
//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           {filteredHotels.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-gray-600 text-lg">No hotels found</p>
//               <button
//                 onClick={() => handleSearch('')}
//                 className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Clear Search
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredHotels.map((hotel) => (
//                 <Link
//                   key={hotel._id}
//                   to={`/hotel/${hotel._id}`}
//                   className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//                 >
//                   <div className="relative h-48">
//                     <img
//                       src={hotel.images?.[0] || 'https://via.placeholder.com/400x300'}
//                       alt={hotel.name}
//                       className="w-full h-full object-cover"
//                     />
//                     <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 flex items-center gap-1">
//                       <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
//                       <span className="text-sm font-semibold">{hotel.rating || 'N/A'}</span>
//                     </div>
//                   </div>

//                   <div className="p-4">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">{hotel.name}</h3>
                    
//                     <div className="flex items-center text-gray-600 text-sm mb-3">
//                       <FiMapPin className="w-4 h-4 mr-1" />
//                       <span>{hotel.city}, {hotel.state}</span>
//                     </div>

//                     <p className="text-gray-600 text-sm line-clamp-2 mb-3">{hotel.description}</p>

//                     <div className="space-y-2 text-sm">
//                       {hotel.phoneNumber && (
//                         <div className="flex items-center text-gray-600">
//                           <FiPhone className="w-4 h-4 mr-2" />
//                           <span>{hotel.phoneNumber}</span>
//                         </div>
//                       )}
//                       {hotel.email && (
//                         <div className="flex items-center text-gray-600">
//                           <FiMail className="w-4 h-4 mr-2" />
//                           <span className="truncate">{hotel.email}</span>
//                         </div>
//                       )}
//                     </div>

//                     <div className="mt-4 pt-4 border-t">
//                       <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
//                         View Details
//                       </button>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default HotelsPage;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotelService } from '../../services/hotelService';
import type { Hotel } from '../../types';
import { FiSearch, FiMapPin, FiStar, FiPhone, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

const HotelsPage = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await hotelService.getAllHotels({ status: 'approved' });
      if (response.success && response.data) {
        setHotels(response.data);
        setFilteredHotels(response.data);
      } else {
        toast.error('Failed to load hotels');
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast.error('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === '') {
      setFilteredHotels(hotels);
    } else {
      const filtered = hotels.filter(hotel =>
        hotel.name.toLowerCase().includes(value.toLowerCase()) ||
        hotel.city.toLowerCase().includes(value.toLowerCase()) ||
        hotel.state.toLowerCase().includes(value.toLowerCase()) ||
        hotel.description?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredHotels(filtered);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Explore Our Hotels</h1>
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by hotel name, city, or state..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredHotels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No hotels found</p>
              <button
                onClick={() => handleSearch('')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => {
                const hotelPhone = (hotel as any)?.phoneNumber || (hotel as any)?.phone;
                const hotelEmail = hotel.email;

                return (
                  <Link
                    key={hotel._id}
                    to={`/hotel/${hotel._id}`}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={hotel.images?.[0] || 'https://via.placeholder.com/400x300'}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                        <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">{hotel.rating || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{hotel.name}</h3>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <FiMapPin className="w-4 h-4 mr-1" />
                        <span>{hotel.city}, {hotel.state}</span>
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{hotel.description}</p>

                      <div className="space-y-2 text-sm">
                        {hotelPhone && (
                          <div className="flex items-center text-gray-600">
                            <FiPhone className="w-4 h-4 mr-2" />
                            <span>{hotelPhone}</span>
                          </div>
                        )}
                        {hotelEmail && (
                          <div className="flex items-center text-gray-600">
                            <FiMail className="w-4 h-4 mr-2" />
                            <span className="truncate">{hotelEmail}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HotelsPage;