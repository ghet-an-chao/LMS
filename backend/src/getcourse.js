const sql = require('mssql');
const config = require('../config');

async function handleGetCourse(req, res) {
  try {
    const { id } = req.params; // course_id

    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing course id'
      });
    }

    const pool = await sql.connect(config);

    // Lấy thông tin course
    const result = await pool.request()
      .input('course_id', sql.Int, id)
      .query(`
        SELECT course_id, course_code, title, credits, language,
               description, pass_threshold_pct, price_vnd
        FROM Course
        WHERE course_id = @course_id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Course not found'
      });
    }

    const course = result.recordset[0];

    res.status(200).json({
      course: {
        course_id: course.course_id,
        course_code: course.course_code,
        title: course.title,
        credits: course.credits,
        language: course.language,
        description: course.description,
        pass_threshold_pct: course.pass_threshold_pct,
        price_vnd: course.price_vnd,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetCourse };