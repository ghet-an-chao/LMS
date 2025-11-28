import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getSectionLectures, type GetLecturesResponse } from "../../../../api/lecture.api";
import { CourseDetailLayout } from "./CourseDetailLayout";

const CourseLecturePage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [openId, setOpenId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery<GetLecturesResponse>({
    queryKey: ["lectures", sectionId],
    enabled: !!sectionId,
    queryFn: () => getSectionLectures(sectionId!), // sectionId is definitely present when enabled = true
  });

  const lectures = data?.lectures ?? [];

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <CourseDetailLayout
      activeTab="lectures"
      courseCode=""
      courseTitle="XEM BÀI GIẢNG"
      teacherName=""
      language=""
    >
      {isLoading && <p>Đang tải danh sách bài giảng...</p>}
      {error && <p style={{ color: "#ffdede" }}>Lỗi tải dữ liệu Lecture.</p>}

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
              {/* TITLE + ARROW */}
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

              {/* CONTENT */}
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
                      color: "black",
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

      {!isLoading && lectures.length === 0 && <p>Chưa có bài giảng nào.</p>}
    </CourseDetailLayout>
  );
};

export default CourseLecturePage;
