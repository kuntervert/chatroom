// Initalize env variables
require('dotenv').config();
const express = require('express');
const router = require('./router.js');
const cors = require('cors');

// Initialize express
const app = express();
var http = require( "http" ).createServer( app );
var io = require('socket.io')(http);

const whitelist = ['http://localhost:3000', 'http://localhost:3001','http://www.devert.ee',
'https://www.devert.ee' ];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)

      callback(new Error('Not allowed by CORS'));
  }
}
app.use(cors(corsOptions));
// API router
app.use('/api', router);
// Start express application

http.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}`));


var data = 3
io.emit("customEmit", data)

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
