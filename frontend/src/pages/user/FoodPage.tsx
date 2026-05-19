// import { useState, useEffect } from 'react';
// import { foodService } from '../../services/foodService';
// import type { FoodItem } from '../../types';
// import { FiSearch, FiStar, FiFilter } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const FoodPage = () => {
//   const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredFood, setFilteredFood] = useState<FoodItem[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>('all');

//   useEffect(() => {
//     fetchFoodItems();
//   }, []);

//   const fetchFoodItems = async () => {
//     setLoading(true);
//     try {
//       const response = await foodService.getAllFoodItems();
//       if (response.success && response.data) {
//         setFoodItems(response.data);
//         setFilteredFood(response.data);
//       } else {
//         toast.error('Failed to load food items');
//       }
//     } catch (error) {
//       console.error('Error fetching food items:', error);
//       toast.error('Failed to fetch food items');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (value: string) => {
//     setSearchTerm(value);
//     applyFilters(value, selectedCategory);
//   };

//   const handleCategoryFilter = (category: string) => {
//     setSelectedCategory(category);
//     applyFilters(searchTerm, category);
//   };

//   const applyFilters = (search: string, category: string) => {
//     let filtered = foodItems;

//     // Apply category filter
//     if (category !== 'all') {
//       filtered = filtered.filter(food => food.category === category);
//     }

//     // Apply search filter
//     if (search.trim() !== '') {
//       filtered = filtered.filter(food =>
//         food.name.toLowerCase().includes(search.toLowerCase()) ||
//         food.description?.toLowerCase().includes(search.toLowerCase()) ||
//         food.category?.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     setFilteredFood(filtered);
//   };

//   const categories = ['all', ...new Set(foodItems.map(item => item.category))];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading food items...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Search Header */}
//       <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
//         <div className="container mx-auto px-4">
//           <h1 className="text-4xl font-bold mb-6">Explore Our Food Menu</h1>
          
//           <div className="flex gap-4">
//             <div className="flex-1 relative">
//               <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by food name or description..."
//                 value={searchTerm}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Filters and Grid */}
//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           {/* Category Filter */}
//           <div className="mb-8">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//               <FiFilter className="w-5 h-5 mr-2" />
//               Filter by Category
//             </h3>
//             <div className="flex flex-wrap gap-3">
//               {categories.map((category) => (
//                 <button
//                   key={category}
//                   onClick={() => handleCategoryFilter(category)}
//                   className={`px-4 py-2 rounded-lg font-medium transition ${
//                     selectedCategory === category
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
//                   }`}
//                 >
//                   {category.charAt(0).toUpperCase() + category.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Food Items Grid */}
//           {filteredFood.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-gray-600 text-lg">No food items found</p>
//               <button
//                 onClick={() => {
//                   handleSearch('');
//                   handleCategoryFilter('all');
//                 }}
//                 className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredFood.map((food) => (
//                 <div
//                   key={food._id}
//                   className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//                 >
//                   <div className="relative h-48">
//                     <img
//                       src={food.images?.[0] || 'https://via.placeholder.com/400x300'}
//                       alt={food.name}
//                       className="w-full h-full object-cover"
//                     />
//                     <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 flex items-center gap-1">
//                       <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
//                       <span className="text-sm font-semibold">{food.rating || 'N/A'}</span>
//                     </div>
//                   </div>

//                   <div className="p-4">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">{food.name}</h3>
                    
//                     <p className="text-sm text-gray-500 mb-2">{food.category}</p>
                    
//                     <p className="text-gray-600 text-sm line-clamp-2 mb-3">{food.description}</p>

//                     <div className="flex items-center justify-between">
//                       <span className="text-xl font-bold text-blue-600">₹{food.price}</span>
//                       {food.prepTime && (
//                         <span className="text-xs text-gray-500">{food.prepTime} mins</span>
//                       )}
//                     </div>

//                     <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default FoodPage;

import { useState, useEffect } from 'react';
import { foodService } from '../../services/foodService';
import type { FoodItem } from '../../types';
import { FiSearch, FiStar, FiFilter, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const FoodPage = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFood, setFilteredFood] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    setLoading(true);
    try {
      const response = await foodService.getAllFoodItems();
      if (response.success && response.data) {
        setFoodItems(response.data);
        setFilteredFood(response.data);
      } else {
        toast.error('Failed to load food items');
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast.error('Failed to fetch food items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    applyFilters(searchTerm, category);
  };

  const applyFilters = (search: string, category: string) => {
    let filtered = foodItems;

    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(food => food.category === category);
    }

    // Apply search filter
    if (search.trim() !== '') {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(search.toLowerCase()) ||
        food.description?.toLowerCase().includes(search.toLowerCase()) ||
        food.category?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredFood(filtered);
  };

  const categories = ['all', ...new Set(foodItems.map(item => item.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading food items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Explore Our Food Menu</h1>
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by food name or description..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiFilter className="w-5 h-5 mr-2" />
              Filter by Category
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Food Items Grid */}
          {filteredFood.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No food items found</p>
              <button
                onClick={() => {
                  handleSearch('');
                  handleCategoryFilter('all');
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFood.map((food) => (
                <div
                  key={food._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={food.images?.[0] || 'https://via.placeholder.com/400x300'}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                      <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{food.rating}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{food.name}</h3>
                    
                    <p className="text-sm text-gray-500 mb-2">{food.category}</p>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{food.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-blue-600">₹{food.price}</span>
                      {(food as any)?.prepTime && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {(food as any).prepTime} mins
                        </span>
                      )}
                    </div>

                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FoodPage;