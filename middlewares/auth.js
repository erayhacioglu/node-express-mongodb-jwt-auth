const jwt = require('jsonwebtoken');
const users = require('../models/userModel');

const auth = async (req, res, next) => {
	try {
		const token = req.header('Authorization');
		if (!token) return res.status(400).json({ msg: 'Invalid Authentication' });

		const decoded = jwt.verify(token, process.env.process.ACCESS_TOKEN_SECRET);
		if (!decoded)
			return res.status(400).json({ msg: 'Invalid Authentication' });

		const user = await users.findOne({ _id: decoded.id });

		req.user = user;
		next();
	} catch (e) {
		return res.status(500).json({ msg: 'Server Error : ' + e.message });
	}
};

module.exports = auth;
