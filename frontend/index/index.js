document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      alert('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Token:', data.accessToken);
        console.log('Thông tin người dùng:', data.user);

        // Lưu token và thông tin người dùng nếu cần
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('userRole', data.user.role); // lưu vai trò nếu cần dùng sau

        // Chuyển hướng theo vai trò
        if (data.user.role === 'teacher') {
        window.location.href = '../home/thome/thome.html';
        } else if (data.user.role === 'student') {
        window.location.href = '../home/shome/shome.html';
        } else {
        alert('Vai trò người dùng không hợp lệ.');
        }
      } else {
        alert(data.message || 'Đăng nhập thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  });
});