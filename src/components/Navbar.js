// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // You can define the styles for the Navbar here.

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="logo">DocSync</div>
      <div className="nav-links">
        <Link to="/signin" className="nav-link">Sign In</Link>
        <Link to="/register" className="nav-link">Register</Link>
      </div>
    </header>
  );
};

export default Navbar;
