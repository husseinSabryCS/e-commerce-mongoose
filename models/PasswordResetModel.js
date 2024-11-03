// models/PasswordReset.js
const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '30m' } // Automatically delete after 30 minutes
});

module.exports = mongoose.model('PasswordReset', passwordResetSchema);