const sql = require('mssql');
const config = require('../config');

async function handleGetLecture(req, res) {
  try {
    const { lectureId } = req.params;

    // 1. Kiểm tra tham số
    if (!lectureId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing lectureId'
      });
    }

    const pool = await sql.connect(config);

    // 2. Lấy thông tin lecture
    const result = await pool.request()
      .input('lecture_id', sql.Int, lectureId)
      .query(`
        SELECT lecture_id, section_id, created_by, title,
               content_url, reference_links, position, created_at
        FROM Lecture
        WHERE lecture_id = @lecture_id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Lecture not found'
      });
    }

    const lecture = result.recordset[0];

    // 3. Trả về JSON
    res.status(200).json({ lecture });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetLecture };