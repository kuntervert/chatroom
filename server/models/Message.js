const mongoose = require('../database');

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
		required: true
	}
});

// Model
const Message = mongoose.model('Message', messageSchema);

// Export model
module.exports = Message;
