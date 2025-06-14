const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;
const passport = require('passport');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ message: 'Preencha todos os campos' });

    const existing = await User.findOne({ $or: [{ name }, { email }] });
    if (existing) return res.status(409).json({ message: 'Usuário já existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
};

exports.login = async (req, res) => {
    const { name, password } = req.body;

    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Senha incorreta' });

    const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login bem-sucedido', token });
};

exports.home = (req, res) => {
    res.status(200).json({ message: 'Autenticado', user: req.user });
};

exports.authgoogle = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googlecallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) return res.redirect('/login');

    const token = jwt.sign(
      { id: user._id, name: user.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.redirect(`/login/success?token=${token}`);
  })(req, res, next);
};