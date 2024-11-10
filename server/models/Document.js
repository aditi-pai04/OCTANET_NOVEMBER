// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  content: { type: String, default: '' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  editorsId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  viewersId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  publicAccessRole: { type: String, enum: ['view', 'edit'], default: null },  // Role for public access
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
