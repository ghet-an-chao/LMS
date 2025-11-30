const accessToken = localStorage.getItem('accessToken'); 

async function fetchAverageScore() {
  const loadingEl = document.getElementById('loading');
  const scoreEl = document.getElementById('score');

  try {
    const response = await fetch('http://localhost:3000/students/average-score', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errData = await response.json();
      loadingEl.textContent = '';
      scoreEl.textContent = `Lỗi: ${errData.message}`;
      scoreEl.style.color = 'red';
      return;
    }

    const data = await response.json();
    loadingEl.textContent = '';
    scoreEl.textContent = `Điểm trung bình: ${data.average_score}`;
  } catch (error) {
    loadingEl.textContent = '';
    scoreEl.textContent = `Lỗi kết nối: ${error.message}`;
    scoreEl.style.color = 'red';
  }
}

window.onload = fetchAverageScore;