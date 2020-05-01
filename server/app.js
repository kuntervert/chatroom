// Initalize env variables
require('dotenv').config();
const express = require('express');
const router = require('./router.js');
const cors = require('cors');

// Initialize express
const app = express();


app.use(
	cors({
		origin: [
			'http://localhost:3001',
			'http://localhost:3000',
			'http://localhost:3002',
			'http://www.devert.ee',
			'https://www.devert.ee',
			'http://devert.ee'
		]
	})
);
// API router
app.use('/api', router);
// Start express application
var http = require( "http" ).createServer( app );
var io = require('socket.io')(http);
http.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}`));


const Message = require('../server/models/Message');
Message.watch([
	{
		$match: {
			operationType: 'insert'
		}
	}
]).on('change', (data) => {
	if (data) {
		console.log("new message")
			io.emit('message')
	} else {
		return
	}
});





module.exports = app;
