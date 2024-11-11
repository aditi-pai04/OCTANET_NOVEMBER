// src/components/Support.js
import React, { useState } from 'react';
import './Support.css';
import axios from 'axios';
import Footer from './Footer';

import Navbar from './Navbar';
const Support = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form fields
    if (!name || !email || !message) {
      setStatus('Please fill out all fields.');
      return;
    }
    
    // Send feedback to backend (can be an API endpoint that sends email)
    try {
      await axios.post('http://localhost:5000/api/feedback', {
        name,
        email,
        message
      });
      setStatus('Thank you! Your feedback has been submitted.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setStatus('There was an error submitting your feedback. Please try again.');
      console.error('Feedback submission error:', error);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="support-page">
      <h2>Support & Feedback</h2>
      <p>We value your feedback! Please let us know any improvements or feature additions you would like to see.</p>
      
      <form onSubmit={handleSubmit} className="support-form">
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        
        <label>
          Message:
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your feedback or suggestions here..."
            required
          />
        </label>

        <button type="submit" className="submit-button">Submit Feedback</button>
      </form>

      {status && <p className="status-message">{status}</p>}
    </div>
    <Footer/>
    </>
  );
};

export default Support;
