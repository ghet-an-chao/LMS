document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    const assignmentId = localStorage.getItem('selectedAssignmentId');
    const contentUrl = document.getElementById('content_url').value.trim();

    if (!token || !assignmentId || !contentUrl) {
      alert('Thiếu thông tin cần thiết để nộp bài.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content_url: contentUrl
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Nộp bài thành công!');
        console.log('Submission:', result.submission);
        // Chuyển hướng về trang assignment list hoặc trang kết quả
        window.location.href = '../sassignment.html';
      } else {
        alert(result.message || 'Nộp bài thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi nộp bài:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  });
});