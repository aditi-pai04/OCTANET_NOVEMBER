// backend/controllers/dashboardController.js

const Document = require('../models/Document');
const UserDocumentAccess = require('../models/UserDocumentAccess');

const getRecentDocumentsForUser = async (userId) => {
  try {
    // Fetch UserDocumentAccess records, ordered by lastAccessedAt
    const recentAccessRecords = await UserDocumentAccess.find({ userId })
      .sort({ lastAccessedAt: -1 })
      .populate('documentId'); // Populate with document details

    // Extract document details
    return recentAccessRecords.map((record) => record.documentId);
  } catch (error) {
    console.error('Error fetching recent documents:', error);
    return [];
  }
};
