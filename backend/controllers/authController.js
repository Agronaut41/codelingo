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
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Senha incorreta' });

    const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Login bem-sucedido', token });

  } catch (err) {
    console.error('Erro no login:', err); // <--- importante no CI
    return res.status(500).json({ message: 'Erro interno no login' });
  }
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

exports.authgithub = passport.authenticate('github', { scope: ['user:email'] });

exports.githubcallback = (req, res, next) => {
  passport.authenticate('github', { session: false }, async (err, user, info) => {
    if (err || !user) return res.redirect('/login');

    if (!user.email) {
      return res.redirect(
        `/complete-profile?username=${encodeURIComponent(user.name)}&githubId=${user.githubId}`
      );
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.redirect(`/login/success?token=${token}`);
  })(req, res, next);
};

exports.completeProfile = async (req, res) => {
  const { githubId, email } = req.body;

  if (!githubId || !email)
    return res.status(400).json({ message: 'Dados incompletos' });

  const user = await User.findOne({ githubId });
  if (!user)
    return res.status(404).json({ message: 'Usuário não encontrado' });

  user.email = email;
  await user.save();

  const token = jwt.sign(
    { id: user._id, name: user.name },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(200).json({ message: 'Cadastro completo', token });
};
