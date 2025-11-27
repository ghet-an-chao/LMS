const sql = require('mssql');
const config = require('../config');

async function handleGetAllAssignments(req, res) {
  try {
    const { section_id } = req.params;

    if (!section_id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required parameter: section_id'
      });
    }

    const pool = await sql.connect(config);

    const result = await pool.request()
      .input('section_id', sql.Int, section_id)
      .query(`
        SELECT 
          assignment_id,
          section_id,
          created_by,
          title,
          weight_pct,
          due_at,
          max_score
        FROM Assignment
        WHERE section_id = @section_id
        ORDER BY due_at ASC
      `);

    res.status(200).json({
      status: 'success',
      message: 'Assignments fetched successfully',
      assignments: result.recordset
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetAllAssignments };