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
		required: true
	}
});

// Model
const Message = mongoose.model('Message', messageSchema);

Message.watch([
	{
		$match: {
			operationType: 'insert'
		}
	}
]).on('change', (data) => {
	if (data) {
		global.messageWatcher += Math.random();
	}
});

// Export model
module.exports = Message;
