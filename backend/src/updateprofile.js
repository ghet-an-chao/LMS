const sql = require('mssql');
const config = require('../config');

async function handleUpdateProfile(req, res) {
  try {
    const { id } = req.params;
    const { first_name, last_name, email } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: first_name, last_name, email'
      });
    }

    const pool = await sql.connect(config);

    // Kiểm tra user tồn tại
    const userCheck = await pool.request()
      .input('user_id', sql.Int, id)
      .query('SELECT user_id, username, status FROM [User] WHERE user_id = @user_id');

    if (userCheck.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    const existingUser = userCheck.recordset[0];

    // Kiểm tra email trùng với user khác
    const emailCheck = await pool.request()
      .input('email', sql.VarChar(254), email)
      .input('user_id', sql.Int, id)
      .query('SELECT user_id FROM [User] WHERE email = @email AND user_id <> @user_id');

    if (emailCheck.recordset.length > 0) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Email already in use by another user'
      });
    }

    // Update profile
    await pool.request()
      .input('user_id', sql.Int, id)
      .input('first_name', sql.NVarChar(30), first_name)
      .input('last_name', sql.NVarChar(50), last_name)
      .input('email', sql.VarChar(254), email)
      .query(`
        UPDATE [User]
        SET first_name = @first_name,
            last_name = @last_name,
            email = @email
        WHERE user_id = @user_id
      `);

    // Trả về thông tin user sau khi update
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: existingUser.user_id,
        username: existingUser.username,
        first_name,
        last_name,
        email,
        status: existingUser.status
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleUpdateProfile };