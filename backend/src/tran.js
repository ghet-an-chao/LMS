const sql = require('mssql');
const config = require('../config');

async function handleCreateTransaction(req, res) {
  try {
    const { course_id, amount_vnd } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!course_id || !amount_vnd) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: course_id, amount_vnd'
      });
    }

    // Kiểm tra amount hợp lệ
    if (amount_vnd < 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid amount_vnd'
      });
    }

    const pool = await sql.connect(config);

    // Kiểm tra course tồn tại
    const courseCheck = await pool.request()
      .input('course_id', sql.Int, course_id)
      .query('SELECT course_id FROM Course WHERE course_id = @course_id');

    if (courseCheck.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Course not found'
      });
    }

    // Insert transaction mới với status mặc định là 'pending'
    const insertResult = await pool.request()
      .input('course_id', sql.Int, course_id)
      .input('amount_vnd', sql.Int, amount_vnd)
      .input('status', sql.VarChar(10), 'pending')
      .query(`
        INSERT INTO [Transaction] (course_id, amount_vnd, status)
        OUTPUT INSERTED.txn_id, INSERTED.course_id, INSERTED.amount_vnd,
               INSERTED.status, INSERTED.gateway_ref, INSERTED.created_at
        VALUES (@course_id, @amount_vnd, @status)
      `);

    const transaction = insertResult.recordset[0];

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleCreateTransaction };