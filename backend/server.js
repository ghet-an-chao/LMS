// backend/server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// ==================== MOCK DATA CƠ BẢN ====================
const STUDENT_ID = 1;

// ----- Courses -----
const courses = [
  {
    course_id: 1,
    course_code: "CS101",
    title: "Introduction to Programming",
    credits: 3,
    language: "EN",
    description: "Basics of programming with examples.",
    pass_threshold_pct: 50,
    price_vnd: 1500000,
  },
  {
    course_id: 2,
    course_code: "MATH201",
    title: "Advanced Calculus",
    credits: 4,
    language: "VN",
    description: "Giải tích nâng cao.",
    pass_threshold_pct: 50,
    price_vnd: 1800000,
  },
];

// ----- Sections -----
const sections = [
  {
    section_id: 101,
    course_id: 1,
    section_code: "CS101-A",
    semester_no: 1,
    created_at: "2025-01-01T00:00:00Z",
    teacher: {
      teacher_id: 1,
      name: "Thuy Do",
    },
  },
  {
    section_id: 201,
    course_id: 2,
    section_code: "MATH201-A",
    semester_no: 1,
    created_at: "2025-01-01T00:00:00Z",
    teacher: {
      teacher_id: 2,
      name: "Linh Pham",
    },
  },
];

// ----- Enrollments (khoá học của tôi) -----
let enrollments = [
  {
    student_id: STUDENT_ID,
    section_id: 101,
    enrolled_at: "2025-01-10T00:00:00Z",
    status: "enrolled",
    origin: "mock",
  },
];

// ----- Lectures theo section -----
const lecturesBySection = {
  101: [
    {
      lecture_id: 1,
      title: "Chap 1: Introduce to Programming",
      position: 1,
      content_url: "https://example.com/lecture1",
      reference_links: "https://docs.example.com/lec1",
    },
    {
      lecture_id: 2,
      title: "Chap 2: Basic Knowledge",
      position: 2,
      content_url: "https://example.com/lecture2",
      reference_links: "https://docs.example.com/lec2",
    },
  ],
  201: [
    {
      lecture_id: 3,
      title: "Chap 1: Review",
      position: 1,
      content_url: "https://example.com/lecture3",
      reference_links: "",
    },
  ],
};

// ----- Assignments -----
const assignmentsBySection = {
  101: [
    {
      assignment_id: 1,
      section_id: 101,
      created_by: 1,
      title: 'Assignment 1: Write a Program to Cout "Hello World"',
      weight_pct: 20,
      due_at: "2025-11-20T23:59:00Z",
      max_score: 10,
    },
    {
      assignment_id: 2,
      section_id: 101,
      created_by: 1,
      title: "Assignment 2: Write a Loop Program",
      weight_pct: 30,
      due_at: "2025-12-01T23:59:00Z",
      max_score: 10,
    },
  ],
};

let assignmentSubmissions = []; // chỉ để log demo

// ----- Quizzes -----
const quizzesBySection = {
  101: [
    {
      quiz_id: 1,
      section_id: 101,
      created_by: 1,
      title: "Quiz 1: Variables",
      time_limit_min: 30,
      attempts_allowed: 5,
    },
    {
      quiz_id: 2,
      section_id: 101,
      created_by: 1,
      title: "Quiz 2: Loop Program",
      time_limit_min: 20,
      attempts_allowed: null, // không giới hạn
    },
  ],
};

const quizQuestions = {
  1: [
    {
      question_id: 1,
      title: "Biến là gì?",
      question_type: "single_choice",
      options: [
        { option_id: 1, text: "Vùng nhớ có tên" },
        { option_id: 2, text: "Một hàng trong bảng" },
        { option_id: 3, text: "Một loại hàm" },
      ],
    },
    {
      question_id: 2,
      title: "Kiểu dữ liệu nào sau đây là số nguyên?",
      question_type: "single_choice",
      options: [
        { option_id: 4, text: "int" },
        { option_id: 5, text: "float" },
        { option_id: 6, text: "string" },
      ],
    },
  ],
};

let quizAttemptsStore = [
  {
    quiz_id: 1,
    student_id: STUDENT_ID,
    attempts: [
      {
        attempt_id: 1,
        attempt_no: 1,
        status: "finished",
        score: 8,
        start_at: "2025-01-20T10:00:00Z",
        end_at: "2025-01-20T10:25:00Z",
      },
    ],
  },
];

// ==================== MIDDLEWARE AUTH MOCK ====================
//  BỎ HẲN CHECK TOKEN: luôn coi như student_id = 1 đã login
function authMiddleware(req, res, next) {
  req.user = { user_id: STUDENT_ID, role: "student" };
  next();
}
app.use(authMiddleware);

// ==================== ROUTES ====================

// -------- Courses ----------
app.get("/courses", (req, res) => {
  res.json({ courses });
});

app.get("/courses/:courseId/sections", (req, res) => {
  const courseId = Number(req.params.courseId);
  const secs = sections.filter((s) => s.course_id === courseId);
  res.json({ course_id: courseId, sections: secs });
});

// -------- Enrollments (khoá học của tôi) ----------
app.get("/enrollments", (req, res) => {
  const studentEnrollments = enrollments.filter(
    (e) => e.student_id === req.user.user_id
  );
  res.json({
    student_id: req.user.user_id,
    enrollments: studentEnrollments,
  });
});

// -------- Lectures ----------
app.get("/sections/:sectionId/lectures", (req, res) => {
  const sectionId = Number(req.params.sectionId);
  const lectures = lecturesBySection[sectionId] || [];
  res.json({ section_id: sectionId, lectures });
});

// -------- Assignments ----------
app.get("/sections/:sectionId/assignments", (req, res) => {
  const sectionId = Number(req.params.sectionId);
  const assignments = assignmentsBySection[sectionId] || [];
  res.json({
    status: "ok",
    message: "assignments mock",
    assignments,
  });
});

app.post("/assignments/:assignmentId/submit", (req, res) => {
  const assignmentId = Number(req.params.assignmentId);
  const { content_url } = req.body || {};

  assignmentSubmissions.push({
    assignment_id: assignmentId,
    student_id: req.user.user_id,
    content_url,
    submitted_at: new Date().toISOString(),
  });

  res.json({ status: "ok", message: "submitted (mock)" });
});

// -------- Quizzes ----------
app.get("/sections/:sectionId/quizzes", (req, res) => {
  const sectionId = Number(req.params.sectionId);
  const quizzes = quizzesBySection[sectionId] || [];
  res.json({
    status: "ok",
    message: "quizzes mock",
    quizzes,
  });
});

app.post("/quizzes/:quizId/attempts", (req, res) => {
  const quizId = Number(req.params.quizId);
  const questions = quizQuestions[quizId] || [];
  const newAttemptId = Date.now();

  // lưu demo
  let quizItem = quizAttemptsStore.find(
    (q) => q.quiz_id === quizId && q.student_id === req.user.user_id
  );
  if (!quizItem) {
    quizItem = {
      quiz_id: quizId,
      student_id: req.user.user_id,
      attempts: [],
    };
    quizAttemptsStore.push(quizItem);
  }
  const attemptNo = quizItem.attempts.length + 1;
  quizItem.attempts.push({
    attempt_id: newAttemptId,
    attempt_no: attemptNo,
    status: "in_progress",
    score: 0,
    start_at: new Date().toISOString(),
    end_at: null,
  });

  res.json({
    attempt_id: newAttemptId,
    quiz_id: quizId,
    questions,
  });
});

app.patch("/quiz-attempts/:attemptId/submit", (req, res) => {
  const attemptId = Number(req.params.attemptId);
  const { answers } = req.body || [];

  quizAttemptsStore.forEach((quizItem) => {
    quizItem.attempts.forEach((a) => {
      if (a.attempt_id === attemptId) {
        a.status = "finished";
        a.score = 10; // luôn 10 điểm cho vui
        a.end_at = new Date().toISOString();
      }
    });
  });

  console.log("Quiz answers mock:", attemptId, answers);
  res.json({ status: "ok", message: "quiz submitted (mock)" });
});

app.get("/quizzes/:quizId/results", (req, res) => {
  const quizId = Number(req.params.quizId);
  const record = quizAttemptsStore.find(
    (q) => q.quiz_id === quizId && q.student_id === req.user.user_id
  );

  res.json(
    record || {
      quiz_id: quizId,
      student_id: req.user.user_id,
      attempts: [],
    }
  );
});

// -------- Bill & Payment ----------
app.get("/bill/:courseId/:sectionId", (req, res) => {
  const courseId = Number(req.params.courseId);
  const sectionId = Number(req.params.sectionId);

  const course = courses.find((c) => c.course_id === courseId);
  const section = sections.find((s) => s.section_id === sectionId);

  if (!course || !section) {
    return res.status(404).json({ message: "Course/Section not found" });
  }

  const lectures = lecturesBySection[sectionId] || [];

  res.json({
    course_id: course.course_id,
    course_code: course.course_code,
    course_title: course.title,
    price_vnd: course.price_vnd,
    section_id: section.section_id,
    section_code: section.section_code,
    lectures,
  });
});

app.post("/pay", (req, res) => {
  const { course_id, section_id } = req.body || {};

  // thêm enrollment nếu chưa có
  const existing = enrollments.find(
    (e) =>
      e.student_id === req.user.user_id && e.section_id === Number(section_id)
  );
  if (!existing) {
    enrollments.push({
      student_id: req.user.user_id,
      section_id: Number(section_id),
      enrolled_at: new Date().toISOString(),
      status: "paid",
      origin: "payment_mock",
    });
  }

  res.json({ status: "ok", message: "payment success (mock)" });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});
