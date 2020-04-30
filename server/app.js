// Initalize env variables
require('dotenv').config();

// Imports
const express = require('express');
// const cookieParser = require('cookie-parser');
const router = require('./router.js');
const cors = require('cors');

// Initialize express
const app = express();

app.use(
	cors({
		origin: [ 'http://localhost:3001', 'http://localhost:3002' ],
		credentials: true
	})
);
// app.use(cookieParser());
// API router
app.use('/api', router);

// Start express application
app.listen(process.env.PORT || 5000, () => console.log(`App listening on port ${process.env.PORT}`));

// Export app
module.exports = app;
