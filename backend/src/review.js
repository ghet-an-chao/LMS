const sql = require('mssql');
const config = require('../config');

async function handleReviewAttempt(req, res) {
  try {
    const { id } = req.params; // attempt_id

    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing attempt id'
      });
    }

    const pool = await sql.connect(config);

    // 1. Lấy thông tin attempt
    const attemptResult = await pool.request()
      .input('attempt_id', sql.Int, id)
      .query(`
        SELECT attempt_id, quiz_id, student_id, status, start_at, end_at, score
        FROM Quiz_Attempt
        WHERE attempt_id = @attempt_id
      `);

    if (attemptResult.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Attempt not found'
      });
    }

    const attempt = attemptResult.recordset[0];

    // 2. Lấy danh sách câu trả lời
    const answersResult = await pool.request()
      .input('attempt_id', sql.Int, id)
      .query(`
        SELECT aa.question_id, aa.selected_option_ids, aa.is_correct, aa.answer_text,
               q.question_type, q.title, qq.point
        FROM Attempt_Answer aa
        JOIN Question q ON aa.question_id = q.question_id
        JOIN Quiz_Question qq ON qq.question_id = q.question_id
        JOIN Quiz_Attempt qa ON aa.attempt_id = qa.attempt_id AND qq.quiz_id = qa.quiz_id
        WHERE aa.attempt_id = @attempt_id
        ORDER BY qq.position
      `);

    const answers = answersResult.recordset.map(row => ({
      question_id: row.question_id,
      question_type: row.question_type,
      title: row.title,
      selected_option_ids: row.selected_option_ids
        ? row.selected_option_ids.split(',').map(Number)
        : [],
      is_correct: row.is_correct,
      point: row.point
    }));

    // 3. Trả về JSON
    res.status(200).json({
      attempt: {
        attempt_id: attempt.attempt_id,
        quiz_id: attempt.quiz_id,
        student_id: attempt.student_id,
        status: attempt.status,
        start_at: attempt.start_at,
        end_at: attempt.end_at,
        score: attempt.score,
        answers
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleReviewAttempt };