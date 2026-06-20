const express = require('express');
const router = express.Router();

const checkRoleAccess = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.headers['user-role'] || 'member'; 

        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            res.status(403).json({ 
                success: false, 
                message: `Access Denied: Your role as [${userRole}] does not have permission to view this page.` 
            });
        }
    };
};

router.get('/api/pages/admin', checkRoleAccess(['admin', 'Project Manager']), (req, res) => {
    res.status(200).json({ message: "Welcome to the Admin Dashboard. All controls unlocked." });
});

router.get('/api/pages/finance', checkRoleAccess(['admin', 'treasurer', 'Project Manager']), (req, res) => {
    res.status(200).json({ message: "Welcome to the Finance Panel. Financial records accessible." });
});

router.get('/api/pages/member', checkRoleAccess(['Project Manager', 'Backend Developer', 'Frontend Developer', 'UI/UX Designer', 'QA Engineer', 'DevOps Engineer']), (req, res) => {
    res.status(200).json({ message: "Access authorized. Profile matched inside ecosystem catalog data." });
});

module.exports = router;