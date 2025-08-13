// C:\Users\MAHIR\Projects\sms\server\controllers\authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  // --- ADD LOGS STARTING HERE ---
  console.log('--- New Signup Request Received ---');
  console.log('Request Body:', req.body); 
  // --- END OF LOGS TO ADD ---

  const { name, email, password } = req.body;
  try {
    // --- ADD MORE LOGS ---
    console.log('Checking for existing user with email:', email);
    let user = await User.findOne({ email });
    console.log('Result from database search:', user); // This will show null if no user is found
    // --- END OF LOGS TO ADD ---

    if (user) {
      console.log('Error: User was found, sending "already exists" message.'); // Error log
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};