const mongoose = require('../database');

// Define schema
const userSchema = mongoose.Schema({
	userId: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		required: true,
		expires: 86400
	}
});

// Model
const User = mongoose.model('User', userSchema);

// Export model
module.exports = User;
