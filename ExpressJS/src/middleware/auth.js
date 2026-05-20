const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({ message: 'Không có token xác thực.' });

    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        next();
    } catch {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};

const requireRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user?.role))
        return res.status(403).json({ message: 'Không có quyền truy cập.' });
    next();
};

module.exports = { authMiddleware, requireRole };