document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-section-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const course_code = form.course_code.value.trim();
    const section_code = form.section_code.value.trim();
    const semester_no = parseInt(form.language.value, 10);

    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('Bạn chưa đăng nhập hoặc token đã hết hạn.');
      window.location.href = '../../index/index.html';
      return;
    }

    if (!course_code || !section_code || isNaN(semester_no)) {
      alert('Vui lòng nhập đầy đủ thông tin: mã môn học, mã lớp học phần, học kỳ.');
      return;
    }

    const payload = { course_code, section_code, semester_no };

    try {
      const response = await fetch('http://localhost:3000/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Lỗi: ${data.message || 'Không thể tạo lớp học phần'}`);
        return;
      }

      alert(data.message);
      console.log('Section created:', data.section);

      form.reset();
    } catch (err) {
      console.error('Error creating section:', err);
      alert('Có lỗi xảy ra khi tạo lớp học phần');
    }
  });
});