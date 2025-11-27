const sql = require('mssql');
const config = require('../config');

async function handleGetAssignment(req, res) {
  try {
    const { id } = req.params; // assignment_id

    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing assignment id'
      });
    }

    const pool = await sql.connect(config);

    // Lấy thông tin assignment + rubric + criteria
    const result = await pool.request()
      .input('assignment_id', sql.Int, id)
      .query(`
        SELECT a.assignment_id, a.section_id, a.title, a.weight_pct, a.due_at, a.max_score,
               r.rubric_id, r.title AS rubric_title,
               rc.criterion_id, rc.name AS criterion_name, rc.max_score AS criterion_max_score
        FROM Assignment a
        LEFT JOIN Rubric r ON r.assignment_id = a.assignment_id
        LEFT JOIN Rubric_Criterion rc ON rc.rubric_id = r.rubric_id
        WHERE a.assignment_id = @assignment_id
        ORDER BY rc.criterion_id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Assignment not found'
      });
    }

    const rows = result.recordset;
    const assignmentRow = rows[0];

    // Gom rubric criteria
    const criteria = rows
      .filter(r => r.criterion_id)
      .map(r => ({
        criterion_id: r.criterion_id,
        name: r.criterion_name,
        max_score: r.criterion_max_score
      }));

    const rubric = assignmentRow.rubric_id ? {
      rubric_id: assignmentRow.rubric_id,
      title: assignmentRow.rubric_title,
      criteria
    } : null;

    res.status(200).json({
      assignment: {
        assignment_id: assignmentRow.assignment_id,
        section_id: assignmentRow.section_id,
        title: assignmentRow.title,
        weight_pct: assignmentRow.weight_pct,
        due_at: assignmentRow.due_at,
        max_score: assignmentRow.max_score,
        rubric
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetAssignment };