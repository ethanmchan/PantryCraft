import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Heart, Bookmark, MessageCircle, Star, TrendingUp, Users, ChefHat, Sparkles } from 'lucide-react';

const Homepage = () => {
  const [ingredients, setIngredients] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for featured recipes
  const featuredRecipes = [
    {
      id: 1,
      title: "Creamy Garlic Pasta",
      author: "Gordon Ramsay",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
      likes: 245,
      comments: 18,
      cookTime: "25 min",
      difficulty: "Easy",
      tags: ["pasta", "garlic", "cream"]
    },
    {
      id: 2,
      title: "Mediterranean Bowl",
      author: "Jamie Oliver",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      likes: 189,
      comments: 12,
      cookTime: "15 min",
      difficulty: "Easy",
      tags: ["healthy", "vegetables", "quinoa"]
    },
    {
      id: 3,
      title: "Spicy Thai Curry",
      author: "Wolf Gang Puck",
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
      likes: 312,
      comments: 24,
      cookTime: "35 min",
      difficulty: "Medium",
      tags: ["thai", "spicy", "coconut"]
    }
  ];

  const trendingIngredients = ["Avocado", "Quinoa", "Salmon", "Sweet Potato", "Kale", "Chickpeas"];

  const handleGenerateRecipe = () => {
    if (ingredients.trim()) {
      // This would typically navigate to results or trigger recipe generation
      console.log('Generating recipe with ingredients:', ingredients);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">{/* Remove the navigation since it's now in a separate component */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Turn Your 
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Ingredients</span>
              <br />
              Into Magic
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Discover amazing recipes based on what's in your pantry. Join our community of food lovers sharing, creating, and exploring together.
            </p>

            {/* Ingredient Input */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your ingredients (e.g., chicken, rice, broccoli)..."
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none shadow-lg"
                />
                <button
                  onClick={handleGenerateRecipe}
                  className="absolute right-2 top-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 shadow-md"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Generate</span>
                </button>
              </div>
            </div>

            {/* Trending Ingredients */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <span className="text-gray-600 font-medium">Trending:</span>
              {trendingIngredients.map((ingredient, index) => (
                <button
                  key={index}
                  className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 hover:bg-orange-100 hover:text-orange-700 transition-colors shadow-sm border border-orange-100"
                >
                  {ingredient}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex justify-center space-x-12 text-center">
              <div>
                <div className="text-3xl font-bold text-orange-600">50K+</div>
                <div className="text-gray-600">Recipes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">25K+</div>
                <div className="text-gray-600">Cooks</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">1M+</div>
                <div className="text-gray-600">Meals Created</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Recipes</h2>
            <p className="text-xl text-gray-600">Discover what our community is cooking today</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <div className="relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors cursor-pointer" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
                  <p className="text-gray-600 mb-4">by {recipe.author}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{recipe.cookTime}</span>
                      <span>{recipe.difficulty}</span>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
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
                    <button className="p-2 text-gray-600 hover:text-orange-600 transition-colors">
                      <Bookmark className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">Join Our Cooking Community</h2>
            <p className="text-xl mb-8 opacity-90">
              Connect with fellow food enthusiasts, share your creations, and discover new flavors
            </p>
            
            <div className="flex justify-center space-x-12 mb-8">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8" />
                <div>
                  <div className="text-2xl font-bold">25K+</div>
                  <div className="opacity-90">Active Cooks</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8" />
                <div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="opacity-90">Daily Recipes</div>
                </div>
              </div>
            </div>

            <Link 
              to="/discover"
              className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-semibold hover:bg-orange-50 transition-colors shadow-lg text-lg"
            >
              Explore Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="h-8 w-8 text-orange-500" />
                <span className="text-2xl font-bold">PantryCraft</span>
              </div>
              <p className="text-gray-400">
                Turn your ingredients into culinary masterpieces with our AI-powered recipe generator.
              </p>
            </div>
            
            <Link to="/discover">
              <div>
                <h3 className="font-semibold mb-4">Discover</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Browse Recipes</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Popular</a></li>
                </ul>
              </div>
            </Link>

            <Link to="/community">
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Join Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Share Recipe</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>
            </Link>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PantryCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;