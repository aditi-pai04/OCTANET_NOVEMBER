// backend/models/Document.js
const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: '', // Initialize with empty content
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  viewersId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  editorsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  isPublic: {
    type: Boolean,
    default: false, // Set to true if the document is public
  },
  version: {
    type: Number,
    default: 1, // Track document version for edit history
  },
});

DocumentSchema.pre('save', function (next) {
  this.lastUpdatedAt = Date.now();
  next();
});

const Document = mongoose.model('Document', DocumentSchema);

module.exports = Document;
