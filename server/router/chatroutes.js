// Imports
const express = require('express');
const controller = require('../controllers/Chat');

// Create new Express router
const router = express.Router();

// Endpoints
router.post('/login', controller.loginUser);
router.post('/send', controller.sendMessage);
router.get('/messages', controller.getMessages);

// Export router
module.exports = router;
