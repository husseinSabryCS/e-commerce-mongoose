const express = require('express');
const RestPassword = require('../controllers/RestPasswordController'); // Adjust the path as necessary

const router = express.Router();

// Route to send password reset code to email
router.post('/send-password-reset', RestPassword.sendPasswordByEmail);

// Route to reset password
router.post('/reset-password', RestPassword.resetPassword);

module.exports = router;