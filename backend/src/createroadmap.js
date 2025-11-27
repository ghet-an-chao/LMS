const sql = require('mssql');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handleCreateRoadmap(req, res) {
  try {
    // 1. Lấy token từ header
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

    // 2. Kiểm tra role phải là teacher
    if (decoded.role !== 'teacher') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only teachers can create roadmaps'
      });
    }

    // 3. Lấy dữ liệu từ body
    const { title, description, tips } = req.body;
    if (!title) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required field: title'
      });
    }

    const pool = await sql.connect(config);

    // 4. Insert Roadmap, owner_id lấy từ token
    const insertRoadmap = await pool.request()
      .input('owner_id', sql.Int, decoded.id) // lấy từ token
      .input('title', sql.NVarChar(50), title)
      .input('description', sql.NVarChar(500), description || null)
      .input('tips', sql.NVarChar(1000), tips || null)
      .query(`
        INSERT INTO Roadmap (owner_id, title, description, tips)
        OUTPUT INSERTED.rm_id, INSERTED.owner_id, INSERTED.title, INSERTED.description, INSERTED.tips
        VALUES (@owner_id, @title, @description, @tips)
      `);

    const roadmap = insertRoadmap.recordset[0];

    res.status(201).json({
      message: 'Roadmap created successfully',
      roadmap
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleCreateRoadmap };