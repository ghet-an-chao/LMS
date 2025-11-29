import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../../../api/client";
import { useNavigate, useParams } from "react-router-dom";
import bgPayment from "../../../assets/images/elementDatabaseWeb6.png";

type Lecture = {
  lecture_id: number;
  title: string;
  position: number;
  content_url: string;
  reference_links: string;
};

type BillInfo = {
  course_id: number;
  course_code: string;
  course_title: string;
  price_vnd: number;
  section_id: number;
  section_code: string;
  semester_no: number;  // Added semester_no
  teacher_name: string;  // Added teacher_name
  gateway_ref: string;  // Added gateway_ref
  lectures: Lecture[];  // Lectures list
};

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId, sectionId } = useParams<{ courseId: string; sectionId: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["bill", courseId, sectionId],
    enabled: !!courseId && !!sectionId,
    queryFn: async (): Promise<BillInfo> => {
      const res = await api.get<BillInfo>(`/bill/${courseId}/${sectionId}`);
      return res.data;
    },
  });

  const payMutation = useMutation({
    mutationFn: async () => {
      await api.post("/pay", {
        course_id: Number(courseId),
        section_id: Number(sectionId),
      });
    },
    onSuccess: () => {
      alert("Thanh toán thành công!");
      navigate("/student/register");
    },
    onError: () => {
      alert("Có lỗi khi thanh toán, vui lòng thử lại.");
    },
  });

  const handleCancel = () => {
    navigate("/student/register");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        backgroundImage: `url(${bgPayment})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          width: "100%",
          borderRadius: 32,
          border: "2px solid #ffffff",
          backgroundColor: "rgba(255,255,255,0.5)",
          padding: "32px 40px",
          color: "#000",
        }}
      >
        {isLoading && <p>Đang tải thông tin hoá đơn...</p>}
        {error && <p>Lỗi tải dữ liệu.</p>}
        {!isLoading && data && (
          <>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                {data.course_code}
              </h2>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
                {data.course_title}
              </h3>

              <p>Mã học phần: {data.section_code}</p>
            </div>

            <hr style={{ borderColor: "#000", opacity: 0.6, margin: "16px 0" }} />

            {/* Nội dung bài giảng (Lecture Content) */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
                Nội dung bài giảng
              </h3>
              {data.lectures && data.lectures.length === 0 ? (
                <p>Chưa có bài giảng.</p>
              ) : (
                <ul style={{ paddingLeft: 18 }}>
                  {data.lectures?.map((lec) => (
                    <li key={lec.lecture_id} style={{ marginBottom: 4 }}>
                      <p>{lec.title}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>


            <hr style={{ borderColor: "#000", opacity: 0.6, margin: "16px 0" }} />

            {/* Giá tiền & thanh toán */}
            <div>
              <p style={{ marginBottom: 8 }}>
                <strong>Tổng tiền:</strong>{" "}
                {data.price_vnd.toLocaleString("vi-VN")} VND
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 999,
                    background: "transparent",
                    border: "2px solid #E84040",
                    color: "#E84040",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Huỷ bỏ
                </button>

                <button
                  onClick={() => payMutation.mutate()}
                  disabled={payMutation.isPending}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 999,
                    background: "transparent",
                    border: "2px solid #E84040",
                    color: "#E84040",
                    cursor: "pointer",
                    fontWeight: 600,
                    opacity: payMutation.isPending ? 0.7 : 1,
                  }}
                >
                  {payMutation.isPending ? "Đang thanh toán..." : "Thanh toán"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
