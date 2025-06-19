import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './components/HomePage';
import DiscoverPage from './components/DiscoverPage';
import CommunityPage from './components/CommunityPage';
// import MyRecipesPage from './components/MyRecipesPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/community" element={<CommunityPage />} />
          {/* <Route path="/my-recipes" element={<MyRecipesPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// import { useEffect, useState } from 'react';

// function App() {
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const baseURL = import.meta.env.VITE_API_URL;
//     fetch(`${baseURL}/`)
//       .then((res) => res.text())
//       .then((data) => setMessage(data))
//       .catch((err) => {
//         console.error('API call failed:', err);
//         setMessage('Failed to connect to backend');
//       });
//   }, []);

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h1>PantryCraft</h1>
//       <p>Backend says: {message}</p>
//     </div>
//   );
// }

// export default App;
