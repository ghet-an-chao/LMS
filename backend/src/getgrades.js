const sql = require('mssql');
const config = require('../config');

async function handleGetGrades(req, res) {
  try {
    const { id } = req.params; // student_id

    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing student id'
      });
    }

    const pool = await sql.connect(config);

    // Lấy thông tin student + tên
    const studentResult = await pool.request()
      .input('student_id', sql.Int, id)
      .query(`
        SELECT s.student_id, u.first_name, u.last_name
        FROM Student s
        JOIN [User] u ON s.student_id = u.user_id
        WHERE s.student_id = @student_id
      `);

    if (studentResult.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Student not found'
      });
    }

    const student = studentResult.recordset[0];

    // Query tất cả dữ liệu liên quan: course, section, assignment, submission, rubric_scores
    const result = await pool.request()
      .input('student_id', sql.Int, id)
      .query(`
        SELECT c.course_id, c.course_code, c.title AS course_title,
               sec.section_id, sec.section_code,
               a.assignment_id, a.title AS assignment_title, a.weight_pct, a.max_score,
               sub.submission_id, sub.status AS submission_status, sub.submitted_at,
               rs.criterion_id, rc.name AS criterion_name, rs.score
        FROM Course c
        JOIN Section sec ON sec.course_id = c.course_id
        JOIN Assignment a ON a.section_id = sec.section_id
        LEFT JOIN Submission sub ON sub.assignment_id = a.assignment_id AND sub.student_id = @student_id
        LEFT JOIN Rubric_Score rs ON rs.submission_id = sub.submission_id
        LEFT JOIN Rubric_Criterion rc ON rs.criterion_id = rc.criterion_id
        ORDER BY c.course_id, sec.section_id, a.assignment_id, rs.criterion_id
      `);

    // Gom dữ liệu thành cấu trúc JSON lồng nhau
    const coursesMap = {};
    let totalScoreSum = 0;
    let totalWeightSum = 0;

    result.recordset.forEach(row => {
      if (!coursesMap[row.course_id]) {
        coursesMap[row.course_id] = {
          course_id: row.course_id,
          course_code: row.course_code,
          title: row.course_title,
          sections: {}
        };
      }

      const course = coursesMap[row.course_id];

      if (!course.sections[row.section_id]) {
        course.sections[row.section_id] = {
          section_id: row.section_id,
          section_code: row.section_code,
          assignments: {},
          final_weighted_score: 0
        };
      }

      const section = course.sections[row.section_id];

      if (!section.assignments[row.assignment_id]) {
        section.assignments[row.assignment_id] = {
          assignment_id: row.assignment_id,
          title: row.assignment_title,
          weight_pct: row.weight_pct,
          max_score: row.max_score,
          submission: row.submission_id ? {
            submission_id: row.submission_id,
            status: row.submission_status,
            submitted_at: row.submitted_at,
            rubric_scores: [],
            total_score: 0
          } : null
        };
      }

      const assignment = section.assignments[row.assignment_id];

      if (assignment.submission) {
        if (row.criterion_id) {
          assignment.submission.rubric_scores.push({
            criterion_id: row.criterion_id,
            criterion_name: row.criterion_name,
            score: row.score
          });
          assignment.submission.total_score += row.score;
        }
      }
    });

    // Tính điểm trung bình có trọng số
    const courses = Object.values(coursesMap).map(course => {
      course.sections = Object.values(course.sections).map(section => {
        section.assignments = Object.values(section.assignments);

        // Tính final_weighted_score cho section
        let sectionScoreSum = 0;
        let sectionWeightSum = 0;
        section.assignments.forEach(a => {
          if (a.submission) {
            const normalizedScore = (a.submission.total_score / a.max_score) * 10; // quy đổi về thang 10
            const weightedScore = normalizedScore * (a.weight_pct / 100);
            sectionScoreSum += weightedScore;
            sectionWeightSum += a.weight_pct;
          }
        });
        section.final_weighted_score = sectionWeightSum > 0 ? (sectionScoreSum / (sectionWeightSum / 100)) : 0;

        totalScoreSum += sectionScoreSum;
        totalWeightSum += sectionWeightSum;

        return section;
      });
      return course;
    });

    const overall_average_score = totalWeightSum > 0 ? (totalScoreSum / (totalWeightSum / 100)) : 0;

    res.status(200).json({
      student_id: student.student_id,
      student_name: `${student.first_name} ${student.last_name}`,
      overall_average_score,
      courses
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGetGrades };