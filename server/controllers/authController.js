const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { display_name, user_email, photo_url, password, role } = req.body;

    if (!display_name || !user_email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existing = await User.findOne({ user_email: user_email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const defaultCredits = role === 'creator' ? 20 : 50;

    const user = await User.create({
      display_name,
      user_email: user_email.toLowerCase(),
      photo_url: photo_url || '',
      password: hashedPassword,
      role: role || 'supporter',
      credits: defaultCredits
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        display_name: user.display_name,
        user_email: user.user_email,
        photo_url: user.photo_url,
        role: user.role,
        credits: user.credits
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { user_email, password } = req.body;

    if (!user_email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ user_email: user_email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.googleAuth && !user.password) {
      return res.status(401).json({ message: 'Please use Google Sign-In.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        _id: user._id,
        display_name: user.display_name,
        user_email: user.user_email,
        photo_url: user.photo_url,
        role: user.role,
        credits: user.credits
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error: error.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { display_name, user_email, photo_url } = req.body;

    let user = await User.findOne({ user_email: user_email.toLowerCase() });

    if (!user) {
      user = await User.create({
        display_name,
        user_email: user_email.toLowerCase(),
        photo_url: photo_url || '',
        role: 'supporter',
        credits: 50,
        googleAuth: true
      });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        _id: user._id,
        display_name: user.display_name,
        user_email: user.user_email,
        photo_url: user.photo_url,
        role: user.role,
        credits: user.credits
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Google login failed.', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      display_name: req.user.display_name,
      user_email: req.user.user_email,
      photo_url: req.user.photo_url,
      role: req.user.role,
      credits: req.user.credits
    }
  });
};
