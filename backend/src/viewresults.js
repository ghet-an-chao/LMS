const sql = require('mssql');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handleViewResults(req, res) {
  try {
    const { quizId } = req.params; // quiz_id

    // Lấy token từ header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
    }

    const student_id = decoded.id;

    if (!quizId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing quiz_id'
      });
    }

    const pool = await sql.connect(config);

    // 1. Lấy toàn bộ attempt của student cho quiz này
    const attemptsResult = await pool.request()
      .input('quiz_id', sql.Int, quizId)
      .input('student_id', sql.Int, student_id)
      .query(`
        SELECT attempt_id, quiz_id, student_id, attempt_no,
               status, start_at, end_at, score
        FROM Quiz_Attempt
        WHERE quiz_id = @quiz_id AND student_id = @student_id
        ORDER BY attempt_no
      `);

    if (attemptsResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'No attempts found for this quiz' });
    }

    const attempts = [];

    // 2. Với mỗi attempt, lấy chi tiết câu trả lời
    for (const attempt of attemptsResult.recordset) {
      const answersResult = await pool.request()
        .input('attempt_id', sql.Int, attempt.attempt_id)
        .input('quiz_id', sql.Int, quizId)
        .query(`
          SELECT aa.question_id, aa.selected_option_ids, aa.is_correct AS question_is_correct, aa.answer_text,
                 q.title, q.question_type, qq.point,
                 qo.option_id, qo.text, qo.is_correct AS option_is_correct
          FROM Attempt_Answer aa
          JOIN Question q ON aa.question_id = q.question_id
          JOIN Quiz_Question qq ON q.question_id = qq.question_id AND qq.quiz_id = @quiz_id
          LEFT JOIN Question_Option qo ON q.question_id = qo.question_id
          WHERE aa.attempt_id = @attempt_id
          ORDER BY qq.position, qo.option_id
        `);

      const questionsMap = {};
      answersResult.recordset.forEach(row => {
        if (!questionsMap[row.question_id]) {
          questionsMap[row.question_id] = {
            question_id: row.question_id,
            title: row.title,
            question_type: row.question_type,
            point: row.point,
            selected_option_ids: row.selected_option_ids ? row.selected_option_ids.split(',').map(Number) : [],
            answer_text: row.answer_text,
            is_correct: row.question_is_correct, // đúng/sai của toàn câu
            options: []
          };
        }
        if (row.option_id) {
          questionsMap[row.question_id].options.push({
            option_id: row.option_id,
            text: row.text,
            is_correct: row.option_is_correct === true // đúng/sai của từng lựa chọn
          });
        }
      });

      attempts.push({
        attempt_id: attempt.attempt_id,
        quiz_id: attempt.quiz_id,
        student_id: attempt.student_id,
        attempt_no: attempt.attempt_no,
        status: attempt.status,
        start_at: attempt.start_at,
        end_at: attempt.end_at,
        score: attempt.score,
        questions: Object.values(questionsMap)
      });
    }

    // 3. Trả về toàn bộ attempt
    res.status(200).json({
      quiz_id: quizId,
      student_id,
      attempts
    });
  } catch (err) {
    console.error('Error viewing results:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleViewResults };