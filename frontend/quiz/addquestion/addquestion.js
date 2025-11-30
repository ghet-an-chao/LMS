document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-question-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    const quizId = localStorage.getItem('selectedQuizId');

    if (!token || !quizId) {
      alert('Thiếu thông tin đăng nhập hoặc quiz.');
      window.location.href = '../../index/index.html';
      return;
    }

    // Lấy dữ liệu từ form
    const title = form.title.value.trim();
    const optionA = form.optionA.value.trim();
    const optionB = form.optionB.value.trim();
    const optionC = form.optionC.value.trim();
    const optionD = form.optionD.value.trim();
    const correctoption = form.corectoption.value;
    const point = parseFloat(form.point.value);
    const position = parseInt(form.position.value, 10);

    if (!title || !optionA || !optionB || !optionC || !optionD || !correctoption) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    const payload = {
      title,
      optionA,
      optionB,
      optionC,
      optionD,
      correctoption,
      point,
      position
    };

    try {
      const response = await fetch(`http://localhost:3000/quizzes/${quizId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Lỗi: ${data.message || 'Không thể tạo câu hỏi'}`);
        return;
      }

      alert(data.message);
      console.log('Question created:', data.question);

      // Reset form sau khi tạo thành công
      form.reset();
    } catch (err) {
      console.error('Error creating question:', err);
      alert('Có lỗi xảy ra khi tạo câu hỏi');
    }
  });
});