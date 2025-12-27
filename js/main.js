// 페이지 로드 후 살짝 페이드 인 효과
window.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "0";

  requestAnimationFrame(() => {
    document.body.style.transition = "opacity 0.6s ease";
    document.body.style.opacity = "1";
  });
});
