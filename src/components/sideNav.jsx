import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SideNav.css'; 

const SideNav = ({ token, setToken }) => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);

  // Logga auth-token för felsökning
  useEffect(() => {
    console.log('Användartoken:', token);
  }, [token]);

  const loggaUtAnvandare = () => {
    console.log('Användaren loggar ut...');
    setToken(''); // Töm auth-token
    localStorage.removeItem('token'); // Ta bort token från localStorage
    navigate('/login'); // Skicka användaren till inloggningssidan
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible); // Växla menyens synlighet
  };

  return (
    <div className="navigationswrapper">
      {/* Utloggningsknapp */}
      {token && (
        <button
          onClick={loggaUtAnvandare}
          className="fixed top-4 left-4 z-50 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg focus:outline-none"
        >
          Logga ut 🚪
        </button>
      )}

      {/* Knapp för att öppna/stänga sidonavigationen */}
      <button
        className="fixed top-16 left-4 z-50 text-white focus:outline-none"
        onClick={toggleMenu}
      >
        {menuVisible ? (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        )}
      </button>

      {/* Navigation */}
      <div
        className={`fixed inset-0 bg-blue-900 bg-opacity-80 transform ${
          menuVisible ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <nav className="flex flex-col items-center mt-24 space-y-6">
          <ul className="text-lg text-white">
            {!token ? (
              <>
                <li>
                  <Link to="/" className="block px-6 py-3 rounded-lg hover:bg-blue-700">
                    Registrera
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="block px-6 py-3 rounded-lg hover:bg-blue-700">
                    Logga in
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/chat" className="block px-6 py-3 rounded-lg hover:bg-blue-700">
                    Chattrum
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideNav;
