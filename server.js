const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // To serve static files like CSS, JS, etc.

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
    res.status(201).send('Sign up successful');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});