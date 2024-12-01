const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const verifyToken = (token) => {
  try {
      return jwt.verify(token, JWT_SECRET);
  } catch (error) {
      throw new Error('Invalid or expired token');
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

module.exports = authenticateToken;
