document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-section-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const course_code = document.getElementById('course_code').value.trim();
    const ordinal = parseInt(document.getElementById('ordinal').value.trim(), 10);

    const token = localStorage.getItem('accessToken');
    const rm_id = localStorage.getItem('selectedRoadmapId');

    if (!token) {
      alert('Bạn chưa đăng nhập hoặc token đã hết hạn.');
      window.location.href = '../index/index.html';
      return;
    }

    if (!rm_id) {
      alert('Không tìm thấy rm_id. Vui lòng chọn roadmap trước.');
      window.location.href = '../roadmap/roadmap.html';
      return;
    }

    if (!course_code || isNaN(ordinal) || ordinal < 1) {
      alert('Vui lòng nhập đúng mã khóa học (course_code) và thứ tự (ordinal >= 1).');
      return;
    }

    const payload = { course_code, ordinal };

    try {
      const response = await fetch(`http://localhost:3000/roadmaps/${rm_id}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Lỗi: ${data.message || 'Không thể thêm khóa học vào roadmap'}`);
        return;
      }

      alert(`Đã thêm môn học: ${data.mapping.course_code} vào lộ trình.`);
      console.log('Mapping created:', data.mapping);

      // Xóa rm_id sau khi dùng xong để tránh sót giá trị cũ
      // localStorage.removeItem('selectedRoadmapId');

      form.reset();
    } catch (err) {
      console.error('Error adding course to roadmap:', err);
      alert('Có lỗi xảy ra khi thêm khóa học');
    }
  });
});