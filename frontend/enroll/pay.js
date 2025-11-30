document.addEventListener('DOMContentLoaded', () => {
  const payBtn = document.querySelector('.pay-btn');

  payBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('accessToken');
    const courseId = localStorage.getItem('selectedCourseId');
    const sectionId = localStorage.getItem('selectedSectionId');

    if (!token || !courseId || !sectionId) {
      alert('Thiếu thông tin đăng nhập hoặc khóa học.');
      window.location.href = '../index/index.html';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/pay', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          course_id: courseId,
          section_id: sectionId
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Thanh toán thành công! Bạn đã được ghi danh vào lớp.');
        // Sau khi thanh toán thành công, chuyển về trang danh sách section
        window.location.href = '../ssection/ssection.html';
      } else {
        alert(result.message || 'Thanh toán thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  });
});