const sql = require('mssql');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handleGetAverageScore(req, res) {
  try {
    // 1. Kiểm tra token
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or missing authentication token'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    // 2. Kiểm tra role
    if (decoded.role !== 'student') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only students can view their average score'
      });
    }

    const student_id = decoded.id;

    const pool = await sql.connect(config);

    // 3. Gọi hàm GetStudentAverageScore
    const result = await pool.request()
      .input('student_id', sql.Int, student_id)
      .query('SELECT dbo.GetStudentAverageScore(@student_id) AS average_score');

    const avgScore = result.recordset[0].average_score;

    res.status(200).json({
      student_id,
      average_score: avgScore
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetAverageScore };