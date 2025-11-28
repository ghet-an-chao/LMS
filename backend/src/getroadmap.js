const sql = require('mssql');
const config = require('../config');

async function handleGetRoadmap(req, res) {
  try {
    const { id } = req.params; // rm_id

    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing roadmap id'
      });
    }

    const pool = await sql.connect(config);

    // Lấy thông tin roadmap + owner
    const roadmapResult = await pool.request()
      .input('rm_id', sql.Int, id)
      .query(`
        SELECT r.rm_id, r.title, r.description, r.tips,
               t.teacher_id, u.first_name, u.last_name
        FROM Roadmap r
        JOIN Teacher t ON r.owner_id = t.teacher_id
        JOIN [User] u ON t.teacher_id = u.user_id
        WHERE r.rm_id = @rm_id
      `);

    if (roadmapResult.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Roadmap not found'
      });
    }

    const roadmap = roadmapResult.recordset[0];

    // Lấy danh sách courses trong roadmap từ bảng Roadmap_Course (mp_id liên kết rm_id)
    const coursesResult = await pool.request()
      .input('rm_id', sql.Int, id)
      .query(`
        SELECT rc.course_id, c.course_code, c.title, rc.ordinal
        FROM Roadmap_Course rc
        JOIN Course c ON rc.course_id = c.course_id
        WHERE rc.mp_id = @rm_id
        ORDER BY rc.ordinal
      `);

    const courses = coursesResult.recordset.map(row => ({
      course_id: row.course_id,
      course_code: row.course_code,
      title: row.title,
      ordinal: row.ordinal
    }));

    res.status(200).json({
      rm_id: roadmap.rm_id,
      title: roadmap.title,
      description: roadmap.description,
      tips: roadmap.tips,
      owner: {
        teacher_id: roadmap.teacher_id,
        name: '${roadmap.first_name} ${roadmap.last_name}'
      },
      courses
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetRoadmap };