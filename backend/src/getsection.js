const sql = require('mssql');
const config = require('../config');

async function handleGetSections(req, res) {
  try {
    const { id } = req.params; // course_id

    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing course id'
      });
    }

    const pool = await sql.connect(config);

    // Lấy danh sách section của course kèm thông tin teacher
    const result = await pool.request()
      .input('course_id', sql.Int, id)
      .query(`
        SELECT 
          s.section_id,
          s.section_code,
          s.semester_no,
          s.created_at,
          t.teacher_id,
          u.first_name,
          u.last_name
        FROM Section s
        JOIN Teacher t ON s.created_by = t.teacher_id
        JOIN [User] u ON t.teacher_id = u.user_id
        WHERE s.course_id = @course_id
      `);

    const sections = result.recordset.map(row => ({
      section_id: row.section_id,
      section_code: row.section_code,
      semester_no: row.semester_no,
      created_at: row.created_at,
      teacher: {
        teacher_id: row.teacher_id,
        name: `${row.first_name} ${row.last_name}`
      }
    }));

    res.status(200).json({
      course_id: parseInt(id, 10),
      sections
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetSections };