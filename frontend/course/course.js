document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    alert('Bạn chưa đăng nhập hoặc token đã hết hạn.');
    window.location.href = '../index/index.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/courses', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (response.ok) {
      const courseList = document.getElementById('course-list');

      result.courses.forEach(course => {
        const item = document.createElement('div');
        item.className = 'course-item';
        item.innerHTML = `
          <div class="course-row">
            <div class="col code">${course.course_code}</div>
            <div class="col title">${course.title}</div>
            <div class="col credits">${course.credits}</div>
            <div class="col lang">${course.language}</div>
            <div class="col rating">${course.pass_threshold_pct}</div>
            <div class="col price">${course.price_vnd.toLocaleString()} VND</div>
            <div class="col action">
              <button class="detail-btn" data-id="${course.course_id}">Chi tiết</button>
            </div>
          </div>
        `;

        // Gắn sự kiện cho nút "Chi tiết"
        const detailBtn = item.querySelector('.detail-btn');
        detailBtn.addEventListener('click', () => {
          localStorage.setItem('selectedCourseId', course.course_id);
          window.location.href = '../section/section.html';
        });

        courseList.appendChild(item);
      });
    } else {
      alert(result.message || 'Không thể lấy danh sách khóa học.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khóa học:', error);
    alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  }
});