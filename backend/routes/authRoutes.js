const express = require('express');
const router = express.Router();
const { register, login, home, authgoogle, googlecallback } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/home', home);
router.get('/google', authgoogle);
router.get('/google/callback', googlecallback);

module.exports = router;
