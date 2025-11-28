const sql = require('mssql');
const config = require('../config');

async function handleCreateCourse(req, res) {
  try {
    const {
      course_code,
      title,
      credits,
      language,
      description,
      pass_threshold_pct,
      price_vnd
    } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (
      !course_code ||
      !title ||
      credits === undefined ||
      !language ||
      !description ||
      pass_threshold_pct === undefined ||
      price_vnd === undefined
    ) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid course data'
      });
    }

    // Kiểm tra dữ liệu hợp lệ
    if (credits < 0 || price_vnd < 0 || pass_threshold_pct < 0 || pass_threshold_pct > 100) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid course data'
      });
    }

    const pool = await sql.connect(config);

    // Insert course mới
    const insertResult = await pool.request()
      .input('course_code', sql.VarChar(20), course_code)
      .input('title', sql.VarChar(80), title)
      .input('credits', sql.Int, credits)
      .input('language', sql.VarChar(10), language)
      .input('description', sql.NVarChar(sql.MAX), description)
      .input('pass_threshold_pct', sql.Decimal(5,2), pass_threshold_pct)
      .input('price_vnd', sql.Int, price_vnd)
      .query(`
        INSERT INTO Course (course_code, title, credits, language, description, pass_threshold_pct, price_vnd)
        OUTPUT INSERTED.course_id, INSERTED.course_code, INSERTED.title, INSERTED.credits,
               INSERTED.language, INSERTED.description, INSERTED.pass_threshold_pct,
               INSERTED.price_vnd, INSERTED.created_at
        VALUES (@course_code, @title, @credits, @language, @description, @pass_threshold_pct, @price_vnd)
      `);

    const course = insertResult.recordset[0];

    res.status(201).json({
      status: 'success',
      message: 'Course created successfully',
      course: {
        course_id: course.course_id,
        course_code: course.course_code,
        title: course.title,
        credits: course.credits,
        language: course.language,
        description: course.description,
        pass_threshold_pct: course.pass_threshold_pct,
        price_vnd: course.price_vnd,
        created_at: course.created_at
      }
    });
  } catch (err) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid course data'
    });
  }
}

module.exports = { handleCreateCourse };