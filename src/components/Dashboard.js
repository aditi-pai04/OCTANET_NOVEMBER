// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/signin'); // Redirect to sign-in if no userId is found
      return;
    }

    // Fetch recent documents
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/documents/recent-documents/${userId}?_=${new Date().getTime()}`);
        setDocuments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setError('Could not load documents. Please try again later.');
        setLoading(false);
      }
    };
    

    fetchDocuments();
  }, [userId, navigate]);

  
  const handleCreateDocument = async () => {
    setError(''); // Clear any existing errors

    try {
      const response = await axios.post('http://localhost:5000/api/documents/create', {
        filename: 'Untitled Document',
        ownerId: userId,
      });
      const newDocument = response.data.document;

      // Navigate to the document editing page with the new document ID
      navigate(`/document/${newDocument._id}`);

      // Optionally update the document list
      setDocuments([newDocument, ...documents]);
    } catch (error) {
      console.error('Error creating document:', error);
      setError('Could not create document. Please try again.');
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <h2>Your Documents</h2>

      <button onClick={handleCreateDocument} className="create-document-btn">
        Create New Document
      </button>

      {loading ? (
        <p>Loading documents...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : documents.length > 0 ? (
        <ul className="document-list">
          {documents.map((doc) => (
            <li key={doc._id} onClick={() => navigate(`/document/${doc._id}`)}>
              {doc.filename}
            </li>
          ))}
        </ul>
      ) : (
        <p>No documents found. Start by creating a new document.</p>
      )}
    </div>
  );
};

export default Dashboard;
