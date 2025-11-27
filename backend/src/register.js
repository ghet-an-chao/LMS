const sql = require('mssql');
const config = require('../config');

async function handleRegister(req, res) {
  try {
    const { username, password, first_name, last_name, email, role } = req.body;

    // Kiểm tra trường bắt buộc
    if (!username || !password || !first_name || !last_name || !email || !role) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: username, first_name, last_name, email, password, role'
      });
    }

    // Kiểm tra role hợp lệ
    // if (role !== 'student' && role !== 'teacher') {
    //   return res.status(400).json({
    //     error: 'Bad Request',
    //     message: 'Role phải là student hoặc teacher'
    //   });
    // }

    const pool = await sql.connect(config);

    // Kiểm tra username/email đã tồn tại chưa
    const checkResult = await pool.request()
      .input('username', sql.VarChar(30), username)
      .input('email', sql.VarChar(254), email)
      .query('SELECT user_id FROM [User] WHERE username = @username OR email = @email');

    if (checkResult.recordset.length > 0) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Username or email already exists'
      });
    }

    // Insert user mới
    const insertResult = await pool.request()
      .input('username', sql.VarChar(30), username)
      .input('password_hash', sql.VarChar(255), password)
      .input('first_name', sql.VarChar(30), first_name)
      .input('last_name', sql.VarChar(50), last_name)
      .input('email', sql.VarChar(254), email)
      .input('status', sql.VarChar(10), 'active')
      .query(`
        INSERT INTO [User] (username, password_hash, first_name, last_name, email, status)
        OUTPUT INSERTED.user_id
        VALUES (@username, @password_hash, @first_name, @last_name, @email, @status)
      `);

    const userId = insertResult.recordset[0].user_id;

    // Nếu role là student → thêm vào bảng Student
    if (role === 'student') {
      await pool.request()
        .input('student_id', sql.Int, userId)
        .query('INSERT INTO Student (student_id) VALUES (@student_id)');
    }

    // Nếu role là teacher → thêm vào bảng Teacher
    if (role === 'teacher') {
      await pool.request()
        .input('teacher_id', sql.Int, userId)
        .query('INSERT INTO Teacher (teacher_id) VALUES (@teacher_id)');
    }

    // Trả về response 201 với thông tin user
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userId,
        username,
        first_name,
        last_name,
        email,
        role,
        status: 'active'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleRegister };