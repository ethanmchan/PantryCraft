const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: String,
  author: String,
  image: String,
  likes: Number,
  comments: Number,
  cookTime: String,
  difficulty: String,
  rating: Number,
  tags: [String]
});

module.exports = mongoose.model("Recipe", recipeSchema);