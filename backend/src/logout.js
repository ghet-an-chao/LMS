const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handleLogout(req, res) {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or missing authentication token'
      });
    }

    // Xác minh token
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or missing authentication token'
      });
    }

    // Nếu token hợp lệ → coi như logout thành công
    return res.status(200).json({
      message: 'User logged out successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleLogout };