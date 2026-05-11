const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Verification = require('../models/Verification');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendOTPEmail = async (to, otp) => {
    const info = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject: 'Mã OTP xác thực đăng ký',
        text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 10 phút.`
    });
    return info;
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp tên, email và mật khẩu.' });
        }

        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(409).json({ message: 'Email đã được đăng ký.' });

        // Remove any previous pending verification for this email
        await Verification.destroy({ where: { email } });

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const otpHash = await bcrypt.hash(otp, 10);
        const passwordHash = await bcrypt.hash(password, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await Verification.create({ name, email, password: passwordHash, otpHash, expiresAt });

        try {
            await sendOTPEmail(email, otp);
        } catch (mailErr) {
            console.error('Mail send error:', mailErr);
            return res.status(500).json({ message: 'Không thể gửi email OTP.' });
        }

        return res.json({ message: 'OTP đã được gửi tới email. Vui lòng kiểm tra hộp thư.' });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

const verify = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Vui lòng cung cấp email và mã OTP.' });

        const pending = await Verification.findOne({ where: { email } });
        if (!pending) return res.status(400).json({ message: 'Không tìm thấy yêu cầu đăng ký.' });

        if (new Date() > new Date(pending.expiresAt)) {
            await Verification.destroy({ where: { id: pending.id } });
            return res.status(400).json({ message: 'Mã OTP đã hết hạn.' });
        }

        const match = await bcrypt.compare(otp, pending.otpHash);
        if (!match) return res.status(400).json({ message: 'Mã OTP không đúng.' });

        // Create user
        const user = await User.create({ name: pending.name, email: pending.email, password: pending.password });
        await Verification.destroy({ where: { id: pending.id } });

        const payload = { id: user.id, email: user.email, name: user.name };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

        return res.status(201).json({ token, user: payload });
    } catch (err) {
        console.error('Verify error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu.' });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });

        const payload = { id: user.id, email: user.email, name: user.name };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

        return res.json({ token, user: payload });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

module.exports = { register, verify, login };
