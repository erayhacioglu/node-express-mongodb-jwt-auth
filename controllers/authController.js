const users = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
	createAccessToken,
	createRefreshToken,
	validateEmail,
} = require('../utils/index');

const register = async (req, res) => {
	const { fullname, email, password } = req.body;
	try {
		if (!fullname || !email || !password)
			return res.status(400).json({ msg: 'Cannot be left blank' });

		if (!validateEmail(email))
			return res.status(400).json({ msg: 'Invalid email' });

		const user = await users.findOne({ email });

		if (user) return res.status(400).json({ msg: 'This email already exists' });

		if (password.length < 6)
			return res
				.status(400)
				.json({ msg: 'Password must be least 6 characters' });

		const hashedPassword = await bcrypt.hash(password, 12);

		const newUser = new users({
			fullname,
			email,
			password: hashedPassword,
		});

		const access_token = createAccessToken({ id: newUser._id });
		const refresh_token = createRefreshToken({ id: newUser._id });

		res.cookie('refreshToken', refresh_token, {
			httpOnly: true,
			path: '/api/refresh_token',
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});

		await newUser.save();

		return res.status(201).json({
			msg: 'Register success!',
			access_token,
			user: {
				...newUser._doc,
				password: '',
			},
		});
	} catch (e) {
		return res.status(500).json({ msg: 'Server Error : ' + e.message });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		if (!email || !password)
			return res.status(400).json({ msg: 'Cannot be left blank' });

		const user = await users.findOne({ email });

		if (!user)
			return res.status(400).json({ msg: 'E-mail or password does not exist' });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ msg: 'E-mail or password does not exist' });

		const access_token = createAccessToken({ id: user._id });
		const refresh_token = createRefreshToken({ id: user._id });

		res.cookie('refreshToken', refresh_token, {
			httpOnly: true,
			path: '/api/refresh_token',
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({
			msg: 'Login success!',
			access_token,
			user: {
				...user._doc,
				password: '',
			},
		});
	} catch (e) {
		return res.status(500).json({ msg: 'Server Error : ' + e.message });
	}
};

const logout = async (req, res) => {
	try {
		res.clearCookie('refreshToken', { path: '/api/refresh_token' });
		return res.status(200).json({ msg: 'Logged out!' });
	} catch (e) {
		return res.status(500).json({ msg: 'Server Error : ' + e.message });
	}
};

const generateAccessToken = async (req, res) => {
	try {
		const rf_token = req.cookies.refreshToken;
		if (!rf_token) return res.status(400).json({ msg: 'Please login now' });

		jwt.verify(
			rf_token,
			process.env.REFRESH_TOKEN_SECRET,
			async (err, result) => {
				if (err) return res.status(400).json({ msg: 'Please login now' });

				const user = await users.findById(result.id).select('-password');
				if (!user) return res.status(400).json({ msg: 'This does not exist' });

				const access_token = createAccessToken({ id: result.id });

				res.json({
					access_token,
					user,
				});
			}
		);
	} catch (e) {
		return res.status(500).json({ msg: 'Server Error : ' + e.message });
	}
};

module.exports = {
	register,
	login,
	logout,
	generateAccessToken,
};
