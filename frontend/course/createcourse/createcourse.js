document.getElementById('create-course-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('Bạn chưa đăng nhập hoặc token đã hết hạn.');
    window.location.href = '../../index/index.html';
    return;
  }

  const form = e.target;
  const data = {
    course_code: form.course_code.value.trim(),
    title: form.title.value.trim(),
    credits: parseInt(form.credits.value),
    language: form.language.value,
    description: form.description.value.trim(),
    pass_threshold_pct: parseFloat(form.pass_threshold_pct.value),
    price_vnd: parseInt(form.price_vnd.value)
  };

  try {
    const response = await fetch('http://localhost:3000/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      alert('Tạo khóa học thành công!');
      form.reset();
    } else {
      alert(result.message || 'Không thể tạo khóa học.');
    }
  } catch (error) {
    console.error('Lỗi khi tạo khóa học:', error);
    alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  }
});