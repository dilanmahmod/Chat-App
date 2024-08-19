import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import Chat from './components/chat';
import SideNav from './components/sideNav';

function App() {
  return (
    <Router>
      <SideNav />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
