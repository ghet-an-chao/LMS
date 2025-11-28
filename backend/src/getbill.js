const sql = require('mssql');
const config = require('../config');

async function handleGetBill(req, res) {
  try {
    const { courseId, sectionId } = req.params;

    if (!courseId || !sectionId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing courseId or sectionId'
      });
    }

    const pool = await sql.connect(config);

    // Truy vấn thông tin khóa học + section + lecture
    const result = await pool.request()
      .input('course_id', sql.Int, courseId)
      .input('section_id', sql.Int, sectionId)
      .query(`
        SELECT 
          c.course_id, c.course_code, c.title AS course_title, c.price_vnd,
          s.section_id, s.section_code,
          l.lecture_id, l.title AS lecture_title, l.position
        FROM Course c
        JOIN Section s ON c.course_id = s.course_id
        LEFT JOIN Lecture l ON s.section_id = l.section_id
        WHERE c.course_id = @course_id AND s.section_id = @section_id
        ORDER BY l.position ASC
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Không tìm thấy thông tin khóa học hoặc lớp học phần'
      });
    }

    // Tách thông tin chung và danh sách bài giảng
    const firstRow = result.recordset[0];
    const billInfo = {
      course_id: firstRow.course_id,
      course_code: firstRow.course_code,
      course_title: firstRow.course_title,
      price_vnd: firstRow.price_vnd,
      section_id: firstRow.section_id,
      section_code: firstRow.section_code,
      lectures: []
    };

    result.recordset.forEach(row => {
      if (row.lecture_id) {
        billInfo.lectures.push({
          lecture_id: row.lecture_id,
          title: row.lecture_title,
          position: row.position
        });
      }
    });

    res.status(200).json(billInfo);
  } catch (err) {
    console.error('Error in getbill:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetBill };