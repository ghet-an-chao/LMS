document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-section-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Lấy dữ liệu từ form
    const title = form.title.value.trim();
    const description = form.description.value.trim();
    const tips = form.tips.value.trim();

    // Lấy token từ localStorage (đã lưu khi login)
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Bạn chưa đăng nhập hoặc token không tồn tại');
      return;
    }

    const payload = { title, description, tips };

    try {
      const response = await fetch('http://localhost:3000/roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // gửi token để backend lấy owner_id
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Lỗi: ${data.message || 'Không thể tạo roadmap'}`);
        return;
      }

      alert(data.message);
      console.log('Roadmap created:', data.roadmap);

      // Reset form
      form.reset();
    } catch (err) {
      console.error('Error creating roadmap:', err);
      alert('Có lỗi xảy ra khi tạo roadmap');
    }
  });
});