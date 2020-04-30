const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
	const token = req.cookies.token;
	try {
		if (!token) {
			return res.status(401).json({ status: 'Not logged in' });
		}
		req.user = await jwt.verify(token, process.env.JWT_KEY);
		next();
	} catch (err) {
		return res.status(503).json({ status: 'Mongoose error' });
	}
};
