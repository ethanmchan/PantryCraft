export interface Ingredient {
  name: string;
  quantity?: string;
  unit?: string;
}

export interface Step {
  order: number;
  instruction: string;
}

export interface Recipe {
  _id: string;
  title: string;
  author: string;
  image?: string;
  likes: number;
  comments: number;
  cookTime?: string;
  prepTime?: string;
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  category?: string;
  rating: number;
  tags: string[];
  description?: string;
  ingredients?: Ingredient[];
  steps?: Step[];
  generatedByAI?: boolean;
  createdAt?: string;
}

export interface Post {
  _id: string;
  type: 'recipe' | 'tip' | 'achievement';
  authorName: string;
  content: string;
  recipeId?: {
    _id: string;
    title: string;
    image?: string;
    cookTime?: string;
    difficulty?: string;
    rating: number;
  };
  likes: number;
  createdAt: string;
}

export interface TrendingAuthor {
  authorName: string;
  totalLikes: number;
  recipeCount: number;
}
