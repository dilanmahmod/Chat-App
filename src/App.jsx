import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SideNav from './components/SideNav';
import Login from './components/Login';
import Chat from './components/Chat';
import Register from './components/Register';
import CsrfTokenProvider from './components/CsrfTokenProvider';
import './index.css';

// Komponent för att skydda rutter
const AuthenticatedRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

// Komponent för att visa felmeddelanden
const ErrorDisplay = ({ message }) => {
  if (!message) return null;
  return (
    <div style={{ color: 'red', textAlign: 'center', margin: '1em 0' }}>
      <p>{message}</p>
    </div>
  );
};

// Komponent för att visa laddningsstatus
const Loader = () => (
  <div style={{ textAlign: 'center', padding: '1em' }}>
    <p>Laddar...</p>
  </div>
);

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('userId') || '');
  const [csrfToken, setCsrfToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Hantera lagring av token och userId direkt i useState-initialiseringen
  useEffect(() => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('userId', currentUserId);
  }, [authToken, currentUserId]);

  // Hämta CSRF-token med felhantering och laddningsstatus
  useEffect(() => {
    const retrieveCsrfToken = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://chatify-api.up.railway.app/csrf', {
          method: 'PATCH',
        });
        if (!response.ok) throw new Error('Kunde inte hämta CSRF-token');
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    retrieveCsrfToken();
  }, []);

  // Kontrollera laddningsstatus och eventuella fel
  if (isLoading) {
    return <Loader />;
  }

  if (errorMessage) {
    return <ErrorDisplay message={errorMessage} />;
  }

  return (
    <div>
      <Router>
        <SideNav token={authToken} setToken={setAuthToken} />
        <Routes>
          <Route path="/" element={<Register csrfToken={csrfToken} />} />
          <Route path="/login" element={<Login setToken={setAuthToken} setUserId={setCurrentUserId} csrfToken={csrfToken} />} />
          <Route path="/chat" element={<AuthenticatedRoute element={<Chat token={authToken} userId={currentUserId} />} isAuthenticated={!!authToken} />} />
          {/* Omdirigera till inloggning om ingen token finns */}
          <Route path="*" element={<Navigate to={authToken ? "/chat" : "/login"} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
