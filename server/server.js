// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoints

// Simulates user login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        console.log(`Login attempt for: ${email}`);
        res.json({
            success: true,
            message: 'Login successful!',
            user: { email: email }
        });
    } else {
        res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
});

// Simulates user registration
app.post('/api/auth/register', (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        console.log(`Registration for: ${email}`);
        res.json({
            success: true,
            message: 'Registration successful!',
            user: { email: email }
        });
    } else {
        res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
});

// Fetches exam questions for a given subject
app.get('/api/questions/:subject', (req, res) => {
    const subject = req.params.subject;
    const safeFilename = path.normalize(subject).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, 'questions', `${safeFilename}.json`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file for subject ${subject}:`, err);
            return res.status(404).json({ success: false, message: 'Subject not found.' });
        }
        res.json(JSON.parse(data));
    });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`ExamPrep server is running on http://localhost:${PORT}`);
});
