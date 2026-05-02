import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types/recipe';

const BASE_URL = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 12;

const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'recent', label: 'Most Recent' },
  { value: 'rating', label: 'Highest Rated' },
];

const DiscoverPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const navigate = useNavigate();

  const fetchPage = async (pageNum: number, append = false) => {
    const url = `${BASE_URL}/api/recipes?limit=${PAGE_SIZE}&page=${pageNum}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load recipes');
    const data: Recipe[] = await res.json();
    setRecipes((prev) => (append ? [...prev, ...data] : data));
    setHasMore(data.length === PAGE_SIZE);
    return data;
  };

  useEffect(() => {
    setLoading(true);
    fetchPage(1)
      .catch(() => setError('Failed to load recipes. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  // Sync search term from URL query param
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchTerm(q);
  }, [searchParams]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      await fetchPage(nextPage, true);
      setPage(nextPage);
    } catch {
      // silent — keep existing results
    } finally {
      setLoadingMore(false);
    }
  };

  const filtered = useMemo(() => {
    let result = [...recipes];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedDifficulty !== 'All') {
      result = result.filter((r) => r.difficulty === selectedDifficulty);
    }

    if (sortBy === 'popular') result.sort((a, b) => b.likes - a.likes);
    else if (sortBy === 'rating') result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    return result;
  }, [recipes, searchTerm, selectedDifficulty, sortBy]);

  const handleCardClick = (recipeId: string) => navigate(`/recipe/${recipeId}`);
  const handleComment = (recipeId: string) => navigate(`/recipe/${recipeId}#comments`);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Recipes</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore recipes from our community of passionate home cooks and professional chefs
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md lg:max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipes or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
              >
                {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
              >
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No recipes found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-6">
              {filtered.length} recipe{filtered.length !== 1 ? 's' : ''} found
              {searchTerm || selectedDifficulty !== 'All' ? ' (filtered from loaded results)' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onComment={handleComment}
                  onCardClick={handleCardClick}
                  showAuthor
                  showInteractions
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && !searchTerm && selectedDifficulty === 'All' && (
              <div className="text-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors font-medium disabled:opacity-60"
                >
                  {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loadingMore ? 'Loading…' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
