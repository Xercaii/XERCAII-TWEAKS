const crypto = require('crypto');

// Generate a unique token
function generateUniqueToken() {
    return crypto.randomBytes(20).toString('hex'); // Generates a unique token
}

// When payment is successful, generate a token and store it in the database
app.post('/payment-success', (req, res) => {
    const token = generateUniqueToken();
    // Store the token with the purchase details in your database
    // ...

    // Send the token back to the client
    res.json({ token: token });
});