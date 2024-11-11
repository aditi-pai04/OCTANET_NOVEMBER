// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    // Perform logout operations (e.g., clearing local storage, redirecting)
    localStorage.removeItem('userId'); // Assuming 'userId' is stored upon login
    navigate('/signin'); // Redirect to the Sign In page
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo">DocSync</div>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/support" className="nav-link">Support</Link>
      </div>
      <div className="nav-links">
        <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
      </div>
    </header>
  );
};

export default Navbar;
