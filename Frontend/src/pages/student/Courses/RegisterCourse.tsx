import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../../../api/client";
import { useNavigate, Link } from "react-router-dom";
import logoutIcon from "../../../assets/images/elementDatabaseWeb4.png";

type Course = {
  course_id: number;
  course_code: string;
  title: string;
  credits: number;
  language: string;
  description: string;
  pass_threshold_pct: number;
  price_vnd: number;
};

type Section = {
  section_id: number;
  section_code: string;
  semester_no: number;
  created_at: string;
  teacher: {
    teacher_id: number;
    name: string | null; // name có thể là null
  } | null; // section có thể là null
};

type DisplayRow = {
  course: Course;
  section: Section | null;
};

const RegisterCoursePage: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["registerCourses"],
    queryFn: async (): Promise<DisplayRow[]> => {
      const coursesRes = await api.get<{ courses: Course[] }>("/courses");
      const courses = coursesRes.data.courses;

      const rows: DisplayRow[] = [];
      for (const course of courses) {
        const secRes = await api.get<{ course_id: number; sections: Section[] }>(`/courses/${course.course_id}/sections`);
        const sections = secRes.data.sections;
        rows.push({
          course,
          section: sections[0] ?? null, // Lấy section đầu tiên nếu có
        });
      }

      return rows;
    },
  });

  // Xử lý trường hợp không cần dùng payMutation
  const handleRegister = (courseId: number, sectionId: number) => {
    navigate(`/student/payment/${courseId}/${sectionId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", backgroundColor: "#ffffff", color: "#E84040", fontFamily: "Inter, sans-serif" }}>
      {openMenu && (
        <div
          onClick={() => setOpenMenu(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.35)',
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              height: '100%',
              width: 320,
              backgroundColor: '#E84040',
              padding: '40px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              color: '#fff',
              fontSize: 22,
            }}
          >
            <Link to="/student/home" style={{ color: "#fff", textDecoration: "none" }}>TRANG CHỦ</Link>
            <Link to="/student/courses" style={{ color: "#fff", textDecoration: "none" }}>KHOÁ HỌC CỦA TÔI</Link>
            <Link to="/student/register" style={{ color: "#fff", textDecoration: "none" }}>ĐĂNG KÝ KHOÁ HỌC</Link>
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
              onClick={() => {
                localStorage.removeItem("accessToken");
                window.location.href = "/login"; 
              }}
            >
              <img src={logoutIcon} alt="logout" style={{ width: 22, height: 22, objectFit: "contain" }} />
              <span>ĐĂNG XUẤT</span>
            </div>
          </div>
        </div>
      )}
      {/* HEADER */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px 40px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div onClick={() => setOpenMenu(true)} style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ width: 40, height: 3, backgroundColor: "#E84040" }} />
          <span style={{ width: 40, height: 3, backgroundColor: "#E84040" }} />
          <span style={{ width: 40, height: 3, backgroundColor: "#E84040" }} />
        </div>

        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>Đăng ký khoá học</h1>
      </div>

      {/* BODY */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px 40px 16px" }}>
        <div style={{ maxHeight: "520px", overflowY: "auto", paddingRight: 6 }}>
          {/* header row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr 2fr 1fr 1fr 1.5fr 1.2fr", fontWeight: 600, marginBottom: 18 }}>
            <span>Mã môn</span>
            <span>Môn học</span>
            <span>Giảng viên</span>
            <span>Tín chỉ</span>
            <span>Ngôn ngữ</span>
            <span>Giá tiền</span>
            <span></span>
          </div>

          {isLoading && <p>Đang tải danh sách khoá học...</p>}
          {error && <p>Lỗi tải dữ liệu.</p>}

          {data?.map(({ course, section }) => (
            <div key={course.course_id} style={{ backgroundColor: "#E84040", borderRadius: 40, padding: "18px 32px", marginBottom: 18, display: "grid", gridTemplateColumns: "1fr 3fr 2fr 1fr 1fr 1.5fr 1.2fr", alignItems: "center", color: "#fff" }}>
              <span>{course.course_code}</span>
              <span>{course.title}</span>
              <span>{section?.teacher?.name || "Giảng viên chưa cập nhật"}</span> {/* An toàn khi teacher không có */}
              <span>{course.credits}</span>
              <span>{course.language}</span>
              <span>{course.price_vnd.toLocaleString("vi-VN")}</span>

              {section ? (
                <button onClick={() => handleRegister(course.course_id, section.section_id)} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontWeight: 600 }}>
                  Đăng ký
                </button>
              ) : (
                <span>Chưa mở lớp</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisterCoursePage;
