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
			'http://devert.ee',
			'https://devert.ee'
		]
	})
);
// API router
app.use('/api', router);
// Start express application
var https = require( "https" ).createServer( app );
var io = require('socket.io')(https);
https.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}`));

io.on('connection', (socket) => {
	socket.emit('connections', Object.keys(io.sockets.connected).length);
	console.log(Object.keys(io.sockets.connected).length)
	socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });
 });


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
