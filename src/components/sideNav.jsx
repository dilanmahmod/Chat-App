import React from 'react';
import { useNavigate } from 'react-router-dom';

function SideNav() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      {token ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <div>
          {}
        </div>
      )}
    </div>
  );
}

export default SideNav;
