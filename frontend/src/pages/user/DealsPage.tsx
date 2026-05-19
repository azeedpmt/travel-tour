// import { useState, useEffect } from 'react';
// import { dealService } from '../../services/dealService';
// import type{ Deal } from '../../types';
// import DealCard from '../../components/user/DealCard';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

// const DealsPage = () => {
//   const [deals, setDeals] = useState<Deal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({
//     category: '',
//     minPrice: '',
//     maxPrice: '',
//     sort: '',
//   });

//   const categories = ['adventure', 'romantic', 'family', 'business', 'luxury'];

//   useEffect(() => {
//     fetchDeals();
//   }, [filters]);

//   const fetchDeals = async () => {
//     setLoading(true);
//     try {
//       const params: any = {};
//       if (filters.category) params.category = filters.category;
//       if (filters.minPrice) params.minPrice = Number(filters.minPrice);
//       if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
//       if (filters.sort) params.sort = filters.sort;
      
//       const response = await dealService.getAllDeals(params);
//       if (response.success) {
//         setDeals(response.data);
//       }
//     } catch (error) {
//       console.error('Failed to fetch deals:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = async () => {
//     if (searchTerm.trim()) {
//       setLoading(true);
//       try {
//         const response = await dealService.searchDeals(searchTerm);
//         if (response.success) {
//           setDeals(response.data);
//         }
//       } catch (error) {
//         console.error('Search failed:', error);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       fetchDeals();
//     }
//   };

//   const clearFilters = () => {
//     setFilters({
//       category: '',
//       minPrice: '',
//       maxPrice: '',
//       sort: '',
//     });
//     setSearchTerm('');
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">Travel Deals</h1>
//         <p className="text-gray-600">Discover amazing packages at unbeatable prices</p>
//       </div>

//       {/* Search and Filter Bar */}
//       <div className="flex flex-col md:flex-row gap-4 mb-8">
//         <div className="flex-1 relative">
//           <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search deals by title or description..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//             className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <button
//           onClick={() => setShowFilters(!showFilters)}
//           className="flex items-center justify-center space-x-2 px-6 py-3 border rounded-lg hover:bg-gray-50"
//         >
//           <FiFilter className="w-4 h-4" />
//           <span>Filters</span>
//         </button>
//         {(filters.category || filters.minPrice || filters.maxPrice || filters.sort) && (
//           <button
//             onClick={clearFilters}
//             className="flex items-center justify-center space-x-2 px-6 py-3 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
//           >
//             <FiX className="w-4 h-4" />
//             <span>Clear All</span>
//           </button>
//         )}
//       </div>

//       {/* Filter Panel */}
//       {showFilters && (
//         <div className="bg-gray-50 rounded-lg p-6 mb-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//               <select
//                 value={filters.category}
//                 onChange={(e) => setFilters({ ...filters, category: e.target.value })}
//                 className="w-full border rounded-lg px-3 py-2"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat} className="capitalize">
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
//               <input
//                 type="number"
//                 placeholder="Min Price"
//                 value={filters.minPrice}
//                 onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
//               <input
//                 type="number"
//                 placeholder="Max Price"
//                 value={filters.maxPrice}
//                 onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
//               <select
//                 value={filters.sort}
//                 onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
//                 className="w-full border rounded-lg px-3 py-2"
//               >
//                 <option value="">Default</option>
//                 <option value="price_asc">Price: Low to High</option>
//                 <option value="price_desc">Price: High to Low</option>
//                 <option value="rating">Rating: High to Low</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Deals Grid */}
//       {deals.length === 0 ? (
//         <div className="text-center py-16">
//           <p className="text-gray-500 text-lg">No deals found matching your criteria.</p>
//           <button onClick={clearFilters} className="mt-4 text-blue-600 hover:underline">
//             Clear all filters
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {deals.map((deal) => (
//             <DealCard key={deal._id} deal={deal} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DealsPage;

// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { dealService } from '../../services/dealService';
// import type { Deal, Hotel } from '../../types';
// import { FiSearch, FiFilter, FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi';
// import DealCard from '../../components/user/DealCard';
// import toast from 'react-hot-toast';

// const DealsPage = () => {
//   const [deals, setDeals] = useState<Deal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);

//   useEffect(() => {
//     fetchDeals();
//   }, []);

//   const fetchDeals = async () => {
//     setLoading(true);
//     try {
//       const response = await dealService.getAllDeals();
//       if (response.success && response.data) {
//         setDeals(response.data);
//         setFilteredDeals(response.data);
//       } else {
//         toast.error('Failed to load deals');
//       }
//     } catch (error) {
//       console.error('Error fetching deals:', error);
//       toast.error('Failed to fetch deals');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (value: string) => {
//     setSearchTerm(value);
//     if (value.trim() === '') {
//       setFilteredDeals(deals);
//     } else {
//       const filtered = deals.filter(deal => {
//         const hotel = deal.hotelId as Hotel;
//         return (
//           deal.title.toLowerCase().includes(value.toLowerCase()) ||
//           deal.description.toLowerCase().includes(value.toLowerCase()) ||
//           hotel?.name?.toLowerCase().includes(value.toLowerCase()) ||
//           hotel?.city?.toLowerCase().includes(value.toLowerCase())
//         );
//       });
//       setFilteredDeals(filtered);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading deals...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Search Header */}
//       <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
//         <div className="container mx-auto px-4">
//           <h1 className="text-4xl font-bold mb-6">Explore Amazing Travel Deals</h1>
          
//           <div className="flex gap-4">
//             <div className="flex-1 relative">
//               <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search deals by name, hotel, or city..."
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Deals Grid */}
//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           {filteredDeals.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-gray-600 text-lg">No deals found</p>
//               <button
//                 onClick={() => handleSearch('')}
//                 className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Clear Search
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredDeals.map((deal) => (
//                 <DealCard key={deal._id} deal={deal} />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default DealsPage;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dealService } from '../../services/dealService';
import type { Deal, Hotel } from '../../types';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import DealCard from '../../components/user/DealCard';
import toast from 'react-hot-toast';

const DealsPage = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);

  const fetchDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dealService.getAllDeals();
      if (response.success && response.data) {
        setDeals(response.data);
        setFilteredDeals(response.data);
        if (response.data.length === 0) {
          toast('No deals found', { icon: 'ℹ️' });
        }
      } else {
        throw new Error(response.error || 'Failed to load deals');
      }
    } catch (error: any) {
      console.error('Error fetching deals:', error);
      const errorMsg = 'Unable to load deals. The server is temporarily unavailable. Please try again later.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === '') {
      setFilteredDeals(deals);
    } else {
      const filtered = deals.filter(deal => {
        const hotel = deal.hotelId as Hotel;
        return (
          deal.title.toLowerCase().includes(value.toLowerCase()) ||
          deal.description.toLowerCase().includes(value.toLowerCase()) ||
          hotel?.name?.toLowerCase().includes(value.toLowerCase()) ||
          hotel?.city?.toLowerCase().includes(value.toLowerCase())
        );
      });
      setFilteredDeals(filtered);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Deals</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDeals}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FiRefreshCw className="w-5 h-5 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Explore Amazing Travel Deals</h1>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search deals by name, hotel, or city..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredDeals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No deals found</p>
              {searchTerm && (
                <button
                  onClick={() => handleSearch('')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal) => (
                <DealCard key={deal._id} deal={deal} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DealsPage;