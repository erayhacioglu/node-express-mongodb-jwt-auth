const router = require('express').Router();
const { getUser } = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/:id', auth, getUser);

module.exports = router;
