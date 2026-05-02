import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, Plus, X } from 'lucide-react';

const GeneratorPage = () => {
  const location = useLocation();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [input, setInput] = useState('');

  // Pre-populate from homepage ingredient input if passed via navigation state
  useEffect(() => {
    const state = location.state as { ingredients?: string } | null;
    if (state?.ingredients) {
      const parsed = state.ingredients
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      setIngredients(parsed);
    }
  }, [location.state]);

  const addIngredient = () => {
    const trimmed = input.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setInput('');
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Recipe Generator</h1>
          <p className="text-xl text-gray-600">
            Enter the ingredients you have and we'll generate recipes you can make right now.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Ingredients
          </label>

          {/* Ingredient Tags */}
          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                >
                  {ingredient}
                  <button
                    onClick={() => removeIngredient(ingredient)}
                    className="ml-1 hover:text-orange-900 transition-colors"
                    aria-label={`Remove ${ingredient}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Text Input */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Type an ingredient and press Enter..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
            <button
              onClick={addIngredient}
              disabled={!input.trim()}
              className="px-4 py-3 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Add ingredient"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Generate Button */}
          <button
            disabled={ingredients.length === 0}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles className="h-5 w-5" />
            Generate Recipes
          </button>

          {ingredients.length === 0 && (
            <p className="text-center text-sm text-gray-400 mt-3">
              Add at least one ingredient to get started
            </p>
          )}
        </div>

        {/* Coming Soon Notice */}
        <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 text-center">
          <p className="text-orange-700 font-medium mb-1">AI generation coming soon</p>
          <p className="text-orange-600 text-sm">
            We're integrating Claude AI to suggest personalized recipes based on your pantry.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneratorPage;
