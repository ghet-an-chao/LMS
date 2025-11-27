const sql = require('mssql');
const config = require('../config');

async function handleGetProfile(req, res) {
  try {
    // userId phải được gắn req.user sau khi verify JWT thông qua auth.js
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid token'
      });
    }

    const pool = await sql.connect(config);

    // Lấy thông tin cơ bản từ bảng User
    const userResult = await pool.request()
      .input('user_id', sql.Int, userId)
      .query(`
        SELECT user_id, username, first_name, last_name, email, status
        FROM [User]
        WHERE user_id = @user_id
      `);

    if (userResult.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    const user = userResult.recordset[0];

    // Kiểm tra role: có trong Student hay Teacher
    const roles = [];
    const studentCheck = await pool.request()
      .input('student_id', sql.Int, userId)
      .query('SELECT student_id FROM Student WHERE student_id = @student_id');

    if (studentCheck.recordset.length > 0) {
      roles.push('student');
    }

    const teacherCheck = await pool.request()
      .input('teacher_id', sql.Int, userId)
      .query('SELECT teacher_id FROM Teacher WHERE teacher_id = @teacher_id');

    if (teacherCheck.recordset.length > 0) {
      roles.push('teacher');
    }

    // Trả về profile
    res.status(200).json({
      id: user.user_id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      status: user.status,
      roles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetProfile };