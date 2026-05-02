const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    image: String,
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    cookTime: String,
    prepTime: String,
    servings: Number,
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
    category: String,
    rating: { type: Number, default: 0 },
    tags: [String],
    description: String,
    ingredients: [{ name: String, quantity: String, unit: String }],
    steps: [{ order: Number, instruction: String }],
    generatedByAI: { type: Boolean, default: false },
  },
  { timestamps: true }
);

recipeSchema.index({ title: 'text', tags: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
