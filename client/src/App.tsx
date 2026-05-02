import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Homepage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import CommunityPage from './pages/CommunityPage';
import GeneratorPage from './pages/Generator';
import RecipePage from './pages/RecipePage';
import RecipeFormPage from './pages/RecipeFormPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/generate" element={<GeneratorPage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="/recipes/new" element={<RecipeFormPage />} />
          <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
