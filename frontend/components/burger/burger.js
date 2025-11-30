class BurgerSidebar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="burger-container">
        <img src="http://localhost:5500/frontend/components/burger/p1.svg" alt="Menu" class="menu-icon" onclick="toggleSidebar()" />
        <div class="sidebar" id="sidebar">
          <ul>
            <li><a href="http://localhost:5500/frontend/home/thome/thome.html" class="nav-home">TRANG CHỦ</a></li>
            <li><a href="http://localhost:5500/frontend/course/course.html" class="nav-courses">QUẢN LÝ KHÓA HỌC</a></li>
            <li><a href="http://localhost:5500/frontend/roadmap/roadmap.html" class="nav-roadmap">LỘ TRÌNH HỌC</a></li>
            <li><a href="http://localhost:5500/frontend/profile/profile.html" class="nav-profile">THÔNG TIN CÁ NHÂN</a></li>
            <li><a href="#" class="nav-logout">
                <img src="http://localhost:5500/frontend/components/burger/p2.png" alt="Logout icon" class="menu-icon-small" />
                ĐĂNG XUẤT
              </a>
            </li>
          </ul>
        </div>
      </div>
    `;
  }
}
customElements.define('burger-sidebar', BurgerSidebar);

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
}