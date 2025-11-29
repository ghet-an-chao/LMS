import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import logoutIcon from "../../assets/images/elementDatabaseWeb4.png";
import { useAuth } from "../../context/AuthProvider";

const CertificatesPage: React.FC = () => {
  const { studentId: paramId } = useParams<{ studentId: string }>();
  const { user } = useAuth();
  const studentId = paramId ?? String(user?.id ?? 1);

  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/students/${studentId}/certificates`
        );
        setCertificates(res.data);
      } catch (error) {
        console.error("Failed to fetch certificates", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [studentId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
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
          <span style={{ width: "40px", height: "3px", backgroundColor: "#E84040" }} />
          <span style={{ width: "40px", height: "3px", backgroundColor: "#E84040" }} />
          <span style={{ width: "40px", height: "3px", backgroundColor: "#E84040" }} />
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#E84040", marginLeft: "20px" }}>
          Chứng Chỉ
        </h1>
      </div>

      {/* CONTENT */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          color: "#333",
          padding: "0 10px",
        }}
      >
        {/* Header Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 3fr 2fr 1fr 1fr 1.5fr",
            color: "#E84040",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          <div>Mã môn</div>
          <div>Môn học</div>
          <div>Ngày cấp</div>
          <div>Hết hạn</div>
          <div>Mã xác thực</div>
          <div>Trạng thái</div>
        </div>

        {certificates.length === 0 && <p>Chưa có chứng chỉ nào.</p>}

        <div
          style={{
            maxHeight: "calc(100vh - 200px)",
            overflowY: "scroll",
            paddingRight: "10px",
          }}
        >
          {certificates.map((certificate) => (
            <div
              key={certificate.verify_code}
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "18px 32px",
                marginBottom: 18,
                display: "grid",
                gridTemplateColumns: "1fr 3fr 2fr 1fr 1fr 1.5fr",
                alignItems: "center",
                border: "2px solid #E84040",
                color: "#333",
              }}
            >
              <div>{certificate.course_code}</div>
              <div>{certificate.course_title}</div>
              <div>{certificate.issued_on}</div>
              <div>{certificate.expires_on || "Không có"}</div>
              <div>{certificate.verify_code}</div>
              <div>
                <span
                  style={{
                    color: certificate.status === "issued" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {certificate.status === "issued" ? "Được cấp" : "Đã thu hồi"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage;
