const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();  // Load environment variables from .env file

// Body parser middleware to parse incoming JSON requests
const bodyParser = require('body-parser');
router.use(bodyParser.json());

// Feedback route
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill out all fields.' });
  }

  try {
    console.log(process.env.EMAIL_USER,process.env.EMAIL_PASS, )
    // Configure Nodemailer transporter with Gmail service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // Your email address
        pass: process.env.EMAIL_PASS,  // Your email password or app password
      },
    });

    // Email options
    const mailOptions = {
      from: email, // The sender's email (from the form)
      to: process.env.RECEIVING_EMAIL, // Your receiving email address
      subject: `Feedback from ${name}`, // Feedback subject line
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, // Email body
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success response
    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    // Log and return error message
    console.error('Error sending feedback email:', error);
    res.status(500).json({ message: 'Error sending feedback. Please try again.' });
  }
});

module.exports = router;
