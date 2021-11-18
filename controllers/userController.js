const users = require('../models/userModel');

const getUser = async (req, res) => {
	try {
		const user = await users.findById(req.params.id).select('-password');

		if (!user) return res.status(400).json({ msg: 'User not found' });

		res.json({ user });
	} catch (e) {
		return res.status(500).json({ msg: 'Server error : ' + e.message });
	}
};

module.exports = {
	getUser,
};
