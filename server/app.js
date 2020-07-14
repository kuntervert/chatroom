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
var http = require('https').Server(options, app);
var io = require('socket.io')(http);
http.listen(3000, () => console.log(`App listening on port ${process.env.PORT}`));
let newAccs = [];
io.on('connection', (socket) => {
	// let ipAddress = socket.handshake.address;
	io.sockets.emit('connections', Object.keys(io.sockets.connected).length);
	console.log('new connection');
	console.log('clients: ', Object.keys(io.sockets.connected).length);
	socket.on('getOnline', (data) => {
		newAccs.push(data);
		console.log(data);
		io.sockets.emit('newConnection', newAccs);
	});

	socket.on('stopTyping', () => {
		socket.broadcast.emit('stopTyping');
	});
	socket.on('typing', (data) => {
		socket.broadcast.emit('typing', data);
	});
});
io.on('disconnect', (socket) => {
	socket.emit('connections', Object.keys(io.sockets.connected).length);
	console.log('client disconnected, new number:', Object.keys(io.sockets.connected).length);
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
		io.emit('message');
	} else {
		return;
	}
});

module.exports = app;
