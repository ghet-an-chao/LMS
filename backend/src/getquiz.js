const sql = require('mssql');
const config = require('../config');

async function handleGetQuiz(req, res) {
  try {
    const { id } = req.params; // quiz_id

    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing quiz id'
      });
    }

    const pool = await sql.connect(config);

    // Lấy thông tin quiz
    const quizResult = await pool.request()
      .input('quiz_id', sql.Int, id)
      .query(`
        SELECT quiz_id, section_id, title, time_limit_min, attempts_allowed
        FROM Quiz
        WHERE quiz_id = @quiz_id
      `);

    if (quizResult.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Quiz not found'
      });
    }

    const quiz = quizResult.recordset[0];

    // Đếm số lượng câu hỏi từ bảng Quiz_Question
    const countResult = await pool.request()
      .input('quiz_id', sql.Int, id)
      .query(`
        SELECT COUNT(*) AS questions_count
        FROM Quiz_Question
        WHERE quiz_id = @quiz_id
      `);

    const questions_count = countResult.recordset[0].questions_count;

    // Trả về response
    res.status(200).json({
      quiz: {
        quiz_id: quiz.quiz_id,
        section_id: quiz.section_id,
        title: quiz.title,
        time_limit_min: quiz.time_limit_min,
        attempts_allowed: quiz.attempts_allowed,
        questions_count
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetQuiz };