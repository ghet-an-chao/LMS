// src/pages/student/Courses/CourseQuizPage.tsx
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  type Quiz,
  type GetQuizzesResponse,
  type StartQuizResponse,
  type QuizResultsResponse,
  getSectionQuizzes,
  startQuizApi,
  submitQuizApi,
  getQuizResultsApi,
} from "../../../../api/quiz.api";
import { CourseDetailLayout } from "./CourseDetailLayout";

const CourseQuizPage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [openId, setOpenId] = useState<number | null>(null);

  const [doQuiz, setDoQuiz] = useState<StartQuizResponse | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResultsQuizId, setShowResultsQuizId] = useState<number | null>(
    null
  );

  const { data, isLoading, error } = useQuery<GetQuizzesResponse>({
    queryKey: ["quizzes", sectionId],
    enabled: !!sectionId,
    queryFn: () => getSectionQuizzes(sectionId!),
  });

  const quizzes: Quiz[] = data?.quizzes ?? [];

  const startQuizMutation = useMutation({
    mutationFn: (quizId: number) => startQuizApi(quizId),
    onSuccess: (data) => {
      setDoQuiz(data);
      setAnswers({});
    },
    onError: () => {
      alert("Không bắt đầu được quiz. Kiểm tra server / token.");
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: (payload: {
      attemptId: number;
      answers: { question_id: number; selected_option_ids: number[] }[];
    }) =>
      submitQuizApi({
        attemptId: payload.attemptId,
        answers: payload.answers,
      }),
    onSuccess: () => {
      alert("Nộp quiz thành công.");
      setDoQuiz(null);
    },
    onError: () => {
      alert("Nộp quiz thất bại.");
    },
  });

  const { data: resultsData } = useQuery<QuizResultsResponse>({
    queryKey: ["quizResults", showResultsQuizId],
    enabled: !!showResultsQuizId,
    queryFn: () => getQuizResultsApi(showResultsQuizId!),
  });

  const currentQuizTitle = useMemo(() => {
    if (!showResultsQuizId) return "";
    const q = quizzes.find((x) => x.quiz_id === showResultsQuizId);
    return q?.title ?? "";
  }, [showResultsQuizId, quizzes]);

  return (
    <>
      <CourseDetailLayout
        activeTab="quizzes"
        courseCode="CS101"
        courseTitle="Introduction to Programming"
        teacherName="Thuy Do"
        language="EN"
      >
        {isLoading && <p>Đang tải Quiz...</p>}
        {error && (
          <p style={{ color: "#ffdede" }}>
            Lỗi tải Quiz (kiểm tra server / database).
          </p>
        )}

        {quizzes.map((q) => {
          const isOpen = openId === q.quiz_id;
          return (
            <div
              key={q.quiz_id}
              style={{
                marginBottom: "20px",
                borderRadius: "40px",
                border: "2px solid #FFFFFF",
                background: "rgba(255,255,255,0.45)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 28px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setOpenId((prev) => (prev === q.quiz_id ? null : q.quiz_id))
                }
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#E84040",
                  }}
                >
                  {q.title}
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
                      <strong>Giới hạn thời gian:</strong>{" "}
                      {q.time_limit_min} phút
                    </p>
                    <p style={{ marginBottom: "8px" }}>
                      <strong>Số lần cho phép:</strong>{" "}
                      {q.attempts_allowed ?? "Không giới hạn"}
                    </p>

                    <div
                      style={{
                        marginTop: "22px",
                        display: "flex",
                        gap: "20px",
                      }}
                    >
                      <button
                        onClick={() => startQuizMutation.mutate(q.quiz_id)}
                        style={{
                          flex: "0 0 auto",
                          padding: "10px 28px",
                          borderRadius: "24px",
                          border: "none",
                          backgroundColor: "#FFFFFF",
                          color: "#E84040",
                          fontSize: "18px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Bắt đầu làm
                      </button>

                      <button
                        onClick={() => setShowResultsQuizId(q.quiz_id)}
                        style={{
                          flex: "0 0 auto",
                          padding: "10px 28px",
                          borderRadius: "24px",
                          border: "none",
                          backgroundColor: "#FFFFFF",
                          color: "#E84040",
                          fontSize: "18px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Xem kết quả
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {!isLoading && quizzes.length === 0 && (
          <p>Hiện chưa có Quiz nào cho lớp học phần này.</p>
        )}
      </CourseDetailLayout>

      {/* MODAL LÀM QUIZ */}
      {doQuiz && (
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
          onClick={() => setDoQuiz(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "720px",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "24px 32px 28px",
              borderRadius: "24px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <h2 style={{ marginBottom: "16px" }}>Làm Quiz</h2>
            {doQuiz.questions.map((q) => (
              <div key={q.question_id} style={{ marginBottom: "18px" }}>
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  {q.title}
                </div>
                {q.options.map((opt) => (
                  <label
                    key={opt.option_id}
                    style={{ display: "block", marginBottom: "4px" }}
                  >
                    <input
                      type="radio"
                      name={`q-${q.question_id}`}
                      value={opt.option_id}
                      checked={answers[q.question_id] === opt.option_id}
                      onChange={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [q.question_id]: opt.option_id,
                        }))
                      }
                      style={{ marginRight: "6px" }}
                    />
                    {opt.text}
                  </label>
                ))}
              </div>
            ))}

            <div style={{ textAlign: "right", marginTop: "12px" }}>
              <button
                onClick={() => {
                  const payloadAnswers = doQuiz.questions.map((q) => ({
                    question_id: q.question_id,
                    selected_option_ids: answers[q.question_id]
                      ? [answers[q.question_id]]
                      : [],
                  }));
                  submitQuizMutation.mutate({
                    attemptId: doQuiz.attempt_id,
                    answers: payloadAnswers,
                  });
                }}
                style={{
                  padding: "10px 32px",
                  borderRadius: "22px",
                  border: "none",
                  backgroundColor: "#E84040",
                  color: "#FFFFFF",
                  fontSize: "18px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XEM KẾT QUẢ */}
      {showResultsQuizId && resultsData && (
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
          onClick={() => setShowResultsQuizId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "540px",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "22px 28px",
              borderRadius: "24px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <h2 style={{ marginBottom: "8px" }}>Kết quả Quiz</h2>
            <p style={{ marginBottom: "16px" }}>{currentQuizTitle}</p>
            {resultsData.attempts.map((a) => (
              <div
                key={a.attempt_id}
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                  fontSize: "15px",
                }}
              >
                <div>
                  <strong>Lần {a.attempt_no}</strong> – điểm: {a.score}
                </div>
                <div>Trạng thái: {a.status}</div>
                <div>
                  Bắt đầu: {new Date(a.start_at).toLocaleString()}
                  {a.end_at && (
                    <>
                      {" "}
                      – Kết thúc: {new Date(a.end_at).toLocaleString()}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CourseQuizPage;
