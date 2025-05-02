import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_URL;
    fetch(`${baseURL}/`)
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => {
        console.error('API call failed:', err);
        setMessage('Failed to connect to backend');
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>PantryCraft</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
