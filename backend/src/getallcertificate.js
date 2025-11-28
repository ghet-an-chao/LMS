const sql = require('mssql');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handleGetAllCertificate(req, res) {
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

    // 2. Lấy student_id từ token (chính là user_id)
    const studentId = decoded.id;
    if (!studentId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Token does not contain student id'
      });
    }

    // 3. Query certificate + course
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('student_id', sql.Int, studentId)
      .query(`
        SELECT 
          c.course_code,
          c.title AS course_title,
          cert.issued_on,
          cert.expires_on,
          cert.verify_code,
          cert.status
        FROM Certificate cert
        JOIN Course c ON cert.course_id = c.course_id
        WHERE cert.student_id = @student_id
        ORDER BY cert.issued_on DESC
      `);

    res.status(200).json({
      student_id: studentId,
      certificates: result.recordset
    });
  } catch (err) {
    console.error('Error fetching certificates:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetAllCertificate };