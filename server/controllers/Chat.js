// Imports
const Message = require('../models/Message.js');
const User = require('../models/User');

// Export controller
module.exports = {
	sendMessage: async (req, res) => {
		try {
			const message = new Message(req.body);
			await message.save();
			res.status(201).json('Message sent');
		} catch (error) {
			res.status(503).json({ status: 'Error sending message' });
		}
	},
	getMessages: async (req, res) => {
		try {
			let messages = await Message.find({});
			res.status(200).json(messages);
		} catch (error) {
			res.status(500).json({ status: 'error' });
		}
	},
	loginUser: async (req, res) => {
		try {
			if ((await User.findOne({ userId: req.body.userId })) == null) {
				const newUser = new User(req.body);
				await newUser.save();
				res.status(200).json({ status: 'OK' });
			} else if ((await User.findOne({ userId: req.body.userId })) !== null) {
				res.status(401).json({ status: 'Username taken' });
			}
		} catch (error) {
			res.status(503).json({ status: 'error' });
		}
	}
};
