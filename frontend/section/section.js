document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('accessToken');
  const courseId = localStorage.getItem('selectedCourseId');

  if (!token || !courseId) {
    alert('Thiếu thông tin đăng nhập hoặc khóa học.');
    window.location.href = '../index/index.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/courses/${courseId}/sections`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (response.ok) {
      const sectionList = document.getElementById('section-list');

      if (result.sections.length === 0) {
        sectionList.innerHTML = '<p>Không có lớp học phần nào cho khóa học này.</p>';
        return;
      }

      result.sections.forEach(section => {
        const item = document.createElement('div');
        item.className = 'section-item';
        item.innerHTML = `
          <p><strong>Mã lớp:</strong> ${section.section_code}</p>
          <p><strong>Học kỳ:</strong> ${section.semester_no}</p>
          <p><strong>Ngày tạo:</strong> ${new Date(section.created_at).toLocaleDateString()}</p>
          <p><strong>Giảng viên:</strong> ${section.teacher.name}</p>
          <button class="manage-btn" data-id="${section.section_id}">Quản lý</button>
        `;

        // Gắn sự kiện cho nút "Quản lý"
        const manageBtn = item.querySelector('.manage-btn');
        manageBtn.addEventListener('click', () => {
          localStorage.setItem('selectedSectionId', section.section_id);
          window.location.href = '../lecture/lecture.html';
        });

        sectionList.appendChild(item);
      });
    } else {
      alert(result.message || 'Không thể lấy danh sách lớp học phần.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy lớp học phần:', error);
    alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  }

});