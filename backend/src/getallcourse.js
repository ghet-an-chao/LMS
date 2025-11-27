const sql = require('mssql');
const config = require('../config');

async function handleGetAllCourses(req, res) {
  try {
    const pool = await sql.connect(config);

    // 1. Lấy toàn bộ course
    const result = await pool.request().query(`
      SELECT course_id, course_code, title, credits, language,
             description, pass_threshold_pct, price_vnd
      FROM Course
      ORDER BY course_id
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No courses found'
      });
    }

    // 2. Map dữ liệu thành mảng course
    const courses = result.recordset.map(course => ({
      course_id: course.course_id,
      course_code: course.course_code,
      title: course.title,
      credits: course.credits,
      language: course.language,
      description: course.description,
      pass_threshold_pct: course.pass_threshold_pct,
      price_vnd: course.price_vnd
    }));

    // 3. Trả về JSON
    res.status(200).json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetAllCourses };