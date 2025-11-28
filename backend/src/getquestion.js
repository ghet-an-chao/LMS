const sql = require('mssql');
const config = require('../config');

async function handleGetQuizQuestions(req, res) {
  try {
    const { id } = req.params; // quiz_id

    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing quiz id'
      });
    }

    const pool = await sql.connect(config);

    // Query quiz + tất cả câu hỏi + option
    const result = await pool.request()
      .input('quiz_id', sql.Int, id)
      .query(`
        SELECT qz.quiz_id, qz.title AS quiz_title, qz.time_limit_min, qz.attempts_allowed,
               q.question_id, q.question_type, q.title AS question_title,
               qq.point, qq.position,
               qo.option_id, qo.text, qo.is_correct
        FROM Quiz qz
        LEFT JOIN Quiz_Question qq ON qz.quiz_id = qq.quiz_id
        LEFT JOIN Question q ON qq.question_id = q.question_id
        LEFT JOIN Question_Option qo ON q.question_id = qo.question_id
        WHERE qz.quiz_id = @quiz_id
        ORDER BY qq.position, qo.option_id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No questions found for this quiz'
      });
    }

    // Gom dữ liệu thành cấu trúc JSON
    const quizInfo = {
      quiz_id: result.recordset[0].quiz_id,
      title: result.recordset[0].quiz_title,
      time_limit_min: result.recordset[0].time_limit_min,
      attempts_allowed: result.recordset[0].attempts_allowed,
      questions: []
    };

    const questionsMap = {};
    result.recordset.forEach(row => {
      if (!row.question_id) return; // quiz có thể chưa có câu hỏi

      if (!questionsMap[row.question_id]) {
        questionsMap[row.question_id] = {
          question_id: row.question_id,
          question_type: row.question_type,
          title: row.question_title,
          options: [],
          point: row.point,
          position: row.position
        };
      }

      if (row.option_id) {
        questionsMap[row.question_id].options.push({
          option_id: row.option_id,
          text: row.text,
          is_correct: row.is_correct
        });
      }
    });

    quizInfo.questions = Object.values(questionsMap);

    res.status(200).json(quizInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetQuizQuestions };