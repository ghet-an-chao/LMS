const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

const STUDENT_ID = 1;

// ----- Mock Data -----
// Users
const users = [
  { user_id: 1, username: "huytran", first_name: "Huy", last_name: "Tran", email: "huy.tran@example.com", role: "student", status: "active" },
  // Add more users if needed...
];

// Courses
const courses = [
  { course_id: 1, course_code: "CS101", title: "Introduction to Programming", credits: 3, language: "EN", description: "Learn basic programming concepts.", pass_threshold_pct: 60, price_vnd: 1500000 },
  { course_id: 2, course_code: "MATH201", title: "Advanced Calculus", credits: 4, language: "VN", description: "In-depth study of calculus.", pass_threshold_pct: 65, price_vnd: 1800000 }
];

// Sections
const sections = [
  { section_id: 101, course_id: 1, section_code: "CS101-A", semester_no: 1, teacher_id: 1, teacher_name: "Thuy Do" },
  { section_id: 201, course_id: 2, section_code: "MATH201-B", semester_no: 1, teacher_id: 2, teacher_name: "Linh Pham" }
];

// Enrollments
const enrollments = [
  { student_id: 1, section_id: 101, enrolled_at: "2025-01-10", status: "enrolled", origin: "manual" }
];

// Assignments
const assignmentsBySection = {
  101: [
    { assignment_id: 1, section_id: 101, created_by: 1, title: "Assignment 1: Hello World", weight_pct: 20, due_at: "2025-11-20T23:59:00Z", max_score: 10 },
    { assignment_id: 2, section_id: 101, created_by: 1, title: "Assignment 2: Loop Programming", weight_pct: 30, due_at: "2025-12-01T23:59:00Z", max_score: 10 }
  ]
};

// Quizzes
const quizzesBySection = {
  101: [
    { quiz_id: 1, section_id: 101, created_by: 1, title: "Quiz 1: Variables", time_limit_min: 30, attempts_allowed: 5 },
    { quiz_id: 2, section_id: 101, created_by: 1, title: "Quiz 2: Loop Programming", time_limit_min: 20, attempts_allowed: null }
  ]
};

// Lectures (New Mock Data)
const lecturesBySection = {
  101: [
    { lecture_id: 1, section_id: 101, created_by: 1, title: "Intro to Programming", content_url: "https://example.com/lectures/1", reference_links: "https://docs.example.com", position: 1 },
    { lecture_id: 2, section_id: 101, created_by: 1, title: "Variables and Data Types", content_url: "https://example.com/lectures/2", reference_links: "https://programmingexample.com", position: 2 }
  ],
  201: [
    { lecture_id: 3, section_id: 201, created_by: 2, title: "Calculus Overview", content_url: "https://example.com/lectures/3", reference_links: "https://math.com", position: 1 }
  ]
};

// ----- Routes -----
// 1. Authentication - Login and Register
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && password === "123456");

  if (!user) {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid email or password" });
  }

  const accessToken = "jwt_token_here"; // Fake JWT token
  res.json({
    accessToken,
    user: { ...user }
  });
});

// 2. Get user profile
app.get("/users/me", (req, res) => {
  const user = users.find((u) => u.user_id === STUDENT_ID);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

// 3. Courses
app.get("/courses", (req, res) => {
  res.json({ courses });
});

// Get sections for a course
app.get("/courses/:courseId/sections", (req, res) => {
  const courseId = Number(req.params.courseId);
  const courseSections = sections.filter((s) => s.course_id === courseId);
  res.json({ course_id: courseId, sections: courseSections });
});

// 4. Enrollments
app.get("/enrollments", (req, res) => {
  const studentEnrollments = enrollments.filter((e) => e.student_id === STUDENT_ID);
  res.json({ student_id: STUDENT_ID, enrollments: studentEnrollments });
});

// 5. Assignments
app.get("/sections/:sectionId/assignments", (req, res) => {
  const sectionId = Number(req.params.sectionId);
  const assignments = assignmentsBySection[sectionId] || [];
  res.json({ assignments });
});

// 6. Quizzes
app.get("/sections/:sectionId/quizzes", (req, res) => {
  const sectionId = Number(req.params.sectionId);
  const quizzes = quizzesBySection[sectionId] || [];
  res.json({ quizzes });
});

// 7. Lectures - Get lectures for a section
app.get("/sections/:sectionId/lectures", (req, res) => {
  const sectionId = Number(req.params.sectionId);
  const lectures = lecturesBySection[sectionId] || [];
  res.json({ lectures });
});

// 8. Payment / Enrollment
app.get("/bill/:courseId/:sectionId", (req, res) => {
  const courseId = Number(req.params.courseId);
  const sectionId = Number(req.params.sectionId);

  const course = courses.find((c) => c.course_id === courseId);
  const section = sections.find((s) => s.section_id === sectionId);

  if (!course || !section) {
    return res.status(404).json({ message: "Course/Section not found" });
  }

  res.json({
    course_id: course.course_id,
    course_code: course.course_code,
    course_title: course.title,
    teacher_name: section.teacher_name,
    price_vnd: course.price_vnd,
    section_id: section.section_id,
    section_code: section.section_code,
    lectures: lecturesBySection[sectionId] || []  // Add lectures data here
  });
});

// Make a payment (Mock)
app.post("/pay", (req, res) => {
  const { course_id, section_id } = req.body;

  const existing = enrollments.find(
    (e) => e.student_id === STUDENT_ID && e.section_id === Number(section_id)
  );

  if (!existing) {
    enrollments.push({
      student_id: STUDENT_ID,
      section_id: Number(section_id),
      enrolled_at: new Date().toISOString(),
      status: "enrolled",
      origin: "payment_mock"
    });
  }

  res.json({ status: "ok", message: "Payment successful (mock)" });
});

// 9. Grades
app.get("/students/:studentId/grades", (req, res) => {
  const studentId = Number(req.params.studentId);
  const grades = [
    { course_code: "CS101", title: "Introduction to Programming", final_weighted_score: 8.5, status: "passed" },
    { course_code: "MATH201", title: "Advanced Calculus", final_weighted_score: 7.0, status: "failed" }
  ];
  res.json({ student_id: studentId, grades });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});

const roadmaps = [
  {
    id: 1,
    title: "Programming Roadmap",
    description: "Learn programming from basics to advanced.",
    tips: "Start with variables and loops.",
    courses: [
      { code: "CS101", title: "Introduction to Programming", description: "Beginner level course." },
      { code: "CS102", title: "Advanced Programming", description: "Intermediate level course." },
      { code: "CS201", title: "DSA", description: "Data Structures and Algorithms." }
    ]
  },
  {
    id: 2,
    title: "Calculus Roadmap",
    description: "Master calculus step by step.",
    tips: "Ensure you understand limits before moving forward.",
    courses: [
      { code: "MATH101", title: "Basic Calculus", description: "Introduction to calculus." },
      { code: "MATH201", title: "Advanced Calculus", description: "In-depth study of calculus." }
    ]
  }
];

app.get("/student/roadmaps", (req, res) => {
  res.json({ roadmaps });
});

// ----- Mock Data for Certificates -----
// Certificate Data
const certificates = [
  {
    course_code: "CS101",
    course_title: "Introduction to Programming",
    issued_on: "2025-11-30",
    expires_on: "2026-11-30",
    verify_code: "CERT001",
    status: "issued"
  },
  {
    course_code: "MATH201",
    course_title: "Advanced Calculus",
    issued_on: "2025-11-30",
    expires_on: null,
    verify_code: "CERT002",
    status: "issued"
  },
  {
    course_code: "EDU301",
    course_title: "Teaching Methodologies",
    issued_on: "2025-11-30",
    expires_on: "2026-11-30",
    verify_code: "CERT003",
    status: "revoked"
  }
];
app.get("/students/:studentId/certificates", (req, res) => {
  const studentId = req.params.studentId;

  // Trả về dữ liệu chứng chỉ mock
  const studentCertificates = certificates.filter(cert => cert.status === "issued");
  res.json(studentCertificates);
});

const students = [
  {
    user_id: 1,
    username: "huytran",
    first_name: "Huy",
    last_name: "Tran",
    email: "huytran@example.com",
    role: "student",
    status: "active"
  },
  // Add more mock students if needed
];

// Mock API route to fetch user profile by studentId
app.get('/students/:studentId/profile', (req, res) => {
  const studentId = req.params.studentId;
  // Find the student by ID (mock data)
  const student = students.find(u => u.user_id === parseInt(studentId));

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  // Return the mock student profile data
  res.json({
    user_id: student.user_id,
    username: student.username,
    first_name: student.first_name,
    last_name: student.last_name,
    email: student.email,
    role: student.role,
    status: student.status,
  });
});