// backend/routes/documentRoutes.js
const express = require('express');
const Document = require('../models/Document');
const router = express.Router();
const nodemailer = require('nodemailer');
const User=require('../models/User')

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


router.post('/create', async (req, res) => {
    const { filename, ownerId } = req.body;
  
    try {
      // Create a new document with the provided ownerId
      const newDocument = await Document.create({
        filename,
        content: '', // Default empty content
        ownerId,
        viewers: [ownerId], // Owner has view access by default
        editors: [ownerId], // Owner has edit access by default
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      });
  
      res.status(201).json({ document: newDocument });
    } catch (error) {
      console.error('Error creating document:', error);
      res.status(500).json({ message: 'An error occurred while creating the document.' });
    }
  });
  router.get('/recent-documents/:userId', async (req, res) => {
    const { userId } = req.params;
  console.log(userId)
    try {
      // Fetch documents where the user is either the owner, a viewer, or an editor
      const documents = await Document.find({
        $or: [
          { ownerId: userId },                    // Owner documents
          { viewersId: userId },                    // Viewer documents
          { editorsId: userId }  ,
          {publicAccessRole: 'view'},
          {publicAccessRole: 'edit'}                   // Editor documents
        ]
      })
      .sort({ createdAt: -1 })  // Sort by most recent documents first
      // .limit(5);  // Limit to the 5 most recent documents
  
      res.json(documents);
      console.log(documents)
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ message: 'An error occurred while fetching documents.' });
    }
  });
  
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const document = await Document.findById(id);
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      res.json(document);
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({ message: 'An error occurred while fetching the document.' });
    }
  });
  
  router.put('/:documentId', async (req, res) => {
    const { content } = req.body;
    try {
      const updatedDocument = await Document.findByIdAndUpdate(
        req.params.documentId,
        { content, lastUpdatedAt: new Date() },
        { new: true }
      );
      res.json(updatedDocument);
    } catch (error) {
      res.status(500).json({ message: 'Error updating document content' });
    }
  });
  

  router.put('/:documentId/rename', async (req, res) => {
    const { documentId } = req.params;
    const { filename } = req.body;
  
    try {
      const updatedDocument = await Document.findByIdAndUpdate(documentId, { filename }, { new: true });
      res.status(200).json(updatedDocument);
    } catch (error) {
      console.error('Error renaming document:', error);
      res.status(500).json({ message: 'Error renaming document' });
    }
  });
  router.post('/:documentId/share', async (req, res) => {
    const { documentId } = req.params;
    const { userId, email, publicAccessRole, isPublic, role } = req.body;  // Make sure to capture the role for sharing
    
    try {
      // Fetch the document from the database
      const document = await Document.findById(documentId);
      if (!document) {
        return res.status(404).send('Document not found.');
      }
  
      // Only the owner or an editor can share the document
      if (document.ownerId.toString() !== userId && !document.editorsId.includes(userId)) {
        return res.status(403).send('You do not have permission to share this document.');
      }
  
      // Initialize viewers and editors arrays if they are undefined
      document.viewersId = document.viewersId || [];
      document.editorsId = document.editorsId || [];
  
      if (isPublic) {
        // Public sharing - update document to be accessible publicly
        document.isPublic = true;
        document.publicAccessRole = publicAccessRole; // Set the public access level
  
        // // Clear existing viewers/editors to avoid conflicts with public access
        // document.viewersId = [];
        // document.editorsId = [];
  
        // Log the document before saving
        console.log('Document before saving (Public):', document);
  
        await document.save();
        console.log('Document saved successfully (Public).');
        return res.status(200).send('Document is now shared publicly!');
      } else if (email) {
        // Private sharing - Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).send('User with that email not found.');
        }
  
        // Assign the user to the appropriate role
        if (role === 'viewer') {
          if (!document.viewersId.includes(user._id)) {
            document.viewersId.push(user._id);
          }
        } else if (role === 'editor') {
          if (!document.editorsId.includes(user._id)) {
            document.editorsId.push(user._id);
          }
        }
  
        await document.save();
        console.log('Document shared successfully via email');
        return res.status(200).send(`Document shared successfully with ${email} as ${role}!`);
      } else {
        return res.status(400).send('Email or public sharing must be provided.');
      }
    } catch (error) {
      console.error('Error sharing document:', error);
      res.status(500).send('An error occurred while sharing the document.');
    }
  });
  
  
module.exports = router;
