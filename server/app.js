// Initalize env variables
require('dotenv').config();
const express = require('express');
const router = require('./router.js');
const cors = require('cors');
const fs = require('fs');
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
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/devert.ee/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/devert.ee/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/devert.ee/chain.pem')
};

// API router
app.use('/api', router);
// Start express application
var http = require( "http" ).Server(options, app );
var io = require('socket.io')(http);
http.listen(3000, () => console.log(`App listening on port ${process.env.PORT}`));

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
