import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import bg5 from "../../../../assets/images/elementDatabaseWeb5.png";
import logoutIcon from "../../../../assets/images/elementDatabaseWeb4.png";

interface CourseHeaderProps {
  activeTab: "lectures" | "assignments" | "quizzes";
  courseCode?: string;
  courseTitle?: string;
  teacherName?: string;
  language?: string;
}

export const CourseDetailLayout: React.FC<
  React.PropsWithChildren<CourseHeaderProps>
> = ({ activeTab, courseCode, courseTitle, teacherName, language, children }) => {
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId: string }>();

  const [openMenu, setOpenMenu] = useState(false);

  // Function to navigate between tabs (lectures, assignments, quizzes)
  const goTab = (tab: "lectures" | "assignments" | "quizzes") => {
    if (!sectionId) return;
    navigate(`/student/course/${sectionId}/${tab}`);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage: `url(${bg5})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        padding: "32px 0",
      }}
    >
      {/* ======================= MENU OVERLAY ======================= */}
      {openMenu && (
        <div
          onClick={() => setOpenMenu(false)} // Close menu when clicking outside
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.25)", // dark background
            zIndex: 998,
          }}
        >
          {/* MENU BOX */}
          <div
            onClick={(e) => e.stopPropagation()} // Don't close when clicking inside
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
            {/* Links */}
            <a href="/student/home" style={{ textDecoration: "none", color: "white" }}>
              TRANG CHỦ
            </a>
            <a href="/student/courses" style={{ textDecoration: "none", color: "white" }}>
              KHOÁ HỌC
            </a>
            <a
              onClick={() => goTab("lectures")}
              style={{
                textDecoration: "none",
                color: "white",
                cursor: "pointer"
              }}
            >
              Lecture
            </a>
            <a
              onClick={() => goTab("assignments")}
              style={{
                textDecoration: "none",
                color: "white",
                cursor: "pointer"
              }}
            >
              Assignment
            </a>
            <a
              onClick={() => goTab("quizzes")}
              style={{
                textDecoration: "none",
                color: "white",
                cursor: "pointer"
              }}
            >
              Quiz
            </a>

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

      {/* ======================= CONTENT ======================= */}
      <div
        style={{
          width: "100%",
          maxWidth: "1440px",
          padding: "24px 64px 40px",
          color: "#fff",
          boxSizing: "border-box",
        }}
      >
        {/* MENU ICON */}
        <div
          style={{
            position: "relative",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setOpenMenu(true)} // Open menu
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "48px",
                  height: "3px",
                  backgroundColor: "#FFFFFF",
                  marginBottom: i !== 2 ? "10px" : 0,
                }}
              />
            ))}
          </div>

          {/* TAB BUTTONS */}
          <div style={{ display: "flex", gap: "24px" }}>
            {[
              { key: "lectures", label: "Lecture" },
              { key: "assignments", label: "Assignment" },
              { key: "quizzes", label: "Quiz" },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => goTab(tab.key as "lectures" | "assignments" | "quizzes")}
                  style={{
                    padding: "12px 36px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    fontWeight: 600,
                    backgroundColor: isActive ? "#FFFFFF" : "transparent",
                    color: isActive ? "#E84040" : "#FFFFFF",
                    borderBottom: isActive ? "3px solid #FFFFFF" : "none",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* COURSE INFO */}
        <div
          style={{
            fontSize: "26px",
            fontWeight: 700,
            marginBottom: "24px",
          }}
        >
          {courseCode ? `${courseCode} - ` : ""}
          {courseTitle || "Course title"}{" "}
          {teacherName ? `- ${teacherName}` : ""}{" "}
          {language ? `- ${language}` : ""}
        </div>

        {/* SCROLLABLE CONTENT */}
        <div
          style={{
            maxHeight: "70vh",
            overflowY: "auto",
            paddingRight: "8px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
