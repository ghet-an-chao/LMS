const sql = require('mssql');
const config = require('../config');

async function handleEnrollStudent(req, res) {
  try {
    const { student_id, section_id } = req.body;

    // Kiểm tra trường bắt buộc
    if (!student_id || !section_id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing student or section'
      });
    }

    const pool = await sql.connect(config);

    // Kiểm tra xem student và section có tồn tại không
    const studentCheck = await pool.request()
      .input('student_id', sql.Int, student_id)
      .query('SELECT student_id FROM Student WHERE student_id = @student_id');

    if (studentCheck.recordset.length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid student_id'
      });
    }

    const sectionCheck = await pool.request()
      .input('section_id', sql.Int, section_id)
      .query('SELECT section_id FROM Section WHERE section_id = @section_id');

    if (sectionCheck.recordset.length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid section_id'
      });
    }

    // Thêm enrollment mới với status = active, origin = sync
    await pool.request()
      .input('student_id', sql.Int, student_id)
      .input('section_id', sql.Int, section_id)
      .input('status', sql.VarChar(10), 'active')
      .input('origin', sql.VarChar(10), 'sync')
      .query(`
        INSERT INTO Enrollment (student_id, section_id, status, origin)
        VALUES (@student_id, @section_id, @status, @origin)
      `);

    res.status(200).json({
      status: 'success',
      message: 'Student enrolled successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleEnrollStudent };