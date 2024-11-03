const express = require('express');
const { registerUser, loginUser, resetPassword, forgotPassword } = require('../controllers/authConttroller');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/signin', loginUser);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);

module.exports = router;
