// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const documentRoutes = require('./routes/documentRoutes');
const cors = require('cors');
const userRoutes=require('./routes/userRoutes')
const Document=require('./models/Document')

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // The origin of your frontend app
    methods: ['GET', 'POST'],
  },
});
// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/users',userRoutes)


// WebSocket connection
io.on('connection', (socket) => {
  console.log('User connected to WebSocket');

  // Listen for content updates from clients
  socket.on('contentChange', async ({ documentId, content }) => {
    try {
      // Update the document in the database with the new content
      await Document.findByIdAndUpdate(documentId, { content });
      
      // Emit the updated content back to all connected clients
      io.emit('documentUpdate', content);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
