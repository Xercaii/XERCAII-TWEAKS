const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// In-memory storage for tokens
const tokens = {};

// Generate a new token
const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Handle PayPal payment success and generate a unique token
app.post('/payment-success', (req, res) => {
    const { orderId } = req.body;
    const token = generateToken();
    tokens[token] = orderId;
    res.json({ token });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.query.token;
    if (tokens[token]) {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
};

// Serve the success page with token validation
app.get('/success.html', verifyToken, (req, res) => {
    const token = req.query.token;
    delete tokens[token]; // Invalidate the token
    res.sendFile(path.join(__dirname, 'path/to/success.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});