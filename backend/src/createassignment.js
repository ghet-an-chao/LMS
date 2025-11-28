const sql = require('mssql');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handleCreateAssignment(req, res) {
  try {
    // 1. Kiểm tra token
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or missing authentication token'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    // 2. Kiểm tra role
    if (decoded.role !== 'teacher') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only teachers can create assignments'
      });
    }

    // 3. Lấy dữ liệu từ body
    const { section_id, title, weight_pct, due_at, max_score } = req.body;
    const created_by = decoded.id; // lấy từ token

    if (!section_id || !title || weight_pct === undefined) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: section_id, title, weight_pct'
      });
    }

    if (weight_pct < 0 || weight_pct > 100) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'weight_pct must be between 0 and 100'
      });
    }

    const pool = await sql.connect(config);

    // 4. Kiểm tra section tồn tại
    const sectionCheck = await pool.request()
      .input('section_id', sql.Int, section_id)
      .query('SELECT section_id FROM Section WHERE section_id = @section_id');

    if (sectionCheck.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Section not found'
      });
    }

    // 5. Insert assignment mới
    const insertResult = await pool.request()
      .input('section_id', sql.Int, section_id)
      .input('created_by', sql.Int, created_by)
      .input('title', sql.VarChar(100), title)
      .input('weight_pct', sql.Decimal(5,2), weight_pct)
      .input('due_at', sql.DateTime, due_at || null)
      .input('max_score', sql.Decimal(4,2), max_score || 10)
      .query(`
        INSERT INTO Assignment (section_id, created_by, title, weight_pct, due_at, max_score)
        OUTPUT INSERTED.assignment_id, INSERTED.section_id, INSERTED.created_by,
               INSERTED.title, INSERTED.weight_pct, INSERTED.due_at, INSERTED.max_score
        VALUES (@section_id, @created_by, @title, @weight_pct, @due_at, @max_score)
      `);

    const assignment = insertResult.recordset[0];

    res.status(201).json({
      status: 'success',
      message: 'Assignment created successfully',
      assignment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleCreateAssignment };