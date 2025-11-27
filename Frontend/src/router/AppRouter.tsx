import { Routes, Route } from "react-router-dom";
import Home from "../pages/student/Home";
import Login from "../pages/auth/Login";
import CourseLecturePage from "../pages/student/Courses/CourseDetail/CourseLecturePage";
import CourseAssignmentPage from "../pages/student/Courses/CourseDetail/CourseAssignmentPage";
import CourseQuizPage from "../pages/student/Courses/CourseDetail/CourseQuizPage";
// ... các page khác ...

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/student/home" element={<Home />} />
      {/* thêm các route tiếp theo */}
      <Route
        path="/student/courses/:courseId/sections/:sectionId/lectures"
        element={<CourseLecturePage />}
      />
      <Route
        path="/student/courses/:courseId/sections/:sectionId/assignments"
        element={<CourseAssignmentPage />}
      />
      <Route
        path="/student/courses/:courseId/sections/:sectionId/quizzes"
        element={<CourseQuizPage />}
      />
    </Routes>
  );
}
