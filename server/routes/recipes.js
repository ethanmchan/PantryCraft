const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

// GET all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/recipes/featured — returns top 3 liked recipes
router.get('/featured', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ likes: -1 }).limit(6);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/recipes
router.post('/', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;