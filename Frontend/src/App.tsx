import AppRouter from "./router/AppRouter";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/student/Home";
import MyCoursesPage from "./pages/student/Courses/MyCourses";
import RegisterCoursePage from "./pages/student/Courses/RegisterCourse";
import PaymentPage from "./pages/student/Courses/Payment";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student/home" />} />
      <Route path="/student/home" element={<Home />} />
      <Route path="/student/courses" element={<MyCoursesPage />} />
      <Route path="/student/register" element={<RegisterCoursePage />} />
      <Route path="/student/payment/:courseId/:sectionId" element={<PaymentPage />} />

      {/* các route khác của bạn */}
    </Routes>
  );
};

export default App;