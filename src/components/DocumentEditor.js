import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import './DocumentEditor.css';
import Navbar from './Navbar';
import axios from 'axios';
import Footer from './Footer';

const socket = io('http://localhost:5000'); // Connect to the WebSocket server

const DocumentEditor = () => {
  const { documentId } = useParams(); // Get the document ID from the URL
  const [content, setContent] = useState('');
  const [document, setDocument] = useState(null);
  const [filename, setFilename] = useState('');
  const [error, setError] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState('viewer'); // Role for email sharing
  const [isPublic, setIsPublic] = useState(false); // Track public sharing status
  const [publicAccessRole, setPublicAccessRole] = useState('view'); // Default to "view" for public role
  const [userRole, setUserRole] = useState(null); // Track the user's role (owner, editor, viewer)
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/documents/${documentId}`);
        const docData = response.data;
        setDocument(docData);
        setContent(docData.content);
        setFilename(docData.filename);
        setIsPublic(docData.isPublic || false); // Set public status
        setPublicAccessRole(docData.publicAccessRole || 'view'); // Set public role

        // Check if the current user is the owner, editor, or viewer
        if (userId === docData.ownerId) {
          setUserRole('owner');
        } else if (docData.editorsId.includes(userId)) {
          setUserRole('editor');
        } else if (docData.viewersId.includes(userId)) {
          setUserRole('viewer');
        } else if (docData.isPublic) {
          setUserRole(docData.publicAccessRole); // Assign public access role if document is public
        } else {
          setUserRole(null); // No access if user is not in any list
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Could not load document. Please try again later.');
      }
    };

    fetchDocument();

    socket.on('documentUpdate', (updatedContent) => {
      setContent(updatedContent);
    });

    return () => {
      socket.off('documentUpdate');
    };
  }, [documentId]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket.emit('contentChange', { documentId, content: newContent });
  };

  const saveDocumentContent = async () => {
    try {
      await axios.put(`http://localhost:5000/api/documents/${documentId}`, { content });
      console.log('Document saved successfully!');
    } catch (error) {
      console.error('Error saving document:', error);
      setError('Could not save the document. Please try again.');
    }
  };

  const handleFilenameChange = async () => {
    if (!filename) return;
    try {
      await axios.put(`http://localhost:5000/api/documents/${documentId}/rename`, { filename });
      setIsRenaming(false);
      console.log('Filename updated successfully!');
    } catch (error) {
      console.error('Error renaming document:', error);
      setError('Could not rename document. Please try again.');
    }
  };

  const handleShare = async () => {
    if (isPublic) {
      // Public sharing with selected access role (view or edit)
      try {
        await axios.post(`http://localhost:5000/api/documents/${documentId}/share`, {
          userId: userId,
          isPublic: true,
          publicAccessRole: publicAccessRole // Set the selected public access role
        });
        alert(`Document shared publicly with ${publicAccessRole} access!`);
      } catch (error) {
        console.error('Error sharing document publicly:', error);
        setError('Failed to share document publicly.');
      }
    } else if (shareEmail) {
      // Private sharing with email and selected role
      try {
        await axios.post(`http://localhost:5000/api/documents/${documentId}/share`, {
          userId: userId,
          email: shareEmail,
          role: shareRole, // Pass the selected role for the email
          isPublic: false // Set to false for private sharing
        });
        alert(`Document shared successfully with ${shareEmail} as ${shareRole}!`);
      } catch (error) {
        console.error('Error sharing document via email:', error);
        setError('Failed to share document via email.');
      }
    } else {
      alert('Please enter an email or select public sharing.');
    }
  };

  return (
    <>
    <Navbar/>
    <div className="document-editor-container">
      {error && <p className="error">{error}</p>}
      {document ? (
        <>
          <h2>
            {isRenaming ? (
              <div>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="Enter new filename"
                />
                <button onClick={handleFilenameChange}>Save Name</button>
              </div>
            ) : (
              <div>
                <span>{document.filename}</span>
                <button onClick={() => setIsRenaming(true)} disabled={userRole !== 'owner' && userRole !== 'editor'}>
                  Rename
                </button>
              </div>
            )}
          </h2>

          <textarea
            className="document-content"
            value={content}
            onChange={handleContentChange}
            placeholder="Write your document here..."
            disabled={userRole !== 'editor' && userRole !== 'owner' && !(isPublic && publicAccessRole === 'edit')}
          />

          {userRole === 'owner' || userRole === 'editor' ? (
            <div className="share-container">
              <label>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  disabled={userRole !== 'owner'}
                />
                Public Sharing (Anyone can view/edit)
              </label>

              {isPublic && userRole === 'owner' && (
                <div>
                  <label>Public Access Role:</label>
                  <select
                    value={publicAccessRole}
                    onChange={(e) => setPublicAccessRole(e.target.value)}
                  >
                    <option value="view">View Only</option>
                    <option value="edit">Edit</option>
                  </select>
                </div>
              )}

              {!isPublic && userRole !== 'viewer' && (
                <>
                  <input
                    type="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    placeholder="Enter email to share"
                  />
                  <select value={shareRole} onChange={(e) => setShareRole(e.target.value)}>
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                </>
              )}

              {/* Share Button */}
              <button onClick={handleShare} className="share-button">
                Share
              </button>
            </div>
          ) : null}

          {userRole === 'viewer' && !isPublic && (
            <p className="viewer-message">You are currently a viewer. You can only view this document.</p>
          )}
          {isPublic && publicAccessRole === 'view' && (
            <p className="viewer-message">Public view-only access. Editing is disabled.</p>
          )}
        </>
      ) : (
        <p>Loading document...</p>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default DocumentEditor;
