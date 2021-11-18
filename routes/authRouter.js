const router = require('express').Router();
const {
	register,
	login,
	logout,
	generateAccessToken,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh_token', generateAccessToken);

module.exports = router;
