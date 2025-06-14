const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    googleId: String,
    githubId: {
        type: String,
        unique: true,
        sparse: true
    }
});

module.exports = mongoose.model('User', userSchema);
