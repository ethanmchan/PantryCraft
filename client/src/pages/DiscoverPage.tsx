import React, { useState } from 'react';
import { Search, Filter, Heart, Clock, Users, Star, Bookmark, MessageCircle, TrendingUp, Flame } from 'lucide-react';

interface Recipe {
  id: number;
  title: string;
  author: string;
  image: string;
  likes: number;
  comments: number;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  tags: string[];
  isBookmarked: boolean;
  isLiked: boolean;
}

const DiscoverPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    'All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Quick & Easy'
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // Mock recipe data
  const recipes: Recipe[] = [
    {
      id: 1,
      title: "Creamy Mushroom Risotto",
      author: "Chef Maria",
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop",
      likes: 324,
      comments: 45,
      cookTime: "45 min",
      difficulty: "Medium",
      rating: 4.8,
      tags: ["Italian", "Vegetarian", "Comfort"],
      isBookmarked: false,
      isLiked: false
    },
    {
      id: 2,
      title: "Spicy Korean BBQ Tacos",
      author: "Kim Soo-jin",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      likes: 567,
      comments: 78,
      cookTime: "30 min",
      difficulty: "Easy",
      rating: 4.9,
      tags: ["Korean", "Mexican", "Fusion", "Spicy"],
      isBookmarked: true,
      isLiked: true
    },
    {
      id: 3,
      title: "Classic Chocolate Soufflé",
      author: "Pierre Dubois",
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
      likes: 189,
      comments: 23,
      cookTime: "60 min",
      difficulty: "Hard",
      rating: 4.6,
      tags: ["French", "Dessert", "Chocolate"],
      isBookmarked: false,
      isLiked: false
    },
    {
      id: 4,
      title: "Mediterranean Quinoa Bowl",
      author: "Elena Rodriguez",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      likes: 445,
      comments: 56,
      cookTime: "20 min",
      difficulty: "Easy",
      rating: 4.7,
      tags: ["Healthy", "Vegan", "Mediterranean"],
      isBookmarked: true,
      isLiked: false
    },
    {
      id: 5,
      title: "Japanese Ramen Bowl",
      author: "Takeshi Yamamoto",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
      likes: 678,
      comments: 92,
      cookTime: "90 min",
      difficulty: "Hard",
      rating: 4.9,
      tags: ["Japanese", "Comfort", "Noodles"],
      isBookmarked: false,
      isLiked: true
    },
    {
      id: 6,
      title: "Avocado Toast Variations",
      author: "Sarah Green",
      image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop",
      likes: 234,
      comments: 34,
      cookTime: "10 min",
      difficulty: "Easy",
      rating: 4.5,
      tags: ["Healthy", "Breakfast", "Quick"],
      isBookmarked: false,
      isLiked: false
    }
  ];

  const toggleLike = (id: number) => {
    console.log('Toggle like for recipe:', id);
  };

  const toggleBookmark = (id: number) => {
    console.log('Toggle bookmark for recipe:', id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Amazing Recipes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore thousands of recipes from our community of passionate home cooks and professional chefs
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md lg:max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for recipes, ingredients, or chefs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rated</option>
                <option value="time">Cook Time</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Trending</p>
                <p className="text-xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <Flame className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Hot Recipes</p>
                <p className="text-xl font-bold text-gray-900">567</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Active Chefs</p>
                <p className="text-xl font-bold text-gray-900">12.5K</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-xl font-bold text-gray-900">4.8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => toggleBookmark(recipe.id)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                      recipe.isBookmarked 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white/90 text-gray-600 hover:text-orange-500'
                    }`}
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleLike(recipe.id)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                      recipe.isLiked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/90 text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-4">by {recipe.author}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{recipe.cookTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      <span>{recipe.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                  {recipe.tags.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{recipe.tags.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{recipe.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{recipe.comments}</span>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 text-sm font-medium">
                    View Recipe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-white text-gray-700 px-8 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors font-medium">
            Load More Recipes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;