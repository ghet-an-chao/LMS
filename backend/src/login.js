const sql = require('mssql');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Kiểm tra trường bắt buộc
    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: email, password'
      });
    }

    const pool = await sql.connect(config);

    // Tìm user theo email
    const result = await pool.request()
    .input('email', sql.VarChar(254), email)
    .query(`
      SELECT user_id, username, first_name, last_name, email, status, password_hash
      FROM [User]
      WHERE email = @email
    `);

    if (result.recordset.length === 0) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    const user = result.recordset[0];

    if (user.password_hash !== password) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Xác định role: kiểm tra bảng Student/Teacher
    let role = null;

    const studentCheck = await pool.request()
      .input('student_id', sql.Int, user.user_id)
      .query('SELECT student_id FROM Student WHERE student_id = @student_id');

    if (studentCheck.recordset.length > 0) {
      role = 'student';
    } else {
      const teacherCheck = await pool.request()
        .input('teacher_id', sql.Int, user.user_id)
        .query('SELECT teacher_id FROM Teacher WHERE teacher_id = @teacher_id');

      if (teacherCheck.recordset.length > 0) {
        role = 'teacher';
      }
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: role
      },
      JWT_SECRET,
      // { expiresIn: '1h' }
    );

    res.status(200).json({
        accessToken: token,
        user: {
        id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: role,
        status: user.status
       }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleLogin };