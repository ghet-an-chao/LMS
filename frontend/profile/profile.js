document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    alert('Bạn chưa đăng nhập hoặc token đã hết hạn.');
    window.location.href = '../index/index.html';
    return;
  }

  let userId = null;

  // Lấy thông tin người dùng
  try {
    const response = await fetch('http://localhost:3000/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      userId = data.id;
      document.getElementById('username').textContent = data.username;
      document.getElementById('fullname').value = `${data.first_name} ${data.last_name}`;
      document.getElementById('email').value = data.email;
      document.getElementById('status').textContent = data.status;
      document.getElementById('roles').textContent = data.roles.join(', ');
    } else {
      alert(data.message || 'Không thể lấy thông tin người dùng.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin cá nhân:', error);
    alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  }

  // Xử lý lưu thay đổi
  document.getElementById('saveBtn').addEventListener('click', async () => {
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!fullname || !email) {
      alert('Vui lòng nhập đầy đủ họ tên và email.');
      return;
    }

    const [first_name, ...rest] = fullname.split(' ');
    const last_name = rest.join(' ') || '';

    try {
      const updateRes = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ first_name, last_name, email })
      });

      const updateData = await updateRes.json();

      if (updateRes.ok) {
        alert(' Cập nhật thông tin thành công!');
      } else {
        alert(updateData.message || ' Cập nhật thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  });
});