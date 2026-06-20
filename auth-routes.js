const express = require('express');
const router = express.Router();

// Centralized Database Directory Tracking Array Data Store
let usersDatabase = [
    { id: 1, name: "System Admin", email: "admin@org.com", role: "admin", password: "123" },
    { id: 2, name: "Rohit Kumar", email: "rohit@org.com", role: "Backend Developer", password: "123" },
    { id: 3, name: "Sawati Sharma", email: "sawati@org.com", role: "Project Manager", password: "123" },
    { id: 4, name: "Aman Shrivastava", email: "aman@org.com", role: "UI/UX Designer", password: "123" },
    { id: 5, name: "Sidharth Malhotra", email: "sidharth@org.com", role: "Project Manager", password: "123" }
];

// Member Enrollment Pipeline
router.post('/api/auth/register', (req, res) => {
    const { name, email, role, password } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: "Please enter all required text parameters." });
    }

    const checkDuplicate = usersDatabase.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (checkDuplicate) {
        return res.status(400).json({ success: false, message: "This email account is already registered." });
    }

    const newUser = {
        id: Date.now(),
        name: name,
        email: email.toLowerCase(),
        role: role || 'Backend Developer',
        password: password
    };
    
    usersDatabase.push(newUser);
    return res.status(200).json({ success: true, message: "Account successfully created!" });
});

// Verification Gateway Endpoint
router.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Exact Email validation lookup matching query parameters
    const matchedUser = usersDatabase.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!matchedUser) {
        return res.status(401).json({ success: false, message: "Invalid access credentials checked." });
    }

    // Dynamic clean objects transmission callback pipeline
    return res.status(200).json({
        success: true,
        token: "session_token_secure_hash_secret_key",
        role: matchedUser.role,
        name: matchedUser.name,     
        email: matchedUser.email    
    });
});

// Fetch Entire Workspace Directory Dataset Pipeline
router.get('/api/members', (req, res) => {
    return res.status(200).json(usersDatabase);
});

module.exports = router;