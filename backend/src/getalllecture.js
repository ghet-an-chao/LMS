const sql = require('mssql');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handleGetAllLectures(req, res) {
  try {
    const { sectionId } = req.params;

    if (!sectionId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing sectionId'
      });
    }

    // 1. Kiểm tra token
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or missing authentication token'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or missing authentication token'
      });
    }

    const pool = await sql.connect(config);

    // 2. Lấy danh sách lecture của section
    const lecturesResult = await pool.request()
      .input('section_id', sql.Int, sectionId)
      .query(`
        SELECT lecture_id, section_id, created_by, title,
               content_url, reference_links, position, created_at
        FROM Lecture
        WHERE section_id = @section_id
        ORDER BY position
      `);

    const lectures = [];

    for (const row of lecturesResult.recordset) {
      let progress = null;

      if (decoded.role === 'student') {
        // Kiểm tra xem đã có progress chưa
        const progressResult = await pool.request()
          .input('lecture_id', sql.Int, row.lecture_id)
          .input('student_id', sql.Int, decoded.id)
          .query(`
            SELECT status, last_view_at
            FROM Lecture_Progress
            WHERE lecture_id = @lecture_id AND student_id = @student_id
          `);

        if (progressResult.recordset.length === 0) {
          // Nếu chưa có thì tạo mới với status = in_progress
          await pool.request()
            .input('lecture_id', sql.Int, row.lecture_id)
            .input('student_id', sql.Int, decoded.id)
            .input('status', sql.VarChar(20), 'in_progress')
            .query(`
              INSERT INTO Lecture_Progress (lecture_id, student_id, status)
              VALUES (@lecture_id, @student_id, @status)
            `);

          // Lấy lại progress vừa tạo
          const newProgressResult = await pool.request()
            .input('lecture_id', sql.Int, row.lecture_id)
            .input('student_id', sql.Int, decoded.id)
            .query(`
              SELECT status, last_view_at
              FROM Lecture_Progress
              WHERE lecture_id = @lecture_id AND student_id = @student_id
            `);

          progress = newProgressResult.recordset[0];
        } else {
          progress = progressResult.recordset[0];
        }
      }

      lectures.push({
        lecture_id: row.lecture_id,
        title: row.title,
        position: row.position,
        content_url: row.content_url,
        reference_links: row.reference_links,
        created_at: row.created_at,
        progress: decoded.role === 'student' ? progress : null
      });
    }

    res.status(200).json({
      section_id: parseInt(sectionId, 10),
      lectures
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetAllLectures };