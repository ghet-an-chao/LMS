document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-course-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Lấy dữ liệu từ form
    const title = form.title.value.trim();
    const content_url = form.content_url.value.trim();
    const reference_links = form.reference_links.value.trim();
    const position = parseInt(form.position.value, 10);

    // Lấy token và section_id từ localStorage
    const token = localStorage.getItem('accessToken');
    const section_id = localStorage.getItem('selectedSectionId');

    // Kiểm tra token
    if (!token) {
      alert('Bạn chưa đăng nhập hoặc token đã hết hạn.');
      window.location.href = '../../index/index.html';
      return;
    }

    // Kiểm tra section_id
    if (!section_id) {
      alert('Không tìm thấy section_id. Vui lòng chọn section trước.');
      window.location.href = '../../section/section.html';
      return;
    }

    // Kiểm tra dữ liệu nhập
    if (!title || isNaN(position) || position < 1) {
      alert('Vui lòng nhập đầy đủ thông tin: tiêu đề, vị trí >= 1.');
      return;
    }

    // Payload gửi lên backend
    const payload = {
      section_id: parseInt(section_id, 10),
      title,
      content_url: content_url || null,
      reference_links: reference_links || null,
      position
    };

    try {
      const response = await fetch('http://localhost:3000/lectures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Lỗi: ${data.message || 'Không thể tạo bài giảng'}`);
        return;
      }

      alert(data.message);
      console.log('Lecture created:', data.lecture);

      // Reset form sau khi tạo thành công
      form.reset();
    } catch (err) {
      console.error('Error creating lecture:', err);
      alert('Có lỗi xảy ra khi tạo bài giảng');
    }
  });
});