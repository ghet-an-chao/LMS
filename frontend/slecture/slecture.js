document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('accessToken');
  const sectionId = localStorage.getItem('selectedSectionId');

  if (!token || !sectionId) {
    alert('Thiếu thông tin đăng nhập hoặc section.');
    window.location.href = '../index/index.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/sections/${sectionId}/lectures`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (response.ok) {
      const lectureList = document.getElementById('lecture-list');

      if (result.lectures.length === 0) {
        lectureList.innerHTML = '<p>Không có bài giảng nào trong lớp học phần này.</p>';
        return;
      }

      result.lectures.forEach(lec => {
        const item = document.createElement('div');
        item.className = 'lecture-item';
        item.innerHTML = `
          <h3>Chap ${lec.position}: ${lec.title}</h3>
          <p><strong>Ngày tạo:</strong> ${new Date(lec.created_at).toLocaleDateString()}</p>
          <p><strong>Link nội dung:</strong> <a href="${lec.content_url}" target="_blank">${lec.content_url}</a></p>
          <p><strong>Tài liệu tham khảo:</strong> <a href="${lec.reference_links}" target="_blank">${lec.reference_links}</a></p>
        `;
        lectureList.appendChild(item);
      });
    } else {
      alert(result.message || 'Không thể lấy danh sách bài giảng.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy bài giảng:', error);
    alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  }

});