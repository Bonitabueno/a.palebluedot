const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
const scene = document.getElementById('scene');
const title = document.getElementById('title');
const enterBtn = document.querySelector('.link.enter');
const transition = document.getElementById('transition');

let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const particles = Array.from({ length: 120 }, () => {
  const cx = Math.random() * w;
  const cy = Math.random() * h;
  return {
    cx,
    cy,
    angle: Math.random() * Math.PI * 2,
    speed: 0.001 + Math.random() * 0.002,
    radius: 10 + Math.random() * 40,
    offset: Math.random() * 1000
  };
});

let t = 0;
function draw() {
  ctx.fillStyle = '#0b1020';
  ctx.fillRect(0, 0, w, h);
  particles.forEach(p => {
    p.angle += p.speed;
    const x = p.cx + Math.cos(p.angle + t * 0.001 + p.offset) * p.radius;
    const y = p.cy + Math.sin(p.angle + t * 0.001 + p.offset) * p.radius;
    ctx.beginPath();
    ctx.arc(x, y, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  });
  t++;
  requestAnimationFrame(draw);
}
draw();

setTimeout(() => {
  scene.classList.add('active');
}, 700);

// 마우스 움직임에 따른 타이틀 패럴랙스 효과
let mouseTimeout;
window.addEventListener('mousemove', e => {
  const x = (e.clientX - w/2) * 0.002;
  const y = (e.clientY - h/2) * 0.002;
  
  title.style.animation = 'none';
  title.style.transform = `translate(${x*20}px, ${y*20}px)`;

  clearTimeout(mouseTimeout);
  mouseTimeout = setTimeout(() => {
    title.style.animation = 'float 3s ease-in-out infinite';
  }, 2000);
});

// Enter 버튼 인터랙션 (터치 및 마우스 지원)
enterBtn.addEventListener('mousedown', () => enterBtn.classList.add('clicked'));
enterBtn.addEventListener('mouseup', () => setTimeout(() => enterBtn.classList.remove('clicked'), 150));
enterBtn.addEventListener('mouseleave', () => enterBtn.classList.remove('clicked'));

enterBtn.addEventListener('touchstart', () => enterBtn.classList.add('clicked'));
enterBtn.addEventListener('touchend', () => setTimeout(() => enterBtn.classList.remove('clicked'), 150));

// Enter 버튼 클릭 시 이동
enterBtn.addEventListener('click', () => {
  // transition-overlay를 활용하고 싶다면 여기에 transition.classList.add('active')를 추가하고
  // setTimeout으로 페이지 이동을 감싸면 됩니다. 현재는 즉시 이동합니다.
  window.location.href = 'works.html';
});
