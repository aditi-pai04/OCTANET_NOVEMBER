// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DocumentEditor from './components/DocumentEditor';
import Support from './components/Support';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/document/:documentId" element={<DocumentEditor />} />
        <Route path="/support" element={<Support />} />
        {/* You can add more routes like /signin and /register here */}
      </Routes>
    </Router>
  );
}

export default App;
