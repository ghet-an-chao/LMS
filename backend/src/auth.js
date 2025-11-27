const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // gắn payload vào req.user
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden', message: 'Invalid token' });
  }
}

module.exports = { authMiddleware };