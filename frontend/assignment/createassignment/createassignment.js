document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-course-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = form.title.value.trim();
    const weight_pct = parseFloat(form.weight_pct.value.trim());
    const due_at = form.due_at.value.trim(); // sẽ là chuỗi ngày giờ
    const max_score = parseFloat(form.max_score.value.trim());

    const token = localStorage.getItem('accessToken');
    const section_id = localStorage.getItem('selectedSectionId');

    if (!token) {
      alert('Bạn chưa đăng nhập hoặc token đã hết hạn.');
      window.location.href = '../../index/index.html';
      return;
    }

    if (!section_id) {
      alert('Không tìm thấy section_id. Vui lòng chọn section trước.');
      window.location.href = '../../section/section.html';
      return;
    }

    if (!title || isNaN(weight_pct) || weight_pct < 0 || weight_pct > 100 || isNaN(max_score)) {
      alert('Vui lòng nhập đúng dữ liệu: tiêu đề, tỉ trọng (0-100), điểm tối đa.');
      return;
    }

    const payload = {
      section_id: parseInt(section_id, 10),
      title,
      weight_pct,
      due_at: due_at || null, // gửi chuỗi ngày giờ
      max_score
    };

    try {
      const response = await fetch('http://localhost:3000/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Lỗi: ${data.message || 'Không thể tạo assignment'}`);
        return;
      }

      alert(data.message);
      console.log('Assignment created:', data.assignment);

      form.reset();
    } catch (err) {
      console.error('Error creating assignment:', err);
      alert('Có lỗi xảy ra khi tạo assignment');
    }
  });
});