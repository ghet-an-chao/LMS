document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('accessToken');
  const courseId = localStorage.getItem('selectedCourseId');

  if (!token || !courseId) {
    alert('Thiếu thông tin đăng nhập hoặc khóa học.');
    window.location.href = '../index/index.html';
    return;
  }

  try {
    // 1. Lấy danh sách section của course
    const sectionRes = await fetch(`http://localhost:3000/courses/${courseId}/sections`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const sectionResult = await sectionRes.json();

    // 2. Lấy danh sách enrollment của student
    const enrollRes = await fetch(`http://localhost:3000/enrollments`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const enrollResult = await enrollRes.json();

    if (sectionRes.ok && enrollRes.ok) {
      const sectionList = document.getElementById('section-list');

      if (sectionResult.sections.length === 0) {
        sectionList.innerHTML = '<p>Không có lớp học phần nào cho khóa học này.</p>';
        return;
      }

      // Tạo set chứa section_id đã đăng ký
      const enrolledSectionIds = new Set(enrollResult.enrollments.map(e => e.section_id));

      sectionResult.sections.forEach(section => {
        const item = document.createElement('div');
        item.className = 'section-item';
        item.innerHTML = `
          <p><strong>Mã lớp:</strong> ${section.section_code}</p>
          <p><strong>Học kỳ:</strong> ${section.semester_no}</p>
          <p><strong>Ngày tạo:</strong> ${new Date(section.created_at).toLocaleDateString()}</p>
          <p><strong>Giảng viên:</strong> ${section.teacher.name}</p>
        `;

        const btn = document.createElement('button');
        btn.dataset.id = section.section_id;

        if (enrolledSectionIds.has(section.section_id)) {
          btn.textContent = 'Xem chi tiết';
          btn.className = 'detail-btn manage-btn';
          btn.addEventListener('click', () => {
            localStorage.setItem('selectedSectionId', section.section_id);
            window.location.href = '../slecture/slecture.html';
          });
        } else {
          btn.textContent = 'Đăng kí';
          btn.className = 'enroll-btn manage-btn';
          btn.addEventListener('click', () => {
            // Lưu section_id vào localStorage
            localStorage.setItem('selectedSectionId', section.section_id);
            // Chuyển hướng sang trang enroll
            window.location.href = '../enroll/enroll.html';
          });
        }

        item.appendChild(btn);
        sectionList.appendChild(item);
      });
    } else {
      alert(sectionResult.message || enrollResult.message || 'Không thể lấy dữ liệu.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  }
});