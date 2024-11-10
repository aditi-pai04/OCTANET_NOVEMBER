// backend/routes/userRoutes.js

const express = require('express');
const User = require('../models/User');
const router = express.Router();

// POST route to register a user

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  // Create a new user instance and save to the database
  const newUser = new User({ name, email, password });
  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login request received:", email, password); // Log email and password for reference
    const user = await User.findOne({ email, password });

    if (!user) {
      console.log("Invalid credentials for email:", email); // Log if user not found
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("User found:", user._id); // Log found user ID
    res.json({ userId: user._id });
  } catch (error) {
    console.error('Detailed Login error:', error); // Log detailed error to console
    res.status(500).json({ message: 'An error occurred', error: error.message }); // Return error message in response
  }
});



module.exports = router;
