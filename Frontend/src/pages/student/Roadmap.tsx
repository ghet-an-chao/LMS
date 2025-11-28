import React, { useState, useEffect } from "react";
import { api } from "../../api/client"; // API client
import bg7 from "../../assets/images/elementDatabaseWeb7.png"; // Adjust background
import logoutIcon from "../../assets/images/elementDatabaseWeb4.png";
import { useParams } from "react-router-dom";


const RoadmapPage: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [openMenu, setOpenMenu] = useState(false);
  const { studentId } = useParams<{ studentId: string }>();

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await api.get("/student/roadmaps"); // Correct API endpoint
        setRoadmaps(res.data.roadmaps);
      } catch (error) {
        console.error("Failed to fetch roadmaps", error);
      }
    };

    fetchRoadmaps();
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${bg7})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ======================= MENU OVERLAY ======================= */}
      {openMenu && (
        <div
          onClick={() => setOpenMenu(false)} // Bấm ra ngoài → đóng menu
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.25)", // lớp mờ
            zIndex: 998,
          }}
        >
          {/* MENU BOX */}
          <div
            onClick={(e) => e.stopPropagation()} // bấm bên trong KHÔNG đóng
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
            <a href="/student/home" style={{ textDecoration: "none", color: "white" }}>TRANG CHỦ</a>
            <a href="/student/courses" style={{ textDecoration: "none", color: "white" }}>KHOÁ HỌC</a>
            <a href="/student/roadmaps" style={{ textDecoration: "none", color: "white" }}>LỘ TRÌNH HỌC</a>
            <a href={`/students/${studentId}/grades`} style={{ textDecoration: "none", color: "white" }}>BẢNG ĐIỂM</a>
            <a href={`/students/${studentId}/certificates`} style={{ textDecoration: "none", color: "white" }}>CHỨNG CHỈ</a>
            <a href={`/students/${studentId}/profile`} style={{ textDecoration: "none", color: "white" }}>THÔNG TIN CÁ NHÂN</a>

            {/* LOGOUT */}
            <div
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

      {/* ======================= HEADER ======================= */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "32px 16px 40px 16px",
          display: "flex",
          justifyContent: "flex-start",  // Sửa lại canh trái
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
            marginRight: "20px",  // Cách xa hơn một chút
          }}
        >
          <span style={{ width: "40px", height: "3px", backgroundColor: "#fff" }} />
          <span style={{ width: "40px", height: "3px", backgroundColor: "#fff" }} />
          <span style={{ width: "40px", height: "3px", backgroundColor: "#fff" }} />
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>LỘ TRÌNH HỌC</h1>
      </div>

      {/* ======================= ROADMAP CONTENT ======================= */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          color: "#fff",
          overflowY: "auto",
          maxHeight: "calc(100vh - 120px)",  // Fix chiều cao và cuộn
          paddingRight: "6px",
        }}
      >
        {roadmaps.map((roadmap) => (
          <div
            key={roadmap.id}
            style={{
              border: "2px solid white",
              padding: "20px",
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.45)",
              marginBottom: "30px",
            }}
          >
            <h2>{roadmap.title}</h2>
            <p>Số khóa học: {roadmap.courses.length}</p>
            <p>Mô tả: {roadmap.description}</p>
            <p>Tips: {roadmap.tips}</p>

            {/* Course Details */}
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              {roadmap.courses.map((course: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    border: "2px solid white",
                    borderRadius: "10px",
                    padding: "10px",
                    width: "200px",
                    backgroundColor: "#E84040",
                  }}
                >
                  <h4>{course.code} - {course.title}</h4>
                  <p>{course.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapPage;
