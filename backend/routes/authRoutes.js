const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { register, login, home, authgoogle, googlecallback, authgithub, githubcallback, completeProfile } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/home', authenticateToken, home);
router.get('/google', authgoogle);
router.get('/google/callback', googlecallback);
router.get('/github', authgithub);
router.get('/github/callback', githubcallback);
router.post('/complete-profile', completeProfile);

module.exports = router;