const express = require('express');
const router = express.Router();

router.delete('/api/members/cleanup-inactive', (req, res) => {
    // Safety handling validation check
    if (!req.app || typeof req.app.locals.getDb !== 'function') {
        return res.status(500).json({ success: false, message: "Internal Server Core State Missing." });
    }

    let currentDb = req.app.locals.getDb();
    const inactiveCount = currentDb.filter(member => member.status.toLowerCase() === 'inactive').length;

    if (inactiveCount === 0) {
        return res.status(200).json({ 
            success: true, 
            message: "No inactive members found. Database is already clean!" 
        });
    }

    const filteredDb = currentDb.filter(member => member.status.toLowerCase() !== 'inactive');
    req.app.locals.setDb(filteredDb);

    return res.status(200).json({
        success: true,
        message: `Successfully cleared ${inactiveCount} inactive member account profiles from records!`
    });
});

module.exports = router;