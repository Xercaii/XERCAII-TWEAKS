const express = require('express');
const crypto = require('crypto');
const app = express();

// A simple in-memory storage to map tokens to purchases
let purchaseTokens = {};

app.use(express.json());

// Endpoint to handle PayPal IPN/Webhook (this would be a POST request from PayPal)
app.post('/paypal-webhook', (req, res) => {
    const paymentData = req.body;

    // Simulate payment verification (You should verify the payment with PayPal)
    if (paymentData.status === 'COMPLETED') {
        const token = crypto.randomBytes(16).toString('hex');
        purchaseTokens[token] = {
            product: paymentData.purchase_units[0].description, // e.g., 'premium' or 'basic'
            type: paymentData.purchase_units[0].custom_id // type can be passed in PayPal custom field
        };
        // Send the token back or redirect user to success.html with token as a query parameter
        res.redirect(`/success.html?token=${token}`);
    } else {
        res.status(400).send('Payment not completed');
    }
});

// Endpoint to validate the token
app.get('/validate-token', (req, res) => {
    const token = req.query.token;
    if (purchaseTokens[token]) {
        res.json({ valid: true, type: purchaseTokens[token].type });
    } else {
        res.json({ valid: false });
    }
});

// Serve static files (your HTML, CSS, JS files)
app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});