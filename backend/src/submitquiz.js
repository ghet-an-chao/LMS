const sql = require('mssql');
const config = require('../config');

async function handleSubmitQuiz(req, res) {
  try {
    const { id } = req.params; // attempt_id
    const { answers } = req.body;

    if (!id || !answers) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing attempt_id or answers'
      });
    }

    const pool = await sql.connect(config);

    // 1. Lấy thông tin attempt
    const attemptResult = await pool.request()
      .input('attempt_id', sql.Int, id)
      .query(`
        SELECT attempt_id, quiz_id, student_id, start_at, status
        FROM Quiz_Attempt
        WHERE attempt_id = @attempt_id
      `);

    if (attemptResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'Attempt not found' });
    }

    const attempt = attemptResult.recordset[0];
    const quizId = attempt.quiz_id;

    // 2. Tính điểm và insert vào Attempt_Answer
    let totalScore = 0;

    for (const ans of answers) {
      // Lấy thông tin câu hỏi trong quiz
      const questionResult = await pool.request()
        .input('quiz_id', sql.Int, quizId)
        .input('question_id', sql.Int, ans.question_id)
        .query(`
          SELECT qq.point, q.question_type
          FROM Quiz_Question qq
          JOIN Question q ON qq.question_id = q.question_id
          WHERE qq.quiz_id = @quiz_id AND qq.question_id = @question_id
        `);

      if (questionResult.recordset.length === 0) continue;

      const { point, question_type } = questionResult.recordset[0];

      let isCorrect = false;

      if (['mcq', 'multi', 'tf'].includes(question_type)) {
        // Lấy option đúng
        const correctOptionsResult = await pool.request()
          .input('question_id', sql.Int, ans.question_id)
          .query(`
            SELECT option_id
            FROM Question_Option
            WHERE question_id = @question_id AND is_correct = 1
          `);

        const correctOptionIds = correctOptionsResult.recordset.map(r => r.option_id);
        const selected = ans.selected_option_ids || [];

        isCorrect =
          selected.length === correctOptionIds.length &&
          selected.every(id => correctOptionIds.includes(id));

        if (isCorrect) {
          totalScore += point;
        }
      } else {
        // text/numeric: chưa chấm, điểm = 0
        isCorrect = false;
      }

      // Insert vào Attempt_Answer
      await pool.request()
        .input('question_id', sql.Int, ans.question_id)
        .input('attempt_id', sql.Int, id)
        .input('selected_option_ids', sql.VarChar(sql.MAX), ans.selected_option_ids ? ans.selected_option_ids.join(',') : null)
        .input('is_correct', sql.Bit, isCorrect)
        .input('answer_text', sql.NVarChar(sql.MAX), ans.answer_text || null)
        .query(`
          MERGE Attempt_Answer AS target
          USING (SELECT @question_id AS question_id, @attempt_id AS attempt_id) AS source
          ON (target.question_id = source.question_id AND target.attempt_id = source.attempt_id)
          WHEN MATCHED THEN
            UPDATE SET selected_option_ids=@selected_option_ids, is_correct=@is_correct, answer_text=@answer_text
          WHEN NOT MATCHED THEN
            INSERT (question_id, attempt_id, selected_option_ids, is_correct, answer_text)
            VALUES (@question_id, @attempt_id, @selected_option_ids, @is_correct, @answer_text);
        `);
    }

    // 3. Update attempt
    const updateAttempt = await pool.request()
      .input('attempt_id', sql.Int, id)
      .input('status', sql.VarChar(15), 'submitted')
      .input('score', sql.Decimal(4,2), totalScore)
      .query(`
        UPDATE Quiz_Attempt
        SET status = @status,
            end_at = GETDATE(),
            score = @score
        OUTPUT INSERTED.attempt_id, INSERTED.quiz_id, INSERTED.student_id,
               INSERTED.status, INSERTED.start_at, INSERTED.end_at, INSERTED.score
        WHERE attempt_id = @attempt_id
      `);

    const updatedAttempt = updateAttempt.recordset[0];

    res.status(200).json({
      message: 'Quiz submitted successfully',
      attempt: updatedAttempt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleSubmitQuiz };