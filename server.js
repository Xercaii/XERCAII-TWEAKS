const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const usersFile = './users.json';

const readUsers = () => {
    if (fs.existsSync(usersFile)) {
        return JSON.parse(fs.readFileSync(usersFile));
    }
    return [];
};

const writeUsers = (users) => {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// Configure the email transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

// Handle signup
app.post('/api/signup', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    if (users.find(u => u.email === email)) {
        res.status(400).send('Email already in use');
        return;
    }
    users.push({ email, password });
    writeUsers(users);

    // Send confirmation email
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Sign Up Successful',
        text: 'You have successfully signed up to Xercaii Tweaks!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    res.status(201).send('Sign up successful');
});

// Handle login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.send('Login successful');
    } else {
        res.status(401).send('Invalid email or password');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});