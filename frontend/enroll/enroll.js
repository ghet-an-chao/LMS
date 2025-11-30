document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('accessToken');
  const courseId = localStorage.getItem('selectedCourseId');
  const sectionId = localStorage.getItem('selectedSectionId');

  if (!token || !courseId || !sectionId) {
    alert('Thiếu thông tin đăng nhập hoặc khóa học.');
    window.location.href = '../index/index.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/bill/${courseId}/${sectionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (response.ok) {
      const courseInfo = document.getElementById('course-info');
      const lectureList = document.getElementById('lecture-list');
      const priceVnd = document.getElementById('price-vnd');

      courseInfo.innerHTML = `
        <p><strong>Mã học phần:</strong> ${result.course_code} - ${result.section_code}</p>
        <p><strong>Tên khóa học:</strong> ${result.course_title}</p>
      `;

      priceVnd.textContent = result.price_vnd.toLocaleString();

      if (result.lectures.length > 0) {
        const title = document.createElement('h3');
        title.textContent = 'Bài giảng';
        lectureList.appendChild(title);

        result.lectures.forEach(lec => {
          const item = document.createElement('div');
          item.className = 'lecture-item';
          item.innerHTML = `<strong>Chap ${lec.position}:</strong> ${lec.title}`;
          lectureList.appendChild(item);
        });
      } else {
        lectureList.innerHTML = '<p>Không có bài giảng nào.</p>';
      }
    } else {
      alert(result.message || 'Không thể lấy thông tin đăng ký.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin bill:', error);
    alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  }
});