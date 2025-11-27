const sql = require('mssql');
const config = require('../config');

async function handleDeleteQuestion(req, res) {
  try {
    const { quizId, questionId } = req.params;

    if (!quizId || !questionId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing quizId or questionId'
      });
    }

    const pool = await sql.connect(config);

    // 1. Kiểm tra câu hỏi có tồn tại trong quiz không
    const check = await pool.request()
      .input('quiz_id', sql.Int, quizId)
      .input('question_id', sql.Int, questionId)
      .query(`
        SELECT * FROM Quiz_Question 
        WHERE quiz_id = @quiz_id AND question_id = @question_id
      `);

    if (check.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Question not found in this quiz'
      });
    }

    // 2. Xóa liên kết trong Quiz_Question
    await pool.request()
      .input('quiz_id', sql.Int, quizId)
      .input('question_id', sql.Int, questionId)
      .query(`
        DELETE FROM Quiz_Question 
        WHERE quiz_id = @quiz_id AND question_id = @question_id
      `);

    // 3. Xóa options của câu hỏi
    await pool.request()
      .input('question_id', sql.Int, questionId)
      .query(`
        DELETE FROM Question_Option WHERE question_id = @question_id
      `);

    // 4. Xóa câu hỏi
    await pool.request()
      .input('question_id', sql.Int, questionId)
      .query(`
        DELETE FROM Question WHERE question_id = @question_id
      `);

    res.status(200).json({
      message: 'Question deleted successfully',
      quiz_id: parseInt(quizId, 10),
      question_id: parseInt(questionId, 10)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleDeleteQuestion };