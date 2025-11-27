const sql = require('mssql');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handleCreateQuiz(req, res) {
  try {
    // 1. Kiểm tra token
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid token'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    if (decoded.role !== 'teacher') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only teachers can create quizzes'
      });
    }

    // 2. Lấy dữ liệu từ body
    const { section_id, title, time_limit_min, attempts_allowed } = req.body;
    const created_by = decoded.id; // lấy từ token

    if (!section_id || !title || time_limit_min === undefined) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: section_id, title, time_limit_min'
      });
    }

    if (time_limit_min < 0 || (attempts_allowed !== null && attempts_allowed !== undefined && attempts_allowed < 0)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid quiz data'
      });
    }

    const pool = await sql.connect(config);

    // 3. Insert quiz mới
    const insertResult = await pool.request()
      .input('section_id', sql.Int, section_id)
      .input('created_by', sql.Int, created_by)
      .input('title', sql.VarChar(100), title)
      .input('time_limit_min', sql.Int, time_limit_min)
      .input('attempts_allowed', sql.Int, attempts_allowed || null)
      .query(`
        INSERT INTO Quiz (section_id, created_by, title, time_limit_min, attempts_allowed)
        OUTPUT INSERTED.quiz_id, INSERTED.section_id, INSERTED.created_by, 
               INSERTED.title, INSERTED.time_limit_min, INSERTED.attempts_allowed
        VALUES (@section_id, @created_by, @title, @time_limit_min, @attempts_allowed)
      `);

    const quiz = insertResult.recordset[0];

    res.status(201).json({
      status: 'success',
      message: 'Quiz created successfully',
      quiz
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleCreateQuiz };