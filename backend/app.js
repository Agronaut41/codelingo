const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const passport = require('passport');
require('./config/passport'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

connectDB();

app.use('/api/auth', authRoutes);

module.exports = app;