const express = require('express');
const router = express.Router();
const { handlePromptGeneration, getAllPromptsForUser } = require('../services/prompts');
const { authenticateToken } = require('../middleware/session-authentication-middleware');

// Generate new app design from a prompt
router.post('/generate', authenticateToken, async (req, res) => {
    console.log(" /generate endpoint hit");
    console.log("Request body:", req.body);

     const { prompt } = req.body;
 const user_id = req.user?._id;

    if (!user_id || !prompt) {
        console.log(" Missing user_id or prompt");
        return res.status(400).json({ success: false, message: 'user_id and prompt are required' });
    }

    try {
        console.log(" Calling handlePromptGeneration...");
        const result = await handlePromptGeneration(user_id, prompt);
        console.log(" Generation successful, sending response");
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        console.error(" Prompt generation failed:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});


// Protect only the history route
router.get('/history/:user_id', authenticateToken, async (req, res) => {
    try {
        const prompts = await getAllPromptsForUser(req.params.user_id);
        res.status(200).json({ success: true, data: prompts });
    } catch (err) {
        console.error('Failed to fetch prompts:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
