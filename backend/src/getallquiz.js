const sql = require('mssql');
const config = require('../config');

async function handleGetAllQuizzes(req, res) {
  try {
    const { section_id } = req.params;

    if (!section_id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing section_id'
      });
    }

    const pool = await sql.connect(config);

    const result = await pool.request()
      .input('section_id', sql.Int, section_id)
      .query(`
        SELECT 
          quiz_id,
          section_id,
          created_by,
          title,
          time_limit_min,
          attempts_allowed
        FROM Quiz
        WHERE section_id = @section_id
        ORDER BY quiz_id ASC
      `);

    res.status(200).json({
      status: 'success',
      message: 'Quizzes fetched successfully',
      quizzes: result.recordset
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetAllQuizzes };