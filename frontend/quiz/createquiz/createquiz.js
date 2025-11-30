document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-quiz-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    const sectionId = localStorage.getItem('selectedSectionId');

    if (!token || !sectionId) {
      alert('Thiếu thông tin đăng nhập hoặc section.');
      window.location.href = '../../index/index.html';
      return;
    }

    // Lấy dữ liệu từ form
    const title = form.title.value.trim();
    const time_limit_min = parseInt(form.time_limit_min.value, 10);
    const attempts_allowed = parseInt(form.attempts_allowed.value, 10);

    if (!title || isNaN(time_limit_min)) {
      alert('Vui lòng nhập đầy đủ thông tin quiz.');
      return;
    }

    const payload = {
      section_id: parseInt(sectionId, 10),
      title,
      time_limit_min,
      attempts_allowed: isNaN(attempts_allowed) ? null : attempts_allowed
    };

    try {
      const response = await fetch('http://localhost:3000/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Lỗi: ${data.message || 'Không thể tạo quiz'}`);
        return;
      }

      alert(data.message);
      console.log('Quiz created:', data.quiz);

      // Reset form sau khi tạo thành công
      form.reset();
    } catch (err) {
      console.error('Error creating quiz:', err);
      alert('Có lỗi xảy ra khi tạo quiz');
    }
  });
});