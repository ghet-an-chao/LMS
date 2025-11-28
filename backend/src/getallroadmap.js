const sql = require('mssql');
const config = require('../config');

async function handleGetAllRoadmaps(req, res) {
  try {
    const pool = await sql.connect(config);

    // 1. Lấy tất cả roadmap + owner
    const roadmapResult = await pool.request().query(`
      SELECT r.rm_id, r.title, r.description, r.tips,
             t.teacher_id, u.first_name, u.last_name
      FROM Roadmap r
      JOIN Teacher t ON r.owner_id = t.teacher_id
      JOIN [User] u ON t.teacher_id = u.user_id
      ORDER BY r.rm_id
    `);

    if (roadmapResult.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No roadmaps found'
      });
    }

    const roadmaps = [];

    // 2. Với mỗi roadmap, lấy danh sách courses
    for (const roadmap of roadmapResult.recordset) {
      const coursesResult = await pool.request()
        .input('rm_id', sql.Int, roadmap.rm_id)
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

      roadmaps.push({
        rm_id: roadmap.rm_id,
        title: roadmap.title,
        description: roadmap.description,
        tips: roadmap.tips,
        owner: {
          teacher_id: roadmap.teacher_id,
          name: `${roadmap.first_name} ${roadmap.last_name}`
        },
        courses
      });
    }

    // 3. Trả về JSON
    res.status(200).json({ roadmaps });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetAllRoadmaps };