import React, { useState, useEffect } from "react";
import logoutIcon from "../../assets/images/elementDatabaseWeb4.png";
import { getUserInfoApi, updateUserInfoApi } from "../../api/user.api";
import { logoutApi } from "../../api/auth.api"; 
import { useAuth } from "../../context/AuthProvider";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { logout } = useAuth();


  // state cho form chỉnh sửa
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  // ======= GỌI API LẤY THÔNG TIN USER =======
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserInfoApi(); // GET /users/me
        setUser(data);

        setForm({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

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

  const handleOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitEdit = async () => {
    try {
      // user.id là field mình trả về từ backend getprofile.js
      const res = await updateUserInfoApi(user.id, form); // PUT /users/:id

      if (res.user) {
        setUser(res.user); // backend updateprofile.js trả { user: {...} }
      } else {
        setUser((prev: any) => ({ ...prev, ...form }));
      }

      setOpenEdit(false);
      alert("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Có lỗi khi cập nhật thông tin!");
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  // dùng id từ backend để build link
  const effectiveStudentId = user.id ?? 1;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        fontFamily: "Inter, sans-serif",
        position: "relative",
      }}
    >
      {/* ======================= MENU OVERLAY ======================= */}
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
            <a
              href="/student/home"
              style={{ textDecoration: "none", color: "white" }}
            >
              TRANG CHỦ
            </a>
            <a
              href="/student/courses"
              style={{ textDecoration: "none", color: "white" }}
            >
              KHOÁ HỌC
            </a>
            <a
              href="/student/roadmaps"
              style={{ textDecoration: "none", color: "white" }}
            >
              LỘ TRÌNH HỌC
            </a>
            <a
              href={`/students/${effectiveStudentId}/grades`}
              style={{ textDecoration: "none", color: "white" }}
            >
              BẢNG ĐIỂM
            </a>
            <a
              href={`/students/${effectiveStudentId}/certificates`}
              style={{ textDecoration: "none", color: "white" }}
            >
              CHỨNG CHỈ
            </a>
            <a
              href={`/students/${effectiveStudentId}/profile`}
              style={{ textDecoration: "none", color: "white" }}
            >
              THÔNG TIN CÁ NHÂN
            </a>

            {/* LOGOUT (nếu muốn call /logout luôn) */}
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

      {/* ======================= HEADER ======================= */}
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
          <span
            style={{ width: "40px", height: "3px", backgroundColor: "#E84040" }}
          />
          <span
            style={{ width: "40px", height: "3px", backgroundColor: "#E84040" }}
          />
          <span
            style={{ width: "40px", height: "3px", backgroundColor: "#E84040" }}
          />
        </div>

        <h2 style={{ color: "#E84040", fontSize: "28px", fontWeight: 800 }}>
          THÔNG TIN CÁ NHÂN
        </h2>
      </div>

      {/* ======================= PROFILE CARD ======================= */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid #E84040",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          width: "400px",
          margin: "0 auto",
        }}
      >
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Họ và tên:</strong> {user.first_name} {user.last_name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Trạng thái:</strong>{" "}
          <span style={{ color: "green" }}>{user.status}</span>
        </p>
        <p>
          <strong>Vai trò:</strong> {user.roles?.join(", ") || "student"}
        </p>

        <button
          onClick={handleOpenEdit}
          style={{
            backgroundColor: "#E84040",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
            width: "100%",
          }}
        >
          Chỉnh sửa
        </button>
      </div>

      {/* ======================= HỘP THOẠI CHỈNH SỬA ======================= */}
      {openEdit && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
          onClick={() => setOpenEdit(false)}
        >
          <div
            style={{
              backgroundColor: "#E84040",
              padding: "30px",
              borderRadius: "8px",
              width: "400px",
              color: "#fff",
              fontSize: "18px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ textAlign: "center" }}>Chỉnh sửa thông tin</h3>

            <div style={{ marginBottom: "20px" }}>
              <label>FIRST NAME</label>
              <input
                name="first_name"
                type="text"
                value={form.first_name}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "8px",
                  borderRadius: "5px",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>LAST NAME</label>
              <input
                name="last_name"
                type="text"
                value={form.last_name}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "8px",
                  borderRadius: "5px",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>EMAIL</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "8px",
                  borderRadius: "5px",
                }}
              />
            </div>

            <button
              onClick={handleSubmitEdit}
              style={{
                backgroundColor: "#fff",
                color: "#E84040",
                padding: "12px 20px",
                border: "none",
                borderRadius: "5px",
                width: "100%",
                cursor: "pointer",
              }}
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
