const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const app = express();

// A simple in-memory storage to map tokens to purchases
let purchaseTokens = {};

app.use(bodyParser.json());

app.post('/paypal-webhook', (req, res) => {
    const paymentData = req.body;

    // Simulate payment verification (You should verify the payment with PayPal)
    if (paymentData.status === 'COMPLETED') {
        const token = crypto.randomBytes(16).toString('hex');
        const productType = paymentData.purchase_units[0].custom_id;

        purchaseTokens[token] = {
            product: paymentData.purchase_units[0].description, // e.g., 'premium' or 'basic'
            type: productType // type as passed from the PayPal button
        };

        res.json({ token });
    } else {
        res.status(400).json({ error: 'Payment not completed' });
    }
});

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