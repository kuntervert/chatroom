const mongoose = require('../database');
global.messageWatcher = 1;
// Define schema
const messageSchema = mongoose.Schema({
	userId: {
		type: String,
		required: true
	},
	messageText: {
		type: String,
		required: true
	},
	messageDate: {
		type: String,
		required: true,
		expires: 20000
	}
});

// Model
const Message = mongoose.model('Message', messageSchema);
// Export model
module.exports = Message;
