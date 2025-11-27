const sql = require('mssql');
const config = require('../config');

async function handleAddCourseToRoadmap(req, res) {
  try {
    const { id } = req.params; // rm_id từ URL
    const { course_code, ordinal } = req.body;

    if (!course_code || !ordinal) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: course_code, ordinal'
      });
    }

    const pool = await sql.connect(config);

    // Kiểm tra roadmap tồn tại
    const roadmapResult = await pool.request()
      .input('rm_id', sql.Int, id)
      .query('SELECT rm_id FROM Roadmap WHERE rm_id = @rm_id');

    if (roadmapResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'Roadmap not found' });
    }

    // Tìm course theo course_code
    const courseResult = await pool.request()
      .input('course_code', sql.VarChar(50), course_code)
      .query('SELECT course_id, course_code FROM Course WHERE course_code = @course_code');

    if (courseResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'Course not found by course_code' });
    }

    const { course_id } = courseResult.recordset[0];

    // Thêm course vào roadmap
    const insertResult = await pool.request()
      .input('rm_id', sql.Int, id)
      .input('course_id', sql.Int, course_id)
      .input('ordinal', sql.Int, ordinal)
      .query(`
        INSERT INTO Roadmap_Course (mp_id, course_id, ordinal)
        OUTPUT INSERTED.mp_id, INSERTED.course_id, INSERTED.ordinal
        VALUES (@rm_id, @course_id, @ordinal)
      `);

    const mappingRow = insertResult.recordset[0];

    res.status(201).json({
      message: 'Course added to roadmap successfully',
      mapping: {
        rm_id: mappingRow.mp_id,
        course_id: mappingRow.course_id,
        course_code, // echo lại course_code để frontend hiển thị
        ordinal: mappingRow.ordinal
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleAddCourseToRoadmap };