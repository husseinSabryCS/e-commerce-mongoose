const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Registration
exports.registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  // User Login
  exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      // Generate JWT token
      const token = jwt.sign({ _id: user._id,name: user.name, email: user.email  }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ token, user: { name: user.name, email: user.email } });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  