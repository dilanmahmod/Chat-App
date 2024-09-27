import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SideNav = ({ token, setToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Användartoken:', token);
  }, [token]);

  const loggaUtAnvandare = () => {
    console.log('Användaren loggar ut...');
    setToken(''); 
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  return (
    <div className="navigationswrapper">

      {token && (
        <button
          onClick={loggaUtAnvandare}
          className="fixed top-4 left-4 z-50 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg focus:outline-none"
        >
          Logga ut 🚪
        </button>
      )}
    </div>
  );
};

export default SideNav;
