import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate(); // Dùng useNavigate thay vì useHistory
  const [user, setUser] = useState<any>(null);
  const [openEdit, setOpenEdit] = useState(false);

  // Fetch thông tin người dùng
  useEffect(() => {
    if (!studentId) {
      console.error("Student ID is missing!");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/students/${studentId}/profile`);
        setUser(response.data); // Set user data once the request is successful
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [studentId]);

  const handleEdit = () => {
    setOpenEdit(true);
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "20px" }}>
        <div
          onClick={() => navigate("/student/home")} // Sử dụng navigate để thay thế history.push
          style={{ fontSize: "24px", color: "#E84040" }}
        >
          ←
        </div>
        <h2 style={{ color: "#E84040", marginLeft: "20px" }}>THÔNG TIN CÁ NHÂN</h2>
      </div>

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
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Họ và tên:</strong> {user.first_name} {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Trạng thái:</strong> <span style={{ color: "green" }}>{user.status}</span></p>
        <p><strong>Vai trò:</strong> {user.role}</p>

        <button
          onClick={handleEdit}
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

      {/* Hộp thoại chỉnh sửa thông tin */}
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
          onClick={() => setOpenEdit(false)} // Đóng hộp thoại khi click ngoài
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
            onClick={(e) => e.stopPropagation()} // Không đóng hộp thoại khi click vào bên trong
          >
            <h3 style={{ textAlign: "center" }}>Chỉnh sửa thông tin</h3>

            <div style={{ marginBottom: "20px" }}>
              <label>FIRST NAME</label>
              <input
                type="text"
                defaultValue={user.first_name}
                style={{ width: "100%", padding: "10px", marginTop: "8px", borderRadius: "5px" }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>LAST NAME</label>
              <input
                type="text"
                defaultValue={user.last_name}
                style={{ width: "100%", padding: "10px", marginTop: "8px", borderRadius: "5px" }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>EMAIL</label>
              <input
                type="email"
                defaultValue={user.email}
                style={{ width: "100%", padding: "10px", marginTop: "8px", borderRadius: "5px" }}
              />
            </div>

            <button
              onClick={() => alert("Chỉnh sửa thành công!")} // Thực hiện API cập nhật thông tin ở đây
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
