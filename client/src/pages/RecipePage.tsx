import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, ChefHat, Star, Heart, Bookmark, Users, Edit, Trash2, Sparkles } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { Recipe } from '../types/recipe';

const BASE_URL = import.meta.env.VITE_API_URL;

const RecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [related, setRelated] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');

    fetch(`${BASE_URL}/api/recipes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Recipe not found');
        return res.json();
      })
      .then((data: Recipe) => {
        setRecipe(data);
        setLikeCount(data.likes);
        return fetch(`${BASE_URL}/api/recipes?limit=4`);
      })
      .then((res) => res.json())
      .then((all: Recipe[]) => {
        setRelated(all.filter((r) => r._id !== id).slice(0, 3));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`${BASE_URL}/api/recipes/${id}`, { method: 'DELETE' });
      navigate('/discover');
    } catch {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const getDifficultyStyle = (d: string) => {
    if (d === 'Easy') return 'bg-green-100 text-green-700';
    if (d === 'Hard') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-72 bg-gray-200" />
            <div className="p-8 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">{error || 'Recipe not found.'}</p>
        <button
          onClick={() => navigate('/discover')}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Discover
        </button>
      </div>
    );
  }

  const ingredients = recipe.ingredients ?? [];
  const steps = [...(recipe.steps ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50">
      {showDeleteDialog && (
        <ConfirmDialog
          message="Delete this recipe? This cannot be undone."
          confirmLabel={deleting ? 'Deleting…' : 'Delete'}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-10">
          {/* Hero image */}
          <div className="relative">
            <img
              src={recipe.image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop'}
              alt={recipe.title}
              className="w-full h-72 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop';
              }}
            />
            {recipe.generatedByAI && (
              <span className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-medium">
                <Sparkles className="h-3 w-3" /> AI Generated
              </span>
            )}
          </div>

          <div className="p-8">
            {/* Title + Edit/Delete */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  to={`/recipes/${id}/edit`}
                  className="p-2 text-gray-400 hover:text-orange-600 transition-colors rounded-lg hover:bg-orange-50"
                  title="Edit recipe"
                >
                  <Edit className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  title="Delete recipe"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Author + badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <p className="text-gray-600">
                by <span className="font-medium text-gray-800">{recipe.author}</span>
              </p>
              {recipe.difficulty && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyStyle(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </span>
              )}
              {recipe.category && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  {recipe.category}
                </span>
              )}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 pb-6 border-b border-gray-100 mb-6">
              {recipe.cookTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>Cook: {recipe.cookTime}</span>
                </div>
              )}
              {recipe.prepTime && (
                <div className="flex items-center gap-1.5">
                  <ChefHat className="h-4 w-4 text-orange-500" />
                  <span>Prep: {recipe.prepTime}</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-orange-500" />
                  <span>Serves {recipe.servings}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(recipe.rating ?? 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-1 font-medium">{(recipe.rating ?? 0).toFixed(1)}</span>
              </div>
            </div>

            {/* Description */}
            {recipe.description && (
              <p className="text-gray-700 leading-relaxed mb-6">{recipe.description}</p>
            )}

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {recipe.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Like / Bookmark */}
            <div className="flex items-center gap-3 mb-10">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                  isLiked
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </button>
              <button
                onClick={() => setIsBookmarked((prev) => !prev)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                  isBookmarked
                    ? 'bg-orange-50 border-orange-200 text-orange-600'
                    : 'border-gray-200 text-gray-600 hover:border-orange-200 hover:text-orange-600'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>Save</span>
              </button>
            </div>

            {/* Ingredients + Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h2>
                {ingredients.length > 0 ? (
                  <ul className="space-y-3">
                    {ingredients.map((ing, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-orange-400 shrink-0" />
                        <span className="text-gray-700">
                          {[ing.quantity, ing.unit, ing.name].filter(Boolean).join(' ')}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic text-sm">No ingredients listed yet.</p>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
                {steps.length > 0 ? (
                  <ol className="space-y-5">
                    {steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-gray-700 leading-relaxed">{step.instruction}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-400 italic text-sm">No instructions listed yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related recipes */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <RecipeCard
                  key={r._id}
                  recipe={r}
                  onCardClick={(rid) => navigate(`/recipe/${rid}`)}
                  showAuthor
                  showInteractions={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePage;
