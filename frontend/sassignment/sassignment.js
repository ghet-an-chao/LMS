document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('accessToken');
  const sectionId = localStorage.getItem('selectedSectionId');

  if (!token || !sectionId) {
    alert('Thiếu thông tin đăng nhập hoặc section.');
    window.location.href = '../index/index.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/sections/${sectionId}/assignments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (response.ok) {
      const assignmentList = document.getElementById('assignment-list');

      if (result.assignments.length === 0) {
        assignmentList.innerHTML = '<p>Không có assignment nào trong lớp học phần này.</p>';
        return;
      }

      result.assignments.forEach(asg => {
        const item = document.createElement('div');
        item.className = 'assignment-item';
        item.innerHTML = `
          <h3>${asg.title}</h3>
          <p><strong>Trọng số (%):</strong> ${asg.weight_pct ?? 'N/A'}</p>
          <p><strong>Điểm tối đa:</strong> ${asg.max_score ?? 'N/A'}</p>
          <p><strong>Hạn nộp:</strong> ${asg.due_at ? new Date(asg.due_at).toLocaleString() : 'Chưa có'}</p>
        `;

        // Thêm nút "Nộp bài"
        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Nộp bài';
        submitBtn.className = 'submit-btn';
        submitBtn.addEventListener('click', () => {
          // Lưu assignment_id vào localStorage
          localStorage.setItem('selectedAssignmentId', asg.assignment_id);
          // Chuyển hướng sang trang submit
          window.location.href = 'submit/submit.html';
        });

        item.appendChild(submitBtn);
        assignmentList.appendChild(item);
      });
    } else {
      alert(result.message || 'Không thể lấy danh sách assignment.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy assignment:', error);
    alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  }
});