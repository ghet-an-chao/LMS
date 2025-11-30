document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('accessToken');
  const quizId = localStorage.getItem('selectedQuizId');

  if (!token || !quizId) {
    alert('Thiếu thông tin đăng nhập hoặc quiz.');
    window.location.href = '../../index/index.html';
    return;
  }

  try {
    // Bắt đầu quiz → tạo attempt
    const response = await fetch(`http://localhost:3000/quizzes/${quizId}/attempts`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const result = await response.json();

    if (response.ok) {
      // LƯU attempt_id ngay khi bắt đầu
      localStorage.setItem('selectedAttemptId', result.attempt_id);

      const questionList = document.getElementById('question-list');

      // Render câu hỏi
      result.questions.forEach((q, idx) => {
        const item = document.createElement('div');
        item.className = 'question-item';
        item.innerHTML = `
          <h3>Câu ${idx + 1}: ${q.title}</h3>
          <div class="options">
            ${q.options.map((opt, i) => `
              <label>
                <input type="radio" name="question_${q.question_id}" value="${opt.option_id}" />
                ${String.fromCharCode(65 + i)}. ${opt.text}
              </label>
            `).join('')}
          </div>
        `;
        questionList.appendChild(item);
      });

      // Bộ đếm giờ
      let timeLeft = result.time_limit_min * 60; // giây
      const timerEl = document.getElementById('timer');

      const updateTimer = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerEl.textContent = `Thời gian còn lại: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      };

      updateTimer();
      const timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          alert('Hết giờ! Bài làm sẽ được nộp.');
          document.getElementById('quiz-form').dispatchEvent(new Event('submit'));
        }
      }, 1000);

      // Xử lý nút Nộp
      const form = document.getElementById('quiz-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Thu thập câu trả lời
        const answers = [];
        result.questions.forEach(q => {
          const selected = document.querySelector(`input[name="question_${q.question_id}"]:checked`);
          if (selected) {
            answers.push({
              question_id: q.question_id,
              selected_option_ids: [parseInt(selected.value, 10)]
            });
          }
        });

        try {
          const submitResponse = await fetch(`http://localhost:3000/quiz-attempts/${result.attempt_id}/submit`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers })
          });

          const submitResult = await submitResponse.json();
          if (submitResponse.ok) {
            // LƯU attempt_id sau khi nộp (đề phòng backend trả khác cấu trúc)
            const savedAttemptId = submitResult?.attempt?.attempt_id || result.attempt_id;
            localStorage.setItem('selectedAttemptId', savedAttemptId);

            alert('Nộp bài thành công!');
            console.log('Kết quả:', submitResult);
            // Chuyển về trang danh sách quiz hoặc trang xem kết quả
            window.location.href = '../squiz.html';
          } else {
            alert(submitResult.message || 'Nộp bài thất bại.');
          }
        } catch (error) {
          console.error('Lỗi khi nộp bài:', error);
          alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        }
      });
    } else {
      alert(result.message || 'Không thể bắt đầu quiz.');
    }
  } catch (error) {
    console.error('Lỗi khi bắt đầu quiz:', error);
    alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  }
});