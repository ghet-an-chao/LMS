document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('accessToken');
  const quizId = localStorage.getItem('selectedQuizId'); // lưu quiz_id khi chọn quiz

  if (!token || !quizId) {
    alert('Thiếu thông tin đăng nhập hoặc quiz.');
    window.location.href = '../../index/index.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/quizzes/${quizId}/results`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (response.ok) {
      const attemptInfo = document.getElementById('attempt-info');
      attemptInfo.innerHTML = `
        <h2>Kết quả Quiz ${result.quiz_id}</h2>
        <p><strong>Tổng số lần làm:</strong> ${result.attempts.length}</p>
      `;

      const allResults = document.getElementById('question-results');
      allResults.innerHTML = '';

      result.attempts.forEach((attempt, idxAttempt) => {
        const attemptBlock = document.createElement('div');
        attemptBlock.className = 'attempt-block';
        attemptBlock.innerHTML = `
          <h3>Lần làm ${attempt.attempt_no}</h3>
          <p><strong>Điểm:</strong> ${attempt.score}</p>
          <p><strong>Trạng thái:</strong> ${attempt.status}</p>
          <p><strong>Bắt đầu:</strong> ${new Date(attempt.start_at).toLocaleString()}</p>
          <p><strong>Kết thúc:</strong> ${attempt.end_at ? new Date(attempt.end_at).toLocaleString() : 'N/A'}</p>
        `;

        // Danh sách câu hỏi trong attempt này
        const questionsDiv = document.createElement('div');
        questionsDiv.className = 'questions';
        attempt.questions.forEach((q, idxQ) => {
          const item = document.createElement('div');
          item.className = 'question-item';
          const selectedIds = q.selected_option_ids || [];
          item.innerHTML = `
            <h4>Câu ${idxQ + 1}: ${q.title}</h4>
            <p><strong>Điểm:</strong> ${q.point}</p>
            <p>Kết quả: <span class="${q.is_correct ? 'correct' : 'incorrect'}">
              ${q.is_correct ? 'Đúng' : 'Sai'}
            </span></p>
            <div class="options">
              ${q.options.map(opt => `
                <span ${selectedIds.includes(opt.option_id) ? 'style="font-weight:bold;"' : ''}>
                  ${opt.text} ${opt.is_correct ? '(Đáp án đúng)' : ''}
                  ${selectedIds.includes(opt.option_id) ? '(Bạn chọn)' : ''}
                </span>
              `).join('')}
            </div>
          `;
          questionsDiv.appendChild(item);
        });

        attemptBlock.appendChild(questionsDiv);
        allResults.appendChild(attemptBlock);
      });

      // Nút quay lại
      document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = '../squiz.html';
      });
    } else {
      alert(result.message || 'Không thể xem kết quả.');
    }
  } catch (error) {
    console.error('Lỗi khi xem kết quả:', error);
    alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  }
});