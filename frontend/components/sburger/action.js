document.addEventListener('DOMContentLoaded', () => {
  const logoutLink = document.querySelector('.nav-logout');

  logoutLink.addEventListener('click', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('Bạn chưa đăng nhập hoặc token đã hết hạn.');
      window.location.href = 'http://localhost:5500/frontend/index/index.html';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('accessToken');
        window.location.href = 'http://localhost:5500/frontend/index/index.html';
      } else {
        alert(data.message || 'Đăng xuất thất bại.');
        window.location.href = 'http://localhost:5500/frontend/index/index.html';
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu logout:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  });
});