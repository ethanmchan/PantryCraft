const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Add this line 👇 to include the recipe API route
const recipeRoutes = require('./routes/recipes');
app.use('/api/recipes', recipeRoutes);

app.get('/', (req, res) => {
  res.send('PantryCraft backend is live!');
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));