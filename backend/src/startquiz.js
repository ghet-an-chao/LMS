const sql = require('mssql');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handleStartQuiz(req, res) {
  try {
    const { id } = req.params; // quiz_id

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

    const student_id = decoded.id; // user_id từ payload

    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing quiz_id'
      });
    }

    const pool = await sql.connect(config);

    // 1. Lấy thông tin quiz
    const quizResult = await pool.request()
      .input('quiz_id', sql.Int, id)
      .query(`
        SELECT quiz_id, time_limit_min
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

    // 2. Đếm số attempt trước đó của student cho quiz này
    const attemptCountResult = await pool.request()
      .input('quiz_id', sql.Int, id)
      .input('student_id', sql.Int, student_id)
      .query(`
        SELECT COUNT(*) AS count
        FROM Quiz_Attempt
        WHERE quiz_id = @quiz_id AND student_id = @student_id
      `);

    const attemptNo = attemptCountResult.recordset[0].count + 1;

    // 3. Tạo attempt mới (dùng SCOPE_IDENTITY thay cho OUTPUT)
    const insertAttempt = await pool.request()
      .input('quiz_id', sql.Int, id)
      .input('student_id', sql.Int, student_id)
      .input('attempt_no', sql.Int, attemptNo)
      .input('status', sql.VarChar(15), 'in_progress')
      .query(`
        INSERT INTO Quiz_Attempt (quiz_id, student_id, attempt_no, status)
        VALUES (@quiz_id, @student_id, @attempt_no, @status);

        SELECT SCOPE_IDENTITY() AS attempt_id;
      `);

    const attemptId = insertAttempt.recordset[0].attempt_id;

    // Lấy lại thông tin attempt vừa tạo
    const attemptResult = await pool.request()
      .input('attempt_id', sql.Int, attemptId)
      .query(`
        SELECT attempt_id, quiz_id, student_id, start_at, status, attempt_no
        FROM Quiz_Attempt
        WHERE attempt_id = @attempt_id
      `);

    const attempt = attemptResult.recordset[0];

    // 4. Lấy danh sách câu hỏi + option
    const questionsResult = await pool.request()
      .input('quiz_id', sql.Int, id)
      .query(`
        SELECT q.question_id, q.question_type, q.title,
               qq.point, qq.position,
               qo.option_id, qo.text
        FROM Quiz_Question qq
        JOIN Question q ON qq.question_id = q.question_id
        LEFT JOIN Question_Option qo ON q.question_id = qo.question_id
        WHERE qq.quiz_id = @quiz_id
        ORDER BY qq.position, qo.option_id
      `);

    // 5. Gom dữ liệu
    const questionsMap = {};
    questionsResult.recordset.forEach(row => {
      if (!questionsMap[row.question_id]) {
        questionsMap[row.question_id] = {
          question_id: row.question_id,
          question_type: row.question_type,
          title: row.title,
          options: [],
          point: row.point,
          position: row.position
        };
      }
      if (row.option_id) {
        questionsMap[row.question_id].options.push({
          option_id: row.option_id,
          text: row.text
        });
      }
    });

    const questions = Object.values(questionsMap);

    // 6. Trả về JSON
    res.status(200).json({
      attempt_id: attempt.attempt_id,
      quiz_id: attempt.quiz_id,
      student_id: attempt.student_id,
      attempt_no: attempt.attempt_no,
      start_at: attempt.start_at,
      time_limit_min: quiz.time_limit_min,
      status: attempt.status,
      questions
    });
  } catch (err) {
    console.error('Error starting quiz:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleStartQuiz };