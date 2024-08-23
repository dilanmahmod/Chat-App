import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import SideNav from './components/SideNav';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div>
        <SideNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={token ? <Navigate to="/chat" /> : <Register />} />
          <Route path="/login" element={token ? <Navigate to="/chat" /> : <Login />} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
