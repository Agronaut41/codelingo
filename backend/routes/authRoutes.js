const express = require('express');
const router = express.Router();
const { register, login, home } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/home', home);

module.exports = router;
