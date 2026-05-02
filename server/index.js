const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const recipeRoutes = require('./routes/recipes');
const postRoutes = require('./routes/posts');
app.use('/api/recipes', recipeRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('PantryCraft backend is live!');
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
