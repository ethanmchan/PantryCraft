import React, { useState } from 'react';
import { Heart, Star, MessageCircle, Bookmark, Clock, ChefHat } from 'lucide-react';

// Type definitions
interface Recipe {
  _id?: string;
  id?: string;
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

interface RecipeCardProps {
  recipe: Recipe;
  onLike?: (recipeId: string) => void;
  onComment?: (recipeId: string) => void;
  onBookmark?: (recipeId: string) => void;
  onCardClick?: (recipeId: string) => void;
  showAuthor?: boolean;
  showInteractions?: boolean;
  className?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onLike,
  onComment,
  onBookmark,
  onCardClick,
  showAuthor = true,
  showInteractions = true,
  className = "",
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(recipe.likes);

  const recipeId = recipe._id || recipe.id || '';

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setCurrentLikes(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(recipeId);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComment?.(recipeId);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(recipeId);
  };

  const handleCardClick = () => {
    onCardClick?.(recipeId);
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(recipe.rating);
    const hasHalfStar = recipe.rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="h-4 w-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTagColor = (tag: string) => {
    const colors = [
      'bg-orange-100 text-orange-700',
      'bg-green-100 text-green-700',
      'bg-blue-100 text-blue-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700',
    ];
    const index = tag.length % colors.length;
    return colors[index];
  };

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1 ${className}`}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/api/placeholder/400/300';
          }}
        />
        
        {/* Heart Icon Overlay */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <Heart 
            className={`h-5 w-5 transition-colors cursor-pointer ${
              isLiked ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'
            }`}
            onClick={handleLike}
          />
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className={`text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {recipe.title}
        </h3>
        
        {/* Author */}
        {showAuthor && (
          <p className="text-gray-600 mb-4 text-sm">by {recipe.author}</p>
        )}
        
        {/* Cook Time and Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.cookTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ChefHat className="h-4 w-4" />
              <span className={getDifficultyColor(recipe.difficulty)}>
                {recipe.difficulty}
              </span>
            </div>
          </div>
          
          {/* Star Rating */}
          <div className="flex items-center space-x-1">
            {renderStars()}
            <span className="text-sm text-gray-600 ml-1">
              ({recipe.rating.toFixed(1)})
            </span>
          </div>
        </div>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                +{recipe.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Interactions */}
        {showInteractions && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                  isLiked ? 'text-red-500' : ''
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{currentLikes}</span>
              </button>
              
              <button
                onClick={handleComment}
                className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{recipe.comments}</span>
              </button>
            </div>
            
            <button
              onClick={handleBookmark}
              className={`p-2 transition-colors ${
                isBookmarked 
                  ? 'text-orange-600' 
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;