const sql = require('mssql');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handleCreateLecture(req, res) {
  try {
    // 1. Kiểm tra token
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or missing authentication token' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
    }

    // 2. Kiểm tra role
    if (decoded.role !== 'teacher') {
      return res.status(403).json({ error: 'Forbidden', message: 'Only teachers can create lectures' });
    }

    // 3. Lấy dữ liệu từ body
    const { section_id, title, content_url, reference_links, position } = req.body;
    if (!section_id || !title) {
      return res.status(400).json({ error: 'Bad Request', message: 'Missing required fields: section_id, title' });
    }

    const pool = await sql.connect(config);

    // 4. Kiểm tra giảng viên có phải owner của section không
    const sectionResult = await pool.request()
      .input('section_id', sql.Int, section_id)
      .query('SELECT section_id, created_by FROM Section WHERE section_id = @section_id');

    if (sectionResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'Section not found' });
    }

    const section = sectionResult.recordset[0];
    if (section.created_by !== decoded.id) {
      return res.status(403).json({ error: 'Forbidden', message: 'Only the instructor of this section can create lectures' });
    }

    // 5. Insert Lecture
    const insertLecture = await pool.request()
      .input('section_id', sql.Int, section_id)
      .input('created_by', sql.Int, decoded.id)
      .input('title', sql.NVarChar(200), title)
      .input('content_url', sql.NVarChar(200), content_url || null)
      .input('reference_links', sql.NVarChar(sql.MAX), reference_links || null)
      .input('position', sql.Int, position || null)
      .query(`
        INSERT INTO Lecture (section_id, created_by, title, content_url, reference_links, position)
        OUTPUT INSERTED.lecture_id, INSERTED.section_id, INSERTED.created_by,
               INSERTED.title, INSERTED.content_url, INSERTED.reference_links,
               INSERTED.position, INSERTED.created_at
        VALUES (@section_id, @created_by, @title, @content_url, @reference_links, @position)
      `);

    const lecture = insertLecture.recordset[0];

    res.status(201).json({ status: 'success', message: 'Lecture created successfully', lecture });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleCreateLecture };