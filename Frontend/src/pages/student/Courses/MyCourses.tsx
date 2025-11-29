import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../api/client";
import bgMyCourses from "../../../assets/images/elementDatabaseWeb5.png";
import logoutIcon from "../../../assets/images/elementDatabaseWeb4.png";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";

type Enrollment = {
  student_id: number;
  section_id: number;
  enrolled_at: string;
  status: string;
  origin: string;
};

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
    name: string;
  };
};

type MyCourseRow = {
  section_id: number;
  course_code: string;
  title: string;
  credits: number;
  language: string;
  teacher_name: string;
};

const MyCoursesPage: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const studentId = user?.id ?? 1; // Lấy từ context, fallback = 1

  const { data, isLoading, error } = useQuery({
    queryKey: ["myCourses"],
    queryFn: async (): Promise<MyCourseRow[]> => {
      try {
        const enrollRes = await api.get<{ student_id: number; enrollments: Enrollment[] }>("/enrollments");
        const enrollments = enrollRes.data.enrollments;
        if (!enrollments.length) return [];

        const coursesRes = await api.get<{ courses: Course[] }>("/courses");
        const courses = coursesRes.data.courses;

        const sectionsMap = new Map<number, { course: Course; section: Section }>();
        await Promise.all(
          courses.map(async (course) => {
            const secRes = await api.get<{ course_id: number; sections: Section[] }>(
              `/courses/${course.course_id}/sections`
            );
            secRes.data.sections.forEach((sec) => {
              sectionsMap.set(sec.section_id, { course, section: sec });
            });
          })
        );

        const rows: MyCourseRow[] = enrollments
          .map((enr) => {
            const found = sectionsMap.get(enr.section_id);
            if (!found) return null;
            return {
              section_id: enr.section_id,
              course_code: found.course.course_code,
              title: found.course.title,
              credits: found.course.credits,
              language: found.course.language,
              teacher_name: found.section.teacher?.name || "Teacher Unavailable",
            };
          })
          .filter(Boolean) as MyCourseRow[];

        return rows;
      } catch (err) {
        throw new Error("Error fetching course data.");
      }
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `url(${bgMyCourses})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Inter, sans-serif",
        color: "#fff",
        position: "relative",
      }}
    >
      {/* MENU OVERLAY */}
      {openMenu && (
        <div
          onClick={() => setOpenMenu(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.25)",
            zIndex: 998,
          }}
        >
          {/* MENU BOX */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              height: "100vh",
              width: "420px",
              backgroundColor: "#E84040",
              padding: "50px 40px",
              zIndex: 999,
              display: "flex",
              flexDirection: "column",
              rowGap: "32px",
              color: "#fff",
              fontSize: "26px",
              fontWeight: 500,
            }}
          >
            <a href="/student/home" style={{ textDecoration: "none", color: "white" }}>
              TRANG CHỦ
            </a>
            <a href="/student/courses" style={{ textDecoration: "none", color: "white" }}>
              KHOÁ HỌC
            </a>
            <a href="/student/roadmaps" style={{ textDecoration: "none", color: "white" }}>
              LỘ TRÌNH HỌC
            </a>
            <a
              href={`/students/${studentId}/grades`}
              style={{ textDecoration: "none", color: "white" }}
            >
              BẢNG ĐIỂM
            </a>
            <a
              href={`/students/${studentId}/certificates`}
              style={{ textDecoration: "none", color: "white" }}
            >
              CHỨNG CHỈ
            </a>
            <a
              href={`/students/${studentId}/profile`}
              style={{ textDecoration: "none", color: "white" }}
            >
              THÔNG TIN CÁ NHÂN
            </a>

            {/* LOGOUT */}
            <div
              onClick={handleLogout}
              style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
              }}
            >
              <img
                src={logoutIcon}
                alt="logout"
                style={{ width: "28px", height: "28px", objectFit: "contain" }}
              />
              <span style={{ color: "white" }}>ĐĂNG XUẤT</span>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "32px 16px 40px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          onClick={() => setOpenMenu(true)}
          style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }}
        >
          <span style={{ width: 40, height: 3, backgroundColor: "#fff" }} />
          <span style={{ width: 40, height: 3, backgroundColor: "#fff" }} />
          <span style={{ width: 40, height: 3, backgroundColor: "#fff" }} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
          Xem các khoá học của tôi
        </h1>
        <button
          onClick={() => navigate("/student/register")}
          style={{
            padding: "12px 28px",
            borderRadius: 8,
            backgroundColor: "#fff",
            border: "2px solid #fff",
            color: "#E84040",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Đăng ký khoá học
        </button>
      </div>

      {/* BODY */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px 40px 16px" }}>
        <div style={{ maxHeight: "520px", overflowY: "auto", paddingRight: 6 }}>
          {/* header row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 3fr 2fr 1fr 1fr 1.5fr",
              color: "#fff",
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            <span>Mã môn</span>
            <span>Môn học</span>
            <span>Giảng viên</span>
            <span>Tín chỉ</span>
            <span>Ngôn ngữ</span>
            <span></span>
          </div>

          {isLoading && <p>Đang tải khoá học...</p>}
          {error && <p>Lỗi tải dữ liệu.</p>}
          {!isLoading && !error && data?.length === 0 && <p>Hiện chưa có khoá học nào.</p>}

          {data?.map((c) => (
            <div
              key={c.section_id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 40,
                padding: "18px 32px",
                marginBottom: 18,
                display: "grid",
                gridTemplateColumns: "1fr 3fr 2fr 1fr 1fr 1.5fr",
                alignItems: "center",
                color: "#E84040",
              }}
            >
              <span>{c.course_code}</span>
              <span>{c.title}</span>
              <span>{c.teacher_name}</span>
              <span>{c.credits}</span>
              <span>{c.language}</span>
              <Link
                to={`/student/course/${c.section_id}/lectures`}
                style={{ textDecoration: "underline", fontStyle: "italic", color: "#E84040" }}
              >
                Xem khoá học
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCoursesPage;
