import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/student/Home";
import MyCoursesPage from './pages/student/Courses/MyCourses';
import RegisterCoursePage from './pages/student/Courses/RegisterCourse';
import CourseLecturePage from './pages/student/Courses/CourseDetail/CourseLecturePage';
import CourseAssignmentPage from './pages/student/Courses/CourseDetail/CourseAssignmentPage';
import CourseQuizPage from './pages/student/Courses/CourseDetail/CourseQuizPage';
import PaymentPage from './pages/student/Courses/Payment';
import RoadmapPage from "./pages/student/Roadmap";
import GradePage from "./pages/student/Grades";  
import CertificatePage from "./pages/student/Certificates"; 
import ProfilePage from "./pages/student/Profile";   
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student/home" />} />
      <Route path="/student/home" element={<Home />} />
      <Route path="/student/courses" element={<MyCoursesPage />} />
      <Route path="/student/register" element={<RegisterCoursePage />} />
      <Route path="/student/payment/:courseId/:sectionId" element={<PaymentPage />} />
      <Route path="/student/course/:sectionId/lectures" element={<CourseLecturePage />} />
      <Route path="/student/course/:sectionId/assignments" element={<CourseAssignmentPage />} />
      <Route path="/student/course/:sectionId/quizzes" element={<CourseQuizPage />} />
      <Route path="/student/roadmaps" element={<RoadmapPage />} />
      <Route path="/students/:studentId/grades" element={<GradePage />} />
      <Route path="/students/:studentId/certificates" element={<CertificatePage />} />
      <Route path="/students/:studentId/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default App;
