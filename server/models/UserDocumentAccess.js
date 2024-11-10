// backend/models/UserDocumentAccess.js
const mongoose = require('mongoose');

const UserDocumentAccessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
});

UserDocumentAccessSchema.index({ userId: 1, documentId: 1 }, { unique: true });

const UserDocumentAccess = mongoose.model('UserDocumentAccess', UserDocumentAccessSchema);

module.exports = UserDocumentAccess;
