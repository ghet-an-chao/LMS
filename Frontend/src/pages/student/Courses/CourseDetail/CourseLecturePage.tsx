// src/pages/student/Courses/CourseLecturePage.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  getSectionLectures,
  type GetLecturesResponse,
} from "../../../../api/lecture.api";
import { CourseDetailLayout } from "./CourseDetailLayout";

const CourseLecturePage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [openId, setOpenId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery<GetLecturesResponse>({
    queryKey: ["lectures", sectionId],
    enabled: !!sectionId,
    queryFn: () => getSectionLectures(sectionId!), // sectionId chắc chắn có khi enabled = true
  });

  const lectures = data?.lectures ?? [];

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <CourseDetailLayout
      activeTab="lectures"
      courseCode="CS101"
      courseTitle="Introduction to Programming"
      teacherName="Thuy Do"
      language="EN"
    >
      {isLoading && <p>Đang tải danh sách bài giảng...</p>}
      {error && (
        <p style={{ color: "#ffdede" }}>
          Lỗi tải dữ liệu Lecture (kiểm tra server / database).
        </p>
      )}

      {lectures
        .slice()
        .sort((a, b) => (a.position || 0) - (b.position || 0))
        .map((lec) => {
          const isOpen = openId === lec.lecture_id;
          return (
            <div
              key={lec.lecture_id}
              style={{
                marginBottom: "20px",
                borderRadius: "40px",
                border: "2px solid #FFFFFF",
                background: "rgba(255,255,255,0.45)",
                overflow: "hidden",
              }}
            >
              {/* HÀNG TIÊU ĐỀ + MŨI TÊN */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 28px",
                  cursor: "pointer",
                }}
                onClick={() => toggle(lec.lecture_id)}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#E84040",
                  }}
                >
                  {lec.title}
                </div>

                {/* Mũi tên tam giác */}
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderTop: !isOpen ? "14px solid #FFFFFF" : "none",
                    borderBottom: isOpen ? "14px solid #FFFFFF" : "none",
                    transition: "all 0.2s",
                  }}
                />
              </div>

              {/* NỘI DUNG */}
              {isOpen && (
                <>
                  <div
                    style={{
                      height: "1px",
                      backgroundColor: "#FFFFFF",
                      margin: "0 20px 16px",
                    }}
                  />
                  <div
                    style={{
                      padding: "0 28px 22px",
                      fontSize: "18px",
                      color: "#E84040",
                    }}
                  >
                    <p style={{ marginBottom: "10px" }}>
                      <strong>Content URL:</strong>{" "}
                      {lec.content_url || "Chưa cập nhật"}
                    </p>
                    <p>
                      <strong>Reference Links:</strong>{" "}
                      {lec.reference_links || "Chưa cập nhật"}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}

      {!isLoading && lectures.length === 0 && (
        <p>Hiện chưa có bài giảng nào cho lớp học phần này.</p>
      )}
    </CourseDetailLayout>
  );
};

export default CourseLecturePage;
