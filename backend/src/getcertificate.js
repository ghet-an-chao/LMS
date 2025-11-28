const sql = require('mssql');
const config = require('../config');

async function handleGetCertificate(req, res) {
  try {
    const { id } = req.params; // certificate_id

    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing certificate id'
      });
    }

    const pool = await sql.connect(config);

    // Lấy thông tin certificate + student + course
    const result = await pool.request()
      .input('certificate_id', sql.Int, id)
      .query(`
        SELECT c.certificate_id, c.student_id, c.course_id, c.section_id,
               c.issued_on, c.expires_on, c.verify_code, c.status,
               u.first_name, u.last_name,
               cr.course_code, cr.title
        FROM Certificate c
        JOIN Student s ON c.student_id = s.student_id
        JOIN [User] u ON s.student_id = u.user_id
        JOIN Course cr ON c.course_id = cr.course_id
        WHERE c.certificate_id = @certificate_id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Certificate not found'
      });
    }

    const row = result.recordset[0];

    res.status(200).json({
      certificate: {
        certificate_id: row.certificate_id,
        student: {
          student_id: row.student_id,
          name: `${row.first_name} ${row.last_name}`
        },
        course: {
          course_id: row.course_id,
          course_code: row.course_code,
          title: row.title
        },
        section_id: row.section_id,
        issued_on: row.issued_on,
        expires_on: row.expires_on,
        verify_code: row.verify_code,
        status: row.status
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetCertificate };