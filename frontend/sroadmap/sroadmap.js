document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    alert('Bạn chưa đăng nhập hoặc token đã hết hạn.');
    window.location.href = '../index/index.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/roadmaps', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (response.ok) {
      const roadmapList = document.getElementById('roadmap-list');

      result.roadmaps.forEach(rm => {
        const item = document.createElement('div');
        item.className = 'roadmap-item';

        // render danh sách course trong roadmap
        const courseFlow = document.createElement('div');
        courseFlow.className = 'course-flow';

        rm.courses.forEach((c, index) => {
          const block = document.createElement('div');
          block.className = 'course-block';
          block.innerHTML = `
            <div class="course-code">${c.course_code}</div>
            <div class="course-title">${c.title}</div>
          `;
          courseFlow.appendChild(block);

          if (index < rm.courses.length - 1) {
            const arrow = document.createElement('span');
            arrow.className = 'arrow';
            arrow.textContent = '→';
            courseFlow.appendChild(arrow);
          }
        });

        // nội dung roadmap
        item.innerHTML = `
          <h2>${rm.title}</h2>
          <p><strong>Người tạo:</strong> ${rm.owner.name}</p>
          <p><strong>Mô tả:</strong> ${rm.description}</p>
          <p><strong>Tips:</strong> ${rm.tips}</p>
          <p><strong>Số khoá học:</strong> ${rm.courses.length}</p>
        `;

        item.appendChild(courseFlow);

        roadmapList.appendChild(item);
      });
    } else {
      alert(result.message || 'Không thể lấy danh sách lộ trình.');
    }
  } catch (error) {
    console.error('Lỗi khi lấy roadmap:', error);
    alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  }
});