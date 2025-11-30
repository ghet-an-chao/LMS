document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('accessToken');
  const quizId = localStorage.getItem('selectedQuizId');

  if (!token || !quizId) {
    alert('Thiếu thông tin đăng nhập hoặc quiz.');
    window.location.href = '../index/index.html';
    return;
  }

  async function loadQuestions() {
    try {
      const response = await fetch(`http://localhost:3000/quizzes/${quizId}/questions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        const questionList = document.getElementById('question-list');
        questionList.innerHTML = '';

        if (result.questions.length === 0) {
          questionList.innerHTML = '<p>Không có câu hỏi nào trong quiz này.</p>';
          return;
        }

        result.questions.forEach(q => {
          const item = document.createElement('div');
          item.className = 'question-item';

          // render options
          let optionsHtml = '';
          q.options.forEach((opt, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D...
            optionsHtml += `
              <li ${opt.is_correct ? 'class="correct-option"' : ''}>
                <strong>${letter}:</strong> ${opt.text}
              </li>
            `;
          });

          item.innerHTML = `
            <h3>Câu ${q.position}: ${q.title}</h3>
            <p><strong>Điểm:</strong> ${q.point}</p>
            <ul>${optionsHtml}</ul>
            <button class="delete-question-btn" data-question-id="${q.question_id}">Xóa câu hỏi</button>
          `;
          questionList.appendChild(item);
        });

        // Gắn sự kiện cho nút "Xóa câu hỏi"
        document.querySelectorAll('.delete-question-btn').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const questionId = e.target.getAttribute('data-question-id');
            if (confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
              try {
                const delResponse = await fetch(`http://localhost:3000/quizzes/${quizId}/questions/${questionId}`, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });

                const delResult = await delResponse.json();

                if (delResponse.ok) {
                  alert(delResult.message || 'Xóa câu hỏi thành công');
                  // reload danh sách câu hỏi
                  loadQuestions();
                } else {
                  alert(delResult.message || 'Không thể xóa câu hỏi');
                }
              } catch (err) {
                console.error('Lỗi khi xóa câu hỏi:', err);
                alert('Đã xảy ra lỗi khi xóa câu hỏi.');
              }
            }
          });
        });
      } else {
        alert(result.message || 'Không thể lấy danh sách câu hỏi.');
      }
    } catch (error) {
      console.error('Lỗi khi lấy câu hỏi:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  }

  // load ngay khi vào trang
  loadQuestions();
});