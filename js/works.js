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
// 2. LOGIC: DOM 선택
// ============================================
const els = {
  // [삭제됨] bg-image 관련 코드 제거

  // 메인 이미지 및 컨트롤
  mainImg: document.getElementById('main-image'),
  thumbTrack: document.getElementById('thumbnails-track'),
  btnPrev: document.getElementById('btn-prev'),
  btnNext: document.getElementById('btn-next'),

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
  try {
    const response = await fetch('data/works.json'); 
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    worksData = await response.json();

    // 데이터 로드 후 화면 렌더링 시작
    if (worksData.length > 0) {
      renderThumbnails();
      updateDisplay(0);
    }
  } catch (error) {
    console.error("데이터를 불러오는 데 실패했습니다:", error);
    if (els.title) els.title.textContent = "Data Loading Failed";
  }
}

// ============================================
// 3. DISPLAY: 화면 업데이트
// ============================================
function updateDisplay(index) {
  if (worksData.length === 0) return;

  // 인덱스 범위 체크 (순환)
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

  // [삭제됨] 배경 이미지 업데이트 로직 제거

  // 3) 썸네일 활성화 상태 변경
  updateActiveThumbnail();
}

// ============================================
// 4. THUMBNAILS: 썸네일 생성 및 관리
// ============================================
function renderThumbnails() {
  if (!els.thumbTrack) return;
  els.thumbTrack.innerHTML = ''; // 초기화

  worksData.forEach((data, index) => {
    const thumbDiv = document.createElement('div');
    thumbDiv.className = `relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden cursor-pointer group transition-all transform hover:scale-105 border-2`;
    
    // 썸네일 클릭 시 해당 이미지로 변경
    thumbDiv.onclick = () => updateDisplay(index);

    thumbDiv.innerHTML = `
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('${data.thumb}');"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center p-1 overlay-text">
        <span class="text-[10px] text-white font-bold tracking-wide drop-shadow-md hidden current-label">Current</span>
      </div>
      <div class="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors overlay-hover"></div>
    `;
    
    thumbDiv.id = `thumb-${index}`;
    els.thumbTrack.appendChild(thumbDiv);
  });
}

function updateActiveThumbnail() {
  worksData.forEach((_, index) => {
    const thumb = document.getElementById(`thumb-${index}`);
    if (!thumb) return;

    const label = thumb.querySelector('.current-label');
    const hoverOverlay = thumb.querySelector('.overlay-hover');

    if (index === currentIndex) {
      // Active
      thumb.classList.remove('border-white/40', 'opacity-90');
      thumb.classList.add('border-primary', 'shadow-lg');
      if (label) label.classList.remove('hidden');
      if (hoverOverlay) hoverOverlay.classList.add('hidden');
    } else {
      // Inactive
      thumb.classList.add('border-white/40', 'opacity-90');
      thumb.classList.remove('border-primary', 'shadow-lg');
      if (label) label.classList.add('hidden');
      if (hoverOverlay) hoverOverlay.classList.remove('hidden');
    }
  });

  // 활성화된 썸네일로 스크롤 이동
  const activeThumb = document.getElementById(`thumb-${currentIndex}`);
  if (activeThumb) {
    activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

// ============================================
// 5. EVENT: 버튼 및 모달 이벤트
// ============================================

// 이전/다음 버튼
if (els.btnPrev) els.btnPrev.addEventListener('click', () => updateDisplay(currentIndex - 1));
if (els.btnNext) els.btnNext.addEventListener('click', () => updateDisplay(currentIndex + 1));

// 모달 제어 함수
function setupModalEvents() {
  // 1. 메인 이미지 클릭 -> 모달 열기
  if (els.mainImg && els.infoModal) {
    els.mainImg.style.cursor = 'pointer'; 
    els.mainImg.addEventListener('click', () => {
      els.infoModal.classList.remove('hidden');
    });
  }

  // 2. 닫기 버튼 클릭 -> 모달 닫기
  if (els.closeModalBtn && els.infoModal) {
    els.closeModalBtn.addEventListener('click', () => {
      els.infoModal.classList.add('hidden');
    });
  }

  // 3. 검은 배경(Backdrop) 클릭 -> 모달 닫기
  if (els.modalBackdrop && els.infoModal) {
    els.modalBackdrop.addEventListener('click', () => {
      els.infoModal.classList.add('hidden');
    });
  }
}

// 모바일 메뉴 제어 로직
const mobileMenu = document.getElementById('mobile-menu');
const openMenuBtn = document.querySelector('header button.md\\:hidden'); // 햄버거 버튼
const closeMenuBtn = document.getElementById('btn-close-menu');

if (openMenuBtn && mobileMenu) {
  openMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
  });
}

if (closeMenuBtn && mobileMenu) {
  closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });
}

const menuItems = [
  { name: 'Instagram', link: 'https://www.instagram.com/a.palebluedot23/' },
  { name: 'Bonitabueno', link: 'https://bonitabueno.github.io/' },
  { name: '0331project', link: 'https://bonitabueno.github.io/0331project' }
];

// 메뉴 렌더링 함수
function renderMenus() {
  const navPc = document.getElementById('nav-pc');
  const navMobile = document.getElementById('nav-mobile');

  if (!navPc || !navMobile) return;

  // PC 메뉴 생성: target="_blank" 및 보안 속성 추가
  navPc.innerHTML = menuItems.map(item => `
    <a class="px-4 py-2 rounded-xl text-text-muted hover:text-text-dark font-medium text-sm hover:bg-text-dark/5 transition-colors" 
       href="${item.link}" 
       target="_blank" 
       rel="noopener noreferrer">${item.name}</a>
  `).join('') + '<div class="w-px h-6 bg-text-dark/10 my-auto mx-1"></div>';

  // 모바일 메뉴 생성: target="_blank" 및 보안 속성 추가
  navMobile.innerHTML = menuItems.map(item => `
    <a class="text-2xl font-display font-bold text-text-dark" 
       href="${item.link}" 
       target="_blank" 
       rel="noopener noreferrer">${item.name}</a>
  `).join('');
}

// 3. 실행 및 이벤트 연결
window.addEventListener('DOMContentLoaded', () => {
  renderMenus();
  
  // 햄버거 버튼 로직
  const mobileMenu = document.getElementById('mobile-menu');
  const openMenuBtn = document.querySelector('header button.md\\:hidden');
  const closeMenuBtn = document.getElementById('btn-close-menu');

  if (openMenuBtn) openMenuBtn.onclick = () => mobileMenu.classList.remove('hidden');
  if (closeMenuBtn) closeMenuBtn.onclick = () => mobileMenu.classList.add('hidden');
});
