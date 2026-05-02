const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// GET /api/recipes — supports ?search=, ?difficulty=, ?sort=, ?limit=, ?page=
router.get('/', async (req, res) => {
  try {
    const { search, difficulty, sort, limit = 12, page = 1 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $elemMatch: { $regex: search, $options: 'i' } } },
      ];
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    const sortOption =
      sort === 'rating' ? { rating: -1 }
      : sort === 'recent' ? { createdAt: -1 }
      : { likes: -1 };

    const recipes = await Recipe.find(query)
      .sort(sortOption)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/recipes/featured — top 6 by likes (must be before /:id)
router.get('/featured', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ likes: -1 }).limit(6);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/recipes/:id
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/recipes
router.post('/', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/recipes/:id
router.put('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/recipes/:id
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
