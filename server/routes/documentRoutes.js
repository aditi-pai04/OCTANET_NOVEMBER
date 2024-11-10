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
          { editorsId: userId }                     // Editor documents
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
    const { email, isPublic } = req.body;
  
    try {
      const document = await Document.findById(documentId);
      if (!document) {
        return res.status(404).send('Document not found.');
      }
  
      // Initialize viewers and editors arrays if they are undefined
      document.viewers = document.viewers || [];
      document.editors = document.editors || [];
  
      if (isPublic) {
        // Public sharing - update document to be accessible publicly
        document.isPublic = true;
        console.log('Document before saving (Public):', document);
        await document.save();
        console.log('Document saved successfully (Public).');
        return res.status(200).send('Document is now shared publicly!');
      } else if (email) {
        // Private sharing - Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).send('User with the provided email not found.');
        }
  
        const userId = user._id;
  
        // Check if userId already exists in viewers or editors
        let updated = false;
        if (!document.viewersId.includes(userId)) {
          document.viewersId.push(userId);
          updated = true;
        }
        if (!document.editorsId.includes(userId)) {
          document.editorsId.push(userId);
          updated = true;
        }
  
        // Log before saving
        console.log('Document before saving (Private):', document);
  
        // If the document was updated, save it
        if (updated) {
          document.markModified('viewers');
          document.markModified('editors');
          await document.save();
          console.log('Document saved successfully (Private).');
          return res.status(200).send('Document shared privately with the user!');
        } else {
          return res.status(200).send('User already has access to this document.');
        }
      } else {
        return res.status(400).send('Please provide an email for private sharing.');
      }
    } catch (error) {
      console.error('Error sharing document:', error);
      res.status(500).send('Failed to share document.');
    }
  });
  
  
  
  
  
module.exports = router;
