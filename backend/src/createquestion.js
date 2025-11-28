const sql = require('mssql');
const config = require('../config');

async function handleCreateQuestion(req, res) {
  try {
    const { id } = req.params; // quiz_id
    const { title, optionA, optionB, optionC, optionD, correctoption, point, position } = req.body;

    if (!id || !title || !optionA || !optionB || !optionC || !optionD || !correctoption || !point || !position) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields'
      });
    }

    const pool = await sql.connect(config);

    // 1. Insert Question (bank_id = NULL, question_type = 'mcq')
    const insertQuestion = await pool.request()
      .input('bank_id', sql.Int, null)
      .input('question_type', sql.VarChar(20), 'mcq')
      .input('title', sql.VarChar(500), title)
      .query(`
        INSERT INTO Question (bank_id, question_type, title)
        OUTPUT INSERTED.question_id, INSERTED.title, INSERTED.question_type
        VALUES (@bank_id, @question_type, @title)
      `);

    const question = insertQuestion.recordset[0];
    const questionId = question.question_id;

    // 2. Insert Options
    const optionsData = [
      { text: optionA, key: 'A' },
      { text: optionB, key: 'B' },
      { text: optionC, key: 'C' },
      { text: optionD, key: 'D' }
    ];

    const insertedOptions = [];
    for (const opt of optionsData) {
      const isCorrect = (opt.key === correctoption);
      const insertOption = await pool.request()
        .input('question_id', sql.Int, questionId)
        .input('text', sql.NVarChar(500), opt.text)
        .input('is_correct', sql.Bit, isCorrect)
        .query(`
          INSERT INTO Question_Option (question_id, text, is_correct)
          OUTPUT INSERTED.option_id, INSERTED.text, INSERTED.is_correct
          VALUES (@question_id, @text, @is_correct)
        `);

      insertedOptions.push(insertOption.recordset[0]);
    }

    // 3. Insert Quiz_Question
    await pool.request()
      .input('question_id', sql.Int, questionId)
      .input('quiz_id', sql.Int, id)
      .input('point', sql.Decimal(4,2), point)
      .input('position', sql.Int, position)
      .query(`
        INSERT INTO Quiz_Question (question_id, quiz_id, point, position)
        VALUES (@question_id, @quiz_id, @point, @position)
      `);

    // 4. Trả về JSON
    res.status(201).json({
      message: 'Question added to quiz successfully',
      question: {
        question_id: questionId,
        title: question.title,
        question_type: question.question_type,
        options: insertedOptions,
        point,
        position
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleCreateQuestion };