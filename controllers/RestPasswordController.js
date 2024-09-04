const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const PasswordReset = require('../models/PasswordResetModel');

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'husseinsabry525@gmail.com',
        pass: 'guro jkjj jphq olcv'
    }
});

class RestPassword { 
    static sendPasswordByEmail = async (req, res) => {
        const { reqEmail } = req.body;

        try {
            // Delete any existing code for the email
            await PasswordReset.deleteMany({ email: reqEmail });

            // Generate a new code
            const randomCode = Math.floor(100000 + Math.random() * 900000);
            const hashedCode = await bcrypt.hash(randomCode.toString(), 10);

            // Insert the new code into the database
            const passwordReset = new PasswordReset({ email: reqEmail, code: hashedCode });
            await passwordReset.save();

            // Send the code via email
            sendMail(reqEmail, randomCode, res);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    static resetPassword = async (req, res) => {
        const { reqEmail, code, password } = req.body;

        if (!reqEmail) {
            return res.status(400).json({ message: 'Email is required' });
        }

        try {
            // Retrieve reset information from the database
            const resetInfo = await PasswordReset.findOne({ email: reqEmail });

            if (!resetInfo) {
                return res.status(400).json({ message: 'No reset code found for this email' });
            }

            // Compare the hashed code
            const isCodeValid = await bcrypt.compare(code, resetInfo.code);
            if (!isCodeValid) {
                return res.status(400).json({ message: 'Invalid reset code' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update the password in the database
            await User.updateOne({ email: reqEmail }, { password: hashedPassword });

            // Delete reset information from the database
            await PasswordReset.deleteMany({ email: reqEmail });

            return res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
}

// Function to send mail
function sendMail(reqEmail, randomCode, res) {
    const mailOptions = {
        from: 's7s',
        to: reqEmail,
        subject: 'Your 6-digit Code',
        text: `Your 6-digit code is: ${randomCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: 'Email sent successfully' });
    });
}

module.exports = RestPassword;