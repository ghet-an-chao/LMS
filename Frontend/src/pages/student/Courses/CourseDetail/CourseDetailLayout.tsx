// src/pages/student/CourseDetail/CourseDetailLayout.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import bg5 from "../../../../assets/images/elementDatabaseWeb5.png";

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
  const { courseId, sectionId } = useParams<{
    courseId: string;
    sectionId: string;
  }>();

  const goTab = (tab: "lectures" | "assignments" | "quizzes") => {
    if (!courseId || !sectionId) return;
    navigate(`/student/courses/${courseId}/sections/${sectionId}/${tab}`);
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
      <div
        style={{
          width: "100%",
          maxWidth: "1440px",
          padding: "24px 64px 40px",
          color: "#fff",
          boxSizing: "border-box",
        }}
      >
        {/* ICON MENU 3 GẠCH – GIỐNG TRANG CHỦ, MÀU TRẮNG */}
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
            onClick={() => navigate("/student/home")}
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
                  onClick={() =>
                    goTab(tab.key as "lectures" | "assignments" | "quizzes")
                  }
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

        {/* THÔNG TIN MÔN HỌC */}
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

        {/* KHUNG SCROLL CỐ ĐỊNH CHO NỘI DUNG */}
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
