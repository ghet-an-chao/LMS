const sql = require('mssql');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handleCreateSection(req, res) {
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
        message: 'Only teachers can create sections'
      });
    }

    // 3. Lấy dữ liệu từ body
    const { course_code, section_code, semester_no } = req.body;
    if (!course_code || !section_code || !semester_no) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: course_code, section_code, semester_no'
      });
    }

    const pool = await sql.connect(config);

    // 4. Tra cứu course_id từ course_code
    const courseResult = await pool.request()
      .input('course_code', sql.VarChar(20), course_code)
      .query('SELECT course_id FROM Course WHERE course_code = @course_code');

    if (courseResult.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Course not found by course_code'
      });
    }

    const { course_id } = courseResult.recordset[0];

    // 5. Insert Section
    const insertResult = await pool.request()
      .input('course_id', sql.Int, course_id)
      .input('created_by', sql.Int, decoded.id) // lấy từ token
      .input('section_code', sql.VarChar(20), section_code)
      .input('semester_no', sql.Int, semester_no)
      .query(`
        INSERT INTO Section (course_id, created_by, section_code, semester_no)
        OUTPUT INSERTED.section_id, INSERTED.course_id, INSERTED.created_by, INSERTED.section_code, INSERTED.semester_no, INSERTED.created_at
        VALUES (@course_id, @created_by, @section_code, @semester_no)
      `);

    const section = insertResult.recordset[0];

    res.status(201).json({
      message: 'Section created successfully',
      section
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleCreateSection };