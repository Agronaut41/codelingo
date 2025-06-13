const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Banco de dados conectado');
    } catch (err) {
        console.error('Erro ao conectar no banco:', err);
    }
};

module.exports = connectDB;
