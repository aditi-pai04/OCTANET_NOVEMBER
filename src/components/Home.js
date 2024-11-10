// src/components/Home.js
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './Home.css'; // You can define the main page styles here.

const Home = () => {
  return (
    <div className="homepage-container">
      <Navbar /> {/* Navbar component */}
      
      <main className="main-content">
        <section className="hero">
          <h1>Welcome to DocSync</h1>
          <p>Real-time document collaboration made simple.</p>
          <div className="cta-buttons">
            <a href="/signin" className="btn">Sign In</a>
            <a href="/register" className="btn">Register</a>
          </div>
        </section>

        <section className="features">
          <div className="feature">
            <h3>Real-Time Collaboration</h3>
            <p>Collaborate instantly with your team on documents.</p>
          </div>
          <div className="feature">
            <h3>Cloud-Based Storage</h3>
            <p>Access your documents anytime, anywhere.</p>
          </div>
          <div className="feature">
            <h3>Easy to Use</h3>
            <p>Start collaborating without any technical hassle.</p>
          </div>
        </section>
      </main>

      <Footer /> {/* Footer component */}
    </div>
  );
};

export default Home;
