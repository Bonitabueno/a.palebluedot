// ============================================
// 페이지 로드 시 흰색 불빛 효과 페이드 아웃
// ============================================
window.addEventListener('DOMContentLoaded', function() {
  const whiteFlash = document.getElementById('whiteFlash');
  if (whiteFlash) {
    setTimeout(function() {
      whiteFlash.classList.add('fade-out');
    }, 150);
  }
});

// ============================================
// 1. DATA: 초기엔 비워두고 fetch로 채웁니다.
// ============================================
let worksData = []; 
let currentIndex = 0;

// ============================================
// 2. LOGIC: DOM 선택 (썸네일 및 이전/다음 버튼 제거)
// ============================================
const els = {
  // 메인 이미지
  mainImg: document.getElementById('main-image'),

  // 모달 관련 요소
  infoModal: document.getElementById('info-modal'),
  closeModalBtn: document.getElementById('btn-close-modal'),
  modalBackdrop: document.getElementById('modal-backdrop'),

  // 모달 내부 텍스트 요소
  title: document.getElementById('info-title'),
  desc: document.getElementById('info-desc'),
  year: document.getElementById('info-year')
};

// 페이지 로드 시 데이터 불러오기
window.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  setupModalEvents(); // 모달 이벤트 연결
});

// JSON 데이터 가져오기 함수
async function loadData() {
  const errorEl = document.getElementById('error-message');

  try {
    const response = await fetch('https://raw.githubusercontent.com/Bonitabueno/Bonitabueno/refs/heads/main/works.json'); 
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    worksData = await response.json();

    if (worksData && worksData.length > 0) {
      if (els.mainImg) els.mainImg.classList.remove('hidden');
      if (errorEl) errorEl.classList.add('hidden');
      
      // 썸네일 렌더링 호출 삭제
      updateDisplay(0);
    } else {
      throw new Error("데이터가 비어있습니다.");
    }

  } catch (error) {
    console.error("데이터 로드 실패:", error);
    if (els.mainImg) els.mainImg.classList.add('hidden');
    if (errorEl) {
      errorEl.classList.remove('hidden');
      errorEl.textContent = "오류가 발생했습니다.";
    }
    if (els.title) els.title.textContent = "Data Loading Failed";
  }
}

// ============================================
// 3. DISPLAY: 화면 업데이트 (썸네일 관련 로직 제거)
// ============================================
function updateDisplay(index) {
  if (worksData.length === 0) return;

  if (index < 0) index = worksData.length - 1;
  if (index >= worksData.length) index = 0;
  
  currentIndex = index;
  const data = worksData[currentIndex];

  // 1) 텍스트 업데이트 (모달 내부)
  if (els.title) els.title.textContent = data.title;
  if (els.desc) els.desc.textContent = data.description;
  if (els.year) els.year.textContent = data.year;

  // 2) 메인 이미지 업데이트
  if (els.mainImg) els.mainImg.src = data.image;

  // 썸네일 활성화 상태 변경 호출 삭제
}

// [삭제됨] 4. THUMBNAILS: renderThumbnails, updateActiveThumbnail 함수 전체 삭제

// ============================================
// 5. EVENT: 모달 및 메뉴 이벤트 (버튼 이벤트 제거)
// ============================================

// 모달 제어 함수
function setupModalEvents() {
  if (els.mainImg && els.infoModal) {
    els.mainImg.style.cursor = 'pointer'; 
    els.mainImg.addEventListener('click', () => {
      els.infoModal.classList.remove('hidden');
    });
  }

  if (els.closeModalBtn && els.infoModal) {
    els.closeModalBtn.addEventListener('click', () => {
      els.infoModal.classList.add('hidden');
    });
  }

  if (els.modalBackdrop && els.infoModal) {
    els.modalBackdrop.addEventListener('click', () => {
      els.infoModal.classList.add('hidden');
    });
  }
}

// 메뉴 구성 및 기타 로직 유지
const menuItems = [
  { name: 'Instagram', link: 'https://www.instagram.com/a.palebluedot23/' },
  { name: 'Bonitabueno', link: 'https://bonitabueno.github.io/' },
  { name: '0331project', link: 'https://bonitabueno.github.io/0331project' }
];

function renderMenus() {
  const navPc = document.getElementById('nav-pc');
  const navMobile = document.getElementById('nav-mobile');
  if (!navPc || !navMobile) return;

  navPc.innerHTML = menuItems.map(item => `
    <a class="px-4 py-2 rounded-xl text-text-muted hover:text-text-dark font-medium text-sm hover:bg-text-dark/5 transition-colors" 
       href="${item.link}" target="_blank" rel="noopener noreferrer">${item.name}</a>
  `).join('') + '<div class="w-px h-6 bg-text-dark/10 my-auto mx-1"></div>';

  navMobile.innerHTML = menuItems.map(item => `
    <a class="text-2xl font-display font-bold text-text-dark" 
       href="${item.link}" target="_blank" rel="noopener noreferrer">${item.name}</a>
  `).join('');
}

window.addEventListener('DOMContentLoaded', () => {
  renderMenus();
  
  const mobileMenu = document.getElementById('mobile-menu');
  const openMenuBtn = document.querySelector('header button.md\\:hidden');
  const closeMenuBtn = document.getElementById('btn-close-menu');

  if (openMenuBtn) openMenuBtn.onclick = () => mobileMenu.classList.remove('hidden');
  if (closeMenuBtn) closeMenuBtn.onclick = () => mobileMenu.classList.add('hidden');
});
