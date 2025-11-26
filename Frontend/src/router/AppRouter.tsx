import { Routes, Route } from "react-router-dom";
import Home from "../pages/student/Home";
import Login from "../pages/auth/Login";
// ... các page khác ...

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/student/home" element={<Home />} />
      {/* thêm các route tiếp theo */}
    </Routes>
  );
}
