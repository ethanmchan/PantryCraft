import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Users, ChefHat, Sparkles, TrendingUp } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';

interface Recipe {
  _id: string;
  title: string;
  author: string;
  image: string;
  likes: number;
  comments: number;
  cookTime: string;
  difficulty: string;
  rating: number;
  tags: string[];
}

const Homepage = () => {
  const [ingredients, setIngredients] = useState('');
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const trendingIngredients = ['Avocado', 'Quinoa', 'Salmon', 'Sweet Potato', 'Kale', 'Chickpeas'];

  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_URL;
    fetch(`${baseURL}/api/recipes/featured`)
      .then((res) => res.json())
      .then((data) => setFeaturedRecipes(data))
      .catch((err) => console.error('Failed to load featured recipes:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleGenerateRecipe = () => {
    if (ingredients.trim()) {
      navigate('/generate', { state: { ingredients: ingredients.trim() } });
    }
  };

  const handleTrendingIngredientClick = (ingredient: string) => {
    const current = ingredients.trim();
    setIngredients(current ? `${current}, ${ingredient}` : ingredient);
  };

  const handleCardClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleComment = (recipeId: string) => {
    navigate(`/recipe/${recipeId}#comments`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
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
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerateRecipe()}
                  className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none shadow-lg"
                />
                <button
                  onClick={handleGenerateRecipe}
                  disabled={!ingredients.trim()}
                  className="absolute right-2 top-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Generate</span>
                </button>
              </div>
            </div>

            {/* Trending Ingredients */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <span className="text-gray-600 font-medium">Trending:</span>
              {trendingIngredients.map((ingredient) => (
                <button
                  key={ingredient}
                  onClick={() => handleTrendingIngredientClick(ingredient)}
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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : featuredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onComment={handleComment}
                  onCardClick={handleCardClick}
                  showAuthor={true}
                  showInteractions={true}
                  className="transform hover:-translate-y-2 transition-all duration-300"
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No featured recipes yet. Be the first to share one!</p>
          )}

          <div className="text-center mt-12">
            <Link
              to="/discover"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg"
            >
              <span>View All Recipes</span>
              <Search className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Community CTA */}
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
              to="/community"
              className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-semibold hover:bg-orange-50 transition-colors shadow-lg text-lg"
            >
              Explore Community
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="h-8 w-8 text-orange-500" />
                <span className="text-2xl font-bold">PantryCraft</span>
              </div>
              <p className="text-gray-400">
                Turn your ingredients into culinary masterpieces with our AI-powered recipe generator.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/discover" className="hover:text-white transition-colors">Browse Recipes</Link></li>
                <li><Link to="/generate" className="hover:text-white transition-colors">Recipe Generator</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-gray-400">
                <li><span className="cursor-pointer hover:text-white transition-colors">Sign Up</span></li>
                <li><span className="cursor-pointer hover:text-white transition-colors">Log In</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} PantryCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
