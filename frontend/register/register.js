document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  let selectedRole = null;

  // Bắt sự kiện chọn role
  const studentBtn = document.querySelector('.role.student');
  const teacherBtn = document.querySelector('.role.teacher');

  studentBtn.addEventListener('click', () => {
    selectedRole = 'student';
    studentBtn.style.backgroundColor = '#f9d423';
    teacherBtn.style.backgroundColor = '#eee';
  });

  teacherBtn.addEventListener('click', () => {
    selectedRole = 'teacher';
    teacherBtn.style.backgroundColor = '#f9d423';
    studentBtn.style.backgroundColor = '#eee';
  });

  // Bắt sự kiện submit form
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const first_name = document.getElementById('first_name').value.trim();
    const last_name = document.getElementById('last_name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!selectedRole) {
      alert('Vui lòng chọn vai trò: Sinh viên hoặc Giảng viên');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          first_name,
          last_name,
          email,
          password,
          role: selectedRole
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Đăng ký thành công!');
        console.log('User:', data.user);
        // Chuyển hướng sang trang đăng nhập
      window.location.href = '../index/index.html';
      } else {
        alert(data.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  });
});