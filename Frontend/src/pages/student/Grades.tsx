import React, { useState, useEffect } from "react";
import { api } from "../../api/client";
import logoutIcon from "../../assets/images/elementDatabaseWeb4.png";
import bg7 from "../../assets/images/elementDatabaseWeb7.png";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { logoutApi } from "../../api/auth.api"; 

// Định nghĩa kiểu dữ liệu cho bảng điểm
type Grade = {
  course_code: string;
  title: string;
  final_weighted_score: number;
  status: string;
};

const GradesPage: React.FC = () => {
  const { studentId: paramId } = useParams<{ studentId: string }>();
  const { user, logout } = useAuth();
  const studentId = paramId ?? String(user?.id ?? 1); // Lấy id sinh viên từ param hoặc từ context

  const [grades, setGrades] = useState<Grade[]>([]);  // Danh sách điểm
  const [averageScore, setAverageScore] = useState<number | null>(null);  // Điểm trung bình
  const [openMenu, setOpenMenu] = useState(false);

  // Hàm gọi API để lấy điểm trung bình
  useEffect(() => {
    const fetchAverageScore = async () => {
      try {
        const res = await api.get(`/students/${studentId}/average-score`);
        setAverageScore(res.data.average_score);  // Lưu điểm trung bình vào state
      } catch (error) {
        console.error("Failed to fetch average score", error);
      }
    };

    fetchAverageScore();  // Gọi API khi component mount
  }, [studentId]);

  // Hàm gọi API để lấy bảng điểm
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await api.get(`/students/${studentId}/grades`);
        setGrades(res.data.grades);  // Lưu điểm vào state
      } catch (error) {
        console.error("Failed to fetch grades", error);
      }
    };

    fetchGrades();  // Gọi API khi component mount
  }, [studentId]);

    const handleLogoutClick = async () => {
      try {
        await logoutApi();                        // gọi POST /auth/logout (có kèm Bearer token)
      } catch (err) {
        console.error("Logout API error:", err);
        // vẫn tiếp tục logout phía client
      } finally {
        logout();                                 // xoá token + user + redirect /login
      }
    };
  return (
    <div
      style={{
        backgroundImage: `url(${bg7})`,
        backgroundSize: "100% auto",
        backgroundPosition: "center",
        padding: "20px",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
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

            <div
              onClick={handleLogoutClick}
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
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "32px 16px 40px 16px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div
          onClick={() => setOpenMenu(true)}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginRight: "20px",
          }}
        >
          <span style={{ width: "40px", height: "3px", backgroundColor: "#fff" }} />
          <span style={{ width: "40px", height: "3px", backgroundColor: "#fff" }} />
          <span style={{ width: "40px", height: "3px", backgroundColor: "#fff" }} />
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>BẢNG ĐIỂM</h1>
      </div>

      {/* CONTENT */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          color: "#fff",
          overflowY: "auto",
          maxHeight: "calc(100vh - 120px)",
          paddingRight: "6px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 3fr 2fr 1fr",
            color: "#fff",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          <div>Mã môn</div>
          <div>Môn học</div>
          <div>GPA</div>
          <div>Trạng thái</div>
        </div>

        {grades.length === 0 && <p>Chưa có dữ liệu điểm nào.</p>}

        {grades.map((grade) => (
          <div
            key={grade.course_code}
            style={{
              backgroundColor: "#fff",
              borderRadius: 40,
              padding: "18px 32px",
              marginBottom: 18,
              display: "grid",
              gridTemplateColumns: "1fr 3fr 2fr 1fr",
              alignItems: "center",
              color: "#E84040",
            }}
          >
            <div>{grade.course_code}</div>
            <div>{grade.title}</div>
            <div>{grade.final_weighted_score}</div>
            <div>{grade.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradesPage;
