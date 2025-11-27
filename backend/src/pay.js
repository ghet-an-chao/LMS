const sql = require('mssql');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handlePayment(req, res) {
  try {
    // 1. Lấy token từ header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
    }

    const studentId = decoded.id;
    const { course_id, section_id } = req.body;

    if (!course_id || !section_id || !studentId) {
      return res.status(400).json({ error: 'Bad Request', message: 'Missing required fields' });
    }

    const pool = await sql.connect(config);

    // 2. Lấy giá tiền từ bảng Course
    const courseResult = await pool.request()
      .input('course_id', sql.Int, course_id)
      .query('SELECT price_vnd FROM Course WHERE course_id = @course_id');

    if (courseResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'Course not found' });
    }

    const amount = courseResult.recordset[0].price_vnd;

    // 3. Tạo giao dịch mới
    await pool.request()
      .input('course_id', sql.Int, course_id)
      .input('student_id', sql.Int, studentId)
      .input('amount_vnd', sql.Int, amount)
      .input('status', sql.VarChar(10), 'pending')
      .input('gateway_ref', sql.VarChar(100), 'VNPAY_123456789')
      .query(`
        INSERT INTO [Transaction] (course_id, student_id, amount_vnd, status, gateway_ref)
        VALUES (@course_id, @student_id, @amount_vnd, @status, @gateway_ref)
      `);

    // 4. Tạo bản ghi Enrollment nếu chưa có
    const enrollCheck = await pool.request()
      .input('student_id', sql.Int, studentId)
      .input('section_id', sql.Int, section_id)
      .query(`
        SELECT * FROM Enrollment WHERE student_id = @student_id AND section_id = @section_id
      `);

    if (enrollCheck.recordset.length === 0) {
      await pool.request()
        .input('student_id', sql.Int, studentId)
        .input('section_id', sql.Int, section_id)
        .input('status', sql.VarChar(10), 'active')
        .input('origin', sql.VarChar(10), 'manual')
        .query(`
          INSERT INTO Enrollment (student_id, section_id, status, origin)
          VALUES (@student_id, @section_id, @status, @origin)
        `);
    }

    res.status(200).json({ message: 'Thanh toán đã được ghi nhận. Đăng ký thành công.' });
  } catch (err) {
    console.error('Lỗi xử lý thanh toán:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handlePayment };