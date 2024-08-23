import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to Chat App</h1>
      <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link>.</p>
    </div>
  );
}

export default Home;
