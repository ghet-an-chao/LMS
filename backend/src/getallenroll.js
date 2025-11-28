const sql = require('mssql');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handleGetAllEnroll(req, res) {
  try {
    // 1. Lấy token từ header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid token'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    // 2. Lấy user_id từ token (chính là student_id)
    const studentId = decoded.id;
    if (!studentId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Token does not contain user id'
      });
    }

    // 3. Query enrollment
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('student_id', sql.Int, studentId)
      .query(`
        SELECT e.student_id, e.section_id, e.enrolled_at, e.status, e.origin
        FROM Enrollment e
        JOIN Section s ON e.section_id = s.section_id
        WHERE e.student_id = @student_id
        ORDER BY e.enrolled_at DESC
      `);

    res.status(200).json({
      student_id: studentId,
      enrollments: result.recordset
    });
  } catch (err) {
    console.error('Error fetching enrollments:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetAllEnroll };