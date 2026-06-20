const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

// --- 1. GLOBAL BROWSER CACHE BLOCKER ---
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// --- 2. SERVE STATIC FILES FIRST ---
app.use(express.static(__dirname));

// --- 3. DYNAMIC USER DATABASE STORE ---
let usersDatabase = [
    { id: 1, name: "System Admin", email: "admin@org.com", role: "admin", password: "123", status: "Active", phone: "" },
    { id: 2, name: "Rohit Kumar", email: "rohit@org.com", role: "Backend Developer", password: "123", status: "Active", phone: "" },
    { id: 3, name: "Sawati Sharma", email: "sawati@org.com", role: "Project Manager", password: "123", status: "Active", phone: "" },
    { id: 4, name: "Aman Shrivastava", email: "aman@org.com", role: "UI/UX Designer", password: "123", status: "Active", phone: "" },
    { id: 5, name: "Sidharth Malhotra", email: "sidharth@org.com", role: "Project Manager", password: "123", status: "Active", phone: "" }
];

// --- 4. API ENDPOINTS ---

// Register API
app.post('/api/auth/register', (req, res) => {
    const { name, email, role, password } = req.body;
    if (!email || !name) return res.status(400).json({ success: false });
    
    const newUser = {
        id: Date.now(),
        name: name,
        email: email.toLowerCase(),
        role: role || 'Backend Developer',
        password: password || '123',
        status: "Active",
        phone: ""
    };
    usersDatabase.push(newUser);
    return res.status(200).json({ success: true });
});

// Login API
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const matchedUser = usersDatabase.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!matchedUser) return res.status(401).json({ success: false });
    if (matchedUser.status === "Inactive") return res.status(403).json({ success: false });

    return res.status(200).json({ success: true, role: matchedUser.role, name: matchedUser.name, email: matchedUser.email });
});

// Get Members API
app.get('/api/members', (req, res) => {
    return res.status(200).json(usersDatabase);
});

// Remove User API
app.delete('/api/members/:email', (req, res) => {
    const emailToDelete = decodeURIComponent(req.params.email);
    usersDatabase = usersDatabase.filter(u => u.email.toLowerCase() !== emailToDelete.toLowerCase());
    res.status(200).json({ success: true });
});

// Update Status API
app.post('/api/members/status', (req, res) => {
    const { email, status } = req.body;
    const user = usersDatabase.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        user.status = status;
        res.status(200).json({ success: true });
    } else {
        res.status(404).json({ success: false });
    }
});

// Edit User API
app.post('/api/members/edit', (req, res) => {
    const { originalEmail, name, email, role } = req.body;
    const user = usersDatabase.find(u => u.email.toLowerCase() === originalEmail.toLowerCase());
    
    if (user) {
        user.name = name;
        user.email = email.toLowerCase();
        user.role = role;
        return res.status(200).json({ success: true });
    }
    return res.status(404).json({ success: false });
});

// --- NEW PROFILE ENDPOINTS ---
app.get('/api/profile', (req, res) => {
    const email = req.query.email;
    const user = usersDatabase.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) res.status(200).json(user);
    else res.status(404).json({ success: false });
});

app.put('/api/profile', (req, res) => {
    const { email, name, phone } = req.body;
    const user = usersDatabase.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        user.name = name;
        user.phone = phone;
        res.status(200).json({ success: true });
    } else res.status(404).json({ success: false });
});

// --- 5. CRASH-PROOF DEFAULT FALLBACK ROUTE ---
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// --- 6. START SERVER ---
app.listen(3000, () => {
    console.log("==========================================");
    console.log("Server running perfectly on: http://localhost:3000");
    console.log("==========================================");
});