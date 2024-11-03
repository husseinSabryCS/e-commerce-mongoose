const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../models/UserModel');
const PasswordReset = require('../models/PasswordResetModel');
dotenv.config();
// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // استخدام القيم من ملف البيئة
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

class RestPassword { 
    static sendPasswordByEmail = async (req, res) => {
        const { reqEmail } = req.body;

        try {
            const user = await User.findOne({ email: reqEmail });
        if (!user) {
            return res.status(404).json({ message: 'Email does not exist' });
        }
            // حذف أي أكواد موجودة مسبقًا للبريد الإلكتروني
            await PasswordReset.deleteMany({ email: reqEmail });

            // توليد كود جديد
            const randomCode = Math.floor(100000 + Math.random() * 900000);
            const hashedCode = await bcrypt.hash(randomCode.toString(), 10);

            // إدخال الكود الجديد في قاعدة البيانات
            const passwordReset = new PasswordReset({ email: reqEmail, code: hashedCode });
            await passwordReset.save();

            // إرسال الكود عبر البريد الإلكتروني
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
            // استرجاع معلومات الاستعادة من قاعدة البيانات
            const resetInfo = await PasswordReset.findOne({ email: reqEmail });

            if (!resetInfo) {
                return res.status(400).json({ message: 'No reset code found for this email' });
            }

            // مقارنة الكود المشفر
            const isCodeValid = await bcrypt.compare(code, resetInfo.code);
            if (!isCodeValid) {
                return res.status(400).json({ message: 'Invalid reset code' });
            }

            // تشفير كلمة المرور الجديدة
            const hashedPassword = await bcrypt.hash(password, 10);

            // تحديث كلمة المرور في قاعدة البيانات
            await User.updateOne({ email: reqEmail }, { password: hashedPassword });

            // حذف معلومات الاستعادة من قاعدة البيانات
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
        from: process.env.EMAIL_FROM, // استخدام القيمة من ملف البيئة
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
