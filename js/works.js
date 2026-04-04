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
let carouselItems = []; // 동적으로 생성될 캐러셀 이미지 배열
let isDragging = false; // 드래그 상태 확인 변수
let startX = 0;         // 밀기 시작 X 좌표

// ============================================
// 2. LOGIC: DOM 선택
// ============================================
const els = {
  // 캐러셀 컨테이너
  carouselContainer: document.getElementById('carousel-container'),

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
  setupModalEvents(); // 모달 닫기 이벤트 연결
});

// 리사이즈 이벤트 감지하여 스케일 실시간 반영
window.addEventListener('resize', () => {
  if (worksData.length > 0) {
    updateDisplay(currentIndex);
  }
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
      if (els.carouselContainer) els.carouselContainer.classList.remove('hidden');
      if (errorEl) errorEl.classList.add('hidden');
      
      // 캐러셀 초기화 함수 호출
      initCarousel();
    } else {
      throw new Error("데이터가 비어있습니다.");
    }

  } catch (error) {
    console.error("데이터 로드 실패:", error);
    if (els.carouselContainer) els.carouselContainer.classList.add('hidden');
    if (errorEl) {
      errorEl.classList.remove('hidden');
      errorEl.textContent = "오류가 발생했습니다.";
    }
    if (els.title) els.title.textContent = "Data Loading Failed";
  }
}

// 캐러셀 DOM 초기화 함수
function initCarousel() {
  if (!els.carouselContainer) return;
  
  worksData.forEach((data, index) => {
    const img = document.createElement('img');
    img.src = data.image;
    img.alt = data.title;
    img.draggable = false; // 마우스 드래그 시 고스트 이미지 방지
    // 캐러셀 아이템 기본 스타일 (Tailwind 클래스 적용)
    img.className = 'absolute inset-0 w-full h-full object-contain cursor-pointer transition-all duration-700 ease-in-out will-change-transform';
    
    // 클릭 이벤트 분기 처리
    img.addEventListener('click', (e) => {
      // 드래그 중 발생한 클릭 이벤트는 무시
      if (isDragging) return;
      
      if (currentIndex === index) {
        // 1) 중앙에 위치한 이미지를 클릭 시 모달 열기
        openModal(data);
      } else {
        // 2) 좌/우측 등 다른 이미지를 클릭 시 해당 이미지로 회전
        updateDisplay(index);
      }
    });
    
    els.carouselContainer.appendChild(img);
    carouselItems.push(img);
  });

  // 드래그(밀기) 이벤트 핸들러
  const dragStart = (e) => {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  };

  const dragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const diff = currentX - startX;

    // 50px 이상 밀었을 때 롤링 동작 트리거
    if (diff > 50) {
      updateDisplay(currentIndex - 1);
      isDragging = false; // 한 번 롤링 후 추가 동작 방지
    } else if (diff < -50) {
      updateDisplay(currentIndex + 1);
      isDragging = false;
    }
  };

  const dragEnd = () => {
    isDragging = false;
  };

  // 모바일 터치 이벤트
  els.carouselContainer.addEventListener('touchstart', dragStart, { passive: true });
  els.carouselContainer.addEventListener('touchmove', dragMove, { passive: true });
  els.carouselContainer.addEventListener('touchend', dragEnd);
  els.carouselContainer.addEventListener('touchcancel', dragEnd);

  // PC 마우스 이벤트
  els.carouselContainer.addEventListener('mousedown', dragStart);
  els.carouselContainer.addEventListener('mousemove', dragMove);
  els.carouselContainer.addEventListener('mouseup', dragEnd);
  els.carouselContainer.addEventListener('mouseleave', dragEnd);
  
  // 최초 디스플레이 업데이트
  updateDisplay(0);
}

// ============================================
// 3. DISPLAY: 화면 업데이트 (캐러셀 회전 로직)
// ============================================
function updateDisplay(index) {
  if (worksData.length === 0) return;

  if (index < 0) index = worksData.length - 1;
  if (index >= worksData.length) index = 0;
  
  currentIndex = index;
  const total = carouselItems.length;

  // 화면 너비에 따른 스케일 비율 설정 (모바일 기준 768px 미만)
  const isMobile = window.innerWidth < 768;
  const centerScale = isMobile ? 0.7 : 0.85;
  const sideScale = isMobile ? 0.45 : 0.55;

  carouselItems.forEach((item, i) => {
    // 현재 인덱스를 기준으로 각 아이템의 상대적 위치 계산
    let diff = (i - currentIndex + total) % total;
    
    if (diff === 0) {
      // 1) 중앙 이미지 (포커스)
      item.style.transform = `translateX(0) scale(${centerScale})`;
      item.style.zIndex = 30;
      item.style.opacity = 1;
      item.style.pointerEvents = 'auto';
    } else if (diff === 1 || (total === 2 && diff === 1)) {
      // 2) 우측 이미지
      item.style.transform = `translateX(65%) scale(${sideScale})`;
      item.style.zIndex = 20;
      item.style.opacity = 0.5;
      item.style.pointerEvents = 'auto';
    } else if (diff === total - 1) {
      // 3) 좌측 이미지
      item.style.transform = `translateX(-65%) scale(${sideScale})`;
      item.style.zIndex = 20;
      item.style.opacity = 0.5;
      item.style.pointerEvents = 'auto';
    } else {
      // 4) 그 외의 이미지 (후면 숨김 처리)
      item.style.transform = 'translateX(0) scale(0.3)';
      item.style.zIndex = 10;
      item.style.opacity = 0;
      item.style.pointerEvents = 'none';
    }
  });
}

// 모달 데이터 바인딩 및 노출
function openModal(data) {
  if (els.title) els.title.textContent = data.title;
  if (els.desc) els.desc.textContent = data.description;
  if (els.year) els.year.textContent = data.year;
  
  if (els.infoModal) els.infoModal.classList.remove('hidden');
}

// ============================================
// 5. EVENT: 모달 및 메뉴 이벤트
// ============================================

// 모달 제어 함수 (닫기 기능만 전담)
function setupModalEvents() {
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
