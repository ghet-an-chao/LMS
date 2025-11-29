import React, { useState } from "react";
import bg1 from "../../assets/images/elementDatabaseWeb1.png";
import logo from "../../assets/images/elementDatabaseWeb2.png";
import logoutIcon from "../../assets/images/elementDatabaseWeb4.png";
import { useAuth } from "../../context/AuthProvider";
import { logoutApi } from "../../api/auth.api"; 

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const studentId = user?.user_id ?? user?.id ?? 1;
  // hàm logout
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
  const popularCourses = [
    {
      code: "CS101",
      title: "Introduction to Programming",
      teacher: "Thuy Do",
      credit: 3,
      lang: "EN",
      price: 1500000,
    },
    {
      code: "MATH201",
      title: "Advanced Calculus",
      teacher: "Linh Pham",
      credit: 4,
      lang: "VN",
      price: 1800000,
    },
    {
      code: "CS102",
      title: "Data Structures",
      teacher: "Nam Nguyen",
      credit: 3,
      lang: "EN",
      price: 1650000,
    },
  ];

  return (
    <div
      style={{
        width: "100%",        // fit full màn hình
        maxWidth: "1920px",   // không vượt quá thiết kế gốc nếu màn hình rất lớn
        backgroundColor: "#fff",
        margin: "0 auto",     // căn giữa nếu màn hình > 1920px
        position: "relative",
        overflowX: "hidden",
        fontFamily: "Inter, sans-serif",
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


      {/* ======================= SECTION 1 – GREETING ======================= */}
      <div
        style={{
          width: "100%",
          height: "700px",
          backgroundImage: `url(${bg1})`,
          backgroundSize: "100% auto",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
          position: "relative",
        }}
      >
        {/* MENU ICON */}
        <div
          onClick={() => setOpenMenu(!openMenu)}
          style={{
            position: "absolute",
            top: "44px",     // 74px - 30px
            left: "114px",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          {/* 3 gạch đỏ – thu nhỏ 1/2 */}
          <div
            style={{
              width: "37px", // 75 / 2
              height: "2px", // 4 / 2
              backgroundColor: "#E84040",
              marginBottom: "8px", // 14px / 2 ≈ 7 → làm đẹp hơn dùng 8px
            }}
          ></div>

          <div
            style={{
              width: "37px",
              height: "2px",
              backgroundColor: "#E84040",
              marginBottom: "8px",
            }}
          ></div>

          <div
            style={{
              width: "37px",
              height: "2px",
              backgroundColor: "#E84040",
            }}
          ></div>
        </div>


        {/* LOGO */}
        <img
          src={logo}
          alt="logo"
          style={{
            position: "absolute",
            top: "38px",   // 68px - 30px
            left: "180px",
            width: "48px",    // 95 / 2
            height: "32px",   // 63 / 2
            objectFit: "contain",
          }}
        />

        {/* TEXT BLOCK */}
        <div
          style={{
            position: "absolute",
            top: "250px",
            left: "114px",
            width: "650px",
            color: "#E84040",
          }}
        >
          <h2 style={{ fontSize: "26px", fontStyle: "italic", marginBottom: "28px" }}>
            Chào mừng, Sinh viên{" "}
            <span style={{ fontWeight: 700, fontStyle: "normal" }}>
              {user?.username || "[username]"}
            </span>
            !
          </h2>

          <p style={{ fontSize: "20px", lineHeight: "32px", marginBottom: "24px" }}>
            Đây là hệ thống quản lý học tập trực tuyến (E-learning System) của trường đại học
            được xây dựng dựa trên mô hình tham khảo từ hệ thống LMS hiện có, nhằm hỗ trợ toàn
            bộ quy trình giảng dạy, học tập và đánh giá của nhà trường.
          </p>

          <p style={{ fontSize: "20px", lineHeight: "32px" }}>
            Cảm ơn bạn đã tin tưởng và đồng hành cùng chúng tôi. Bạn hãy tiếp tục khám phá và
            phát triển khả năng của bạn với các khoá học dưới đây!
          </p>
        </div>
      </div>

      {/* ======================= SECTION 2 – POPULAR COURSES ======================= */}
      <div
        style={{
          width: "100%",
          height: "1080px",
          background: "#fff",
          paddingTop: "120px",
        }}
      >
        {/* Border line */}
        <div
          style={{
            width: "1200px",
            height: "3px",
            backgroundColor: "#E84040",
            margin: "0 auto 70px auto",
          }}
        ></div>

        {/* Title */}
        <h1
          style={{
            color: "#E84040",
            fontWeight: 800,
            textAlign: "center",
            fontSize: "38px",
            marginBottom: "40px",
          }}
        >
          CÁC KHOÁ HỌC BÁN CHẠY
        </h1>

        {/* Header Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.8fr 2fr 1.5fr 0.7fr 0.7fr 1fr",
            maxWidth: "1645px",
            width: "90%",
            minWidth: "700px",
            margin: "0 auto",
            color: "#E84040",
            fontSize: "22px",
            fontWeight: 600,
            marginBottom: "24px",
          }}
        >
          <div>Mã môn</div>
          <div>Môn học</div>
          <div>Giảng viên</div>
          <div>Tín chỉ</div>
          <div>Ngôn ngữ</div>
          <div>Giá tiền</div>
        </div>

        {/* Course rows */}
        {popularCourses.map((c, index) => (
          <div
            key={index}
            style={{
              maxWidth: "1645px",
              width: "90%",
              minWidth: "700px",
              margin: "15px auto",
              backgroundColor: "#E84040",
              padding: "20px 40px",
              borderRadius: "40px",
              display: "grid",
              gridTemplateColumns: "0.8fr 2fr 1.5fr 0.7fr 0.7fr 1fr",
              color: "#fff",
              fontSize: "20px",
            }}
          >
            <div>{c.code}</div>
            <div>{c.title}</div>
            <div>{c.teacher}</div>
            <div>{c.credit}</div>
            <div>{c.lang}</div>
            <div>{c.price.toLocaleString("vi-VN")}</div>
          </div>
        ))}
      </div>

      {/* ======================= SECTION 3 – FOOTER ======================= */}
      <div
        style={{
          width: "100%",
          height: "350px",
          backgroundColor: "#D34444",
          color: "#fff",
          textAlign: "center",
          paddingTop: "120px",
        }}
      >
        <h2 style={{ fontSize: "26px", fontWeight: 700 }}>CO2014 - HỆ CƠ SỞ DỮ LIỆU</h2>

        <p style={{ fontSize: "20px", marginTop: "20px", marginBottom: "16px" }}>
          THÀNH VIÊN:
          <br />
          Nguyễn Nhật Huy - Dương Khả Vân - Trương Mạnh Huy - Nguyễn Đặng Trí Dũng - Bùi Hà Hải
        </p>

        <p style={{ fontSize: "20px", lineHeight: "34px" }}>
          2025 All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Home;
