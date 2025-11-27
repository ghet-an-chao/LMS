// src/pages/student/Courses/CourseAssignmentPage.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  type Assignment,
  type GetAssignmentsResponse,
  getSectionAssignments,
  submitAssignmentApi,
} from "../../../../api/assignment.api";
import { CourseDetailLayout } from "./CourseDetailLayout";

const getStatus = (due_at: string | null): "on_time" | "late" | "missing" => {
  if (!due_at) return "missing";
  const due = new Date(due_at).getTime();
  const now = Date.now();
  return now <= due ? "on_time" : "late";
};

const statusColor: Record<string, string> = {
  on_time: "limegreen",
  late: "#ff5252",
  missing: "#ffd740",
};

const CourseAssignmentPage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [openId, setOpenId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitLink, setSubmitLink] = useState("");
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(
    null
  );

  const { data, isLoading, error, refetch } =
    useQuery<GetAssignmentsResponse>({
      queryKey: ["assignments", sectionId],
      enabled: !!sectionId,
      queryFn: () => getSectionAssignments(sectionId!),
    });

  const submitMutation = useMutation({
    mutationFn: (payload: { assignmentId: number; url: string }) =>
      submitAssignmentApi({
        assignmentId: payload.assignmentId,
        content_url: payload.url,
      }),
    onSuccess: () => {
      setShowModal(false);
      setSubmitLink("");
      refetch();
      alert("Nộp bài thành công (kiểm tra lại DB nếu cần).");
    },
    onError: () => {
      alert("Nộp bài thất bại. Kiểm tra server / dữ liệu.");
    },
  });

  const assignments = data?.assignments ?? [];

  const handleOpenModal = (assignment: Assignment) => {
    setCurrentAssignment(assignment);
    setShowModal(true);
  };

  return (
    <>
      <CourseDetailLayout
        activeTab="assignments"
        courseCode="CS101"
        courseTitle="Introduction to Programming"
        teacherName="Thuy Do"
        language="EN"
      >
        {isLoading && <p>Đang tải Assignment...</p>}
        {error && (
          <p style={{ color: "#ffdede" }}>
            Lỗi tải Assignment (kiểm tra server / database).
          </p>
        )}

        {assignments.map((a) => {
          const isOpen = openId === a.assignment_id;
          const stat = getStatus(a.due_at);
          return (
            <div
              key={a.assignment_id}
              style={{
                marginBottom: "20px",
                borderRadius: "40px",
                border: "2px solid #FFFFFF",
                background: "rgba(255,255,255,0.45)",
                overflow: "hidden",
              }}
            >
              {/* HÀNG TIÊU ĐỀ */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 28px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setOpenId((prev) =>
                    prev === a.assignment_id ? null : a.assignment_id
                  )
                }
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#E84040",
                  }}
                >
                  {a.title}
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
                    <p style={{ marginBottom: "8px" }}>
                      <strong>Tỉ trọng:</strong> {a.weight_pct}%
                    </p>
                    <p style={{ marginBottom: "8px" }}>
                      <strong>Điểm tối đa:</strong> {a.max_score}
                    </p>
                    <p style={{ marginBottom: "8px" }}>
                      <strong>Hết hạn:</strong>{" "}
                      {a.due_at ? new Date(a.due_at).toLocaleString() : "N/A"}
                    </p>
                    <p style={{ marginBottom: "22px" }}>
                      <strong>Tình trạng: </strong>
                      <span style={{ color: statusColor[stat] }}>
                        {stat === "on_time"
                          ? "on_time"
                          : stat === "late"
                          ? "late"
                          : "missing"}
                      </span>
                    </p>

                    <div style={{ textAlign: "right" }}>
                      <button
                        onClick={() => handleOpenModal(a)}
                        style={{
                          padding: "10px 34px",
                          borderRadius: "24px",
                          border: "none",
                          backgroundColor: "#FFFFFF",
                          color: "#E84040",
                          fontSize: "18px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Nộp bài
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {!isLoading && assignments.length === 0 && (
          <p>Hiện chưa có Assignment nào cho lớp học phần này.</p>
        )}
      </CourseDetailLayout>

      {/* MODAL NỘP BÀI */}
      {showModal && currentAssignment && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "360px",
              padding: "24px 24px 28px",
              borderRadius: "30px",
              backgroundColor: "#FFFFFF",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: "8px" }}>Nộp bài</h2>
            <h3 style={{ marginBottom: "18px" }}>{currentAssignment.title}</h3>
            <div
              style={{
                textAlign: "left",
                fontSize: "16px",
                marginBottom: "8px",
              }}
            >
              Link nộp bài
            </div>
            <input
              value={submitLink}
              onChange={(e) => setSubmitLink(e.target.value)}
              placeholder="https://..."
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                marginBottom: "18px",
              }}
            />

            <button
              onClick={() => {
                if (!submitLink) {
                  alert("Vui lòng nhập link nộp bài");
                  return;
                }
                submitMutation.mutate({
                  assignmentId: currentAssignment.assignment_id,
                  url: submitLink,
                });
              }}
              disabled={submitMutation.isPending}
              style={{
                padding: "10px 40px",
                borderRadius: "22px",
                border: "none",
                backgroundColor: "#E84040",
                color: "#FFFFFF",
                fontSize: "18px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {submitMutation.isPending ? "Đang nộp..." : "Nộp bài"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseAssignmentPage;
