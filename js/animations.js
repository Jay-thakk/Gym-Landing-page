// animations.js

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.18,
  rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal, .fade-up')
  .forEach(el => io.observe(el));

const glow = document.querySelector('.cursor-glow');

let gx = window.innerWidth / 2;
let gy = window.innerHeight / 2;

let tx = gx;
let ty = gy;

window.addEventListener('mousemove', e => {
  tx = e.clientX;
  ty = e.clientY;
});

(function loop() {
  gx += (tx - gx) * 0.12;
  gy += (ty - gy) * 0.12;

  glow.style.left = gx + 'px';
  glow.style.top = gy + 'px';

  requestAnimationFrame(loop);
})();