const sql = require('mssql');
const config = require('../config');

async function handleIssueCertificate(req, res) {
  try {
    const { student_id, course_id, section_id, issued_on, expires_on, verify_code, status } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!student_id || !course_id || !issued_on || !verify_code || !status) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: student_id, course_id, issued_on, verify_code, status'
      });
    }

    // Kiểm tra status hợp lệ
    const validStatuses = ['issued', 'revoked'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid status value'
      });
    }

    const pool = await sql.connect(config);

    // Kiểm tra student tồn tại
    const studentCheck = await pool.request()
      .input('student_id', sql.Int, student_id)
      .query('SELECT student_id FROM Student WHERE student_id = @student_id');
    if (studentCheck.recordset.length === 0) {
      return res.status(400).json({ error: 'Bad Request', message: 'Invalid student_id' });
    }

    // Kiểm tra course tồn tại
    const courseCheck = await pool.request()
      .input('course_id', sql.Int, course_id)
      .query('SELECT course_id FROM Course WHERE course_id = @course_id');
    if (courseCheck.recordset.length === 0) {
      return res.status(400).json({ error: 'Bad Request', message: 'Invalid course_id' });
    }

    // Kiểm tra section tồn tại
    if (section_id) {
      const sectionCheck = await pool.request()
        .input('section_id', sql.Int, section_id)
        .query('SELECT section_id FROM Section WHERE section_id = @section_id');
      if (sectionCheck.recordset.length === 0) {
        return res.status(400).json({ error: 'Bad Request', message: 'Invalid section_id' });
      }
    }

    // Insert certificate mới và lấy dữ liệu vừa insert
    const insertResult = await pool.request()
      .input('student_id', sql.Int, student_id)
      .input('course_id', sql.Int, course_id)
      .input('section_id', sql.Int, section_id || null)
      .input('issued_on', sql.Date, issued_on)
      .input('expires_on', sql.Date, expires_on || null)
      .input('verify_code', sql.VarChar(50), verify_code)
      .input('status', sql.VarChar(10), status)
      .query(`
        INSERT INTO Certificate (student_id, course_id, section_id, issued_on, expires_on, verify_code, status)
        OUTPUT INSERTED.certificate_id, INSERTED.student_id, INSERTED.course_id, INSERTED.section_id,
               INSERTED.issued_on, INSERTED.expires_on, INSERTED.verify_code, INSERTED.status
        VALUES (@student_id, @course_id, @section_id, @issued_on, @expires_on, @verify_code, @status)
      `);

    const certificate = insertResult.recordset[0];

    res.status(201).json({
      status: 'success',
      message: 'Certificate issued successfully',
      certificate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleIssueCertificate };