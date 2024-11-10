// backend/controllers/documentController.js

const UserDocumentAccess = require('../models/UserDocumentAccess');

// Update last accessed time
const updateDocumentAccess = async (userId, documentId) => {
  try {
    await UserDocumentAccess.findOneAndUpdate(
      { userId, documentId },
      { lastAccessedAt: Date.now() },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error updating document access:', error);
  }
};
