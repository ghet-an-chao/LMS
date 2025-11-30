document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('accessToken');
  const sectionId = localStorage.getItem('selectedSectionId');

  if (!token || !sectionId) {
    alert('Thiếu thông tin đăng nhập hoặc section.');
    window.location.href = '../index/index.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/sections/${sectionId}/quizzes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (response.ok) {
      const quizList = document.getElementById('quiz-list');

      if (result.quizzes.length === 0) {
        quizList.innerHTML = '<p>Không có quiz nào trong lớp học phần này.</p>';
        return;
      }

      result.quizzes.forEach(qz => {
        const item = document.createElement('div');
        item.className = 'quiz-item';
        item.innerHTML = `
          <h3>${qz.title}</h3>
          <p><strong>Thời gian giới hạn (phút):</strong> ${qz.time_limit_min ?? 'N/A'}</p>
          <p><strong>Số lần làm bài cho phép:</strong> ${qz.attempts_allowed ?? 'Không giới hạn'}</p>
          <div class="quiz-actions">
            <button class="add-question-btn" data-quiz-id="${qz.quiz_id}">Thêm câu hỏi</button>
            <button class="view-question-btn" data-quiz-id="${qz.quiz_id}">Xem câu hỏi</button>
          </div>
        `;
        quizList.appendChild(item);
      });

      // Gắn sự kiện cho nút "Thêm câu hỏi"
      document.querySelectorAll('.add-question-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const quizId = e.target.getAttribute('data-quiz-id');
          localStorage.setItem('selectedQuizId', quizId);
          window.location.href = 'addquestion/addquestion.html';
        });
      });

      // Gắn sự kiện cho nút "Xem câu hỏi"
      document.querySelectorAll('.view-question-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const quizId = e.target.getAttribute('data-quiz-id');
          localStorage.setItem('selectedQuizId', quizId);
          window.location.href = 'viewquestion/viewquestion.html';
        });
      });
    } else {
      alert(result.message || 'Không thể lấy danh sách quiz.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy quiz:', error);
    alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  }
});