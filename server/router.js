// Imports
const express = require('express');

// Middleware
const bodyParser = require('body-parser');

// Routers
const chatRouter = require('./router/chatroutes');
// Create new Express router
const router = express.Router();

// Set subrouters
router.use(bodyParser.json());
router.use('/user', chatRouter);

// Export router
module.exports = router;
