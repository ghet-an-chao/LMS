const sql = require('mssql');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handleGetMyTransactions(req, res) {
  try {
    // Lấy token từ header Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing Authorization header'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid Authorization header format'
      });
    }

    // Giải mã token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    const userId = decoded.id;
    const role = decoded.role;

    // Chỉ student mới có transaction
    if (role !== 'student') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only students can view transactions'
      });
    }

    const pool = await sql.connect(config);

    // Query transaction của student hiện tại
    const result = await pool.request()
      .input('student_id', sql.Int, userId)
      .query(`
        SELECT t.txn_id, t.course_id, c.course_code, c.title AS course_title,
               t.amount_vnd, t.status, t.gateway_ref, t.created_at
        FROM [Transaction] t
        JOIN Course c ON t.course_id = c.course_id
        WHERE EXISTS (
          SELECT 1 FROM Student s WHERE s.student_id = @student_id
        )
      `);

    const transactions = result.recordset.map(row => ({
      txn_id: row.txn_id,
      course_id: row.course_id,
      course_code: row.course_code,
      course_title: row.course_title,
      amount_vnd: row.amount_vnd,
      status: row.status,
      gateway_ref: row.gateway_ref,
      created_at: row.created_at
    }));

    res.status(200).json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetMyTransactions };