document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    alert('Bạn chưa đăng nhập.');
    window.location.href = '../index/index.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/certificates', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (response.ok) {
      const container = document.getElementById('certificate-list');

      if (result.certificates.length === 0) {
        container.innerHTML = '<p>Không có chứng chỉ nào được cấp.</p>';
        return;
      }

      result.certificates.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'certificate-card';

        const expires = cert.expires_on ? cert.expires_on : 'Không';

        card.innerHTML = `
          <p><strong>${cert.course_code}</strong></p>
          <p id="course-title">${cert.course_title}</p>
          <p><strong>Ngày cấp:</strong> ${new Date(cert.issued_on).toLocaleDateString()}</p>
          <p><strong>Hết hạn:</strong> ${expires === 'Không' ? 'Không' : new Date(expires).toLocaleDateString()}</p>
          <p><strong>Mã xác thực:</strong> ${cert.verify_code}</p>
          <p><strong>Trạng thái:</strong> <span class="${cert.status === 'issued' ? 'status-issued' : 'status-revoked'}">
            ${cert.status === 'issued' ? 'được cấp' : 'đã thu hồi'}
          </span></p>
        `;

        container.appendChild(card);
      });
    } else {
      alert(result.message || 'Không thể lấy danh sách chứng chỉ.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy chứng chỉ:', error);
    alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  }
});