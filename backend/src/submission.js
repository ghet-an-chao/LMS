const sql = require('mssql');
const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = 'your_jwt_secret_key';

async function handleSubmitAssignment(req, res) {
  try {
    const { id } = req.params; // assignment_id
    const { content_url } = req.body;

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

    const student_id = decoded.id; // lấy user_id từ payload

    if (!id || !content_url) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: assignment_id, content_url'
      });
    }

    const pool = await sql.connect(config);

    // Lấy due_at của assignment
    const assignmentResult = await pool.request()
      .input('assignment_id', sql.Int, id)
      .query('SELECT due_at FROM Assignment WHERE assignment_id = @assignment_id');

    if (assignmentResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'Assignment not found' });
    }

    const dueAt = assignmentResult.recordset[0].due_at;
    const now = new Date();

    // Xác định status
    let status = 'on_time';
    if (dueAt && now > dueAt) {
      status = 'late';
    }

    // Đếm số submission trước đó của student cho assignment này
    const submissionCountResult = await pool.request()
      .input('assignment_id', sql.Int, id)
      .input('student_id', sql.Int, student_id)
      .query(`
        SELECT COUNT(*) AS count
        FROM Submission
        WHERE assignment_id = @assignment_id AND student_id = @student_id
      `);

    const submissionCount = submissionCountResult.recordset[0].count;
    const versionNo = submissionCount + 1;

    // Tạo submission mới
    const insertSubmission = await pool.request()
      .input('assignment_id', sql.Int, id)
      .input('student_id', sql.Int, student_id)
      .input('status', sql.VarChar(10), status)
      .query(`
        INSERT INTO Submission (assignment_id, student_id, status)
        OUTPUT INSERTED.submission_id, INSERTED.assignment_id, INSERTED.student_id,
               INSERTED.status, INSERTED.submitted_at
        VALUES (@assignment_id, @student_id, @status)
      `);

    const submission = insertSubmission.recordset[0];
    const submissionId = submission.submission_id;

    // Insert version mới cho submission vừa tạo
    const insertVersion = await pool.request()
      .input('submission_id', sql.Int, submissionId)
      .input('version_no', sql.Int, versionNo)
      .input('content_url', sql.NVarChar(500), content_url)
      .query(`
        INSERT INTO Submission_Version (submission_id, version_id, version_no, content_url)
        OUTPUT INSERTED.version_id, INSERTED.version_no, INSERTED.content_url, INSERTED.created_at
        VALUES (@submission_id,
                (SELECT ISNULL(MAX(version_id),0)+1 FROM Submission_Version WHERE submission_id=@submission_id),
                @version_no,
                @content_url)
      `);

    const latestVersion = insertVersion.recordset[0];

    res.status(201).json({
      message: 'Submission created successfully',
      submission: {
        submission_id: submission.submission_id,
        assignment_id: submission.assignment_id,
        student_id: submission.student_id,
        status: submission.status,
        submitted_at: submission.submitted_at,
        latest_version: latestVersion
      }
    });
  } catch (err) {
    console.error('Error submitting assignment:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleSubmitAssignment };