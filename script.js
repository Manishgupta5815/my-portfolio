/* ---------- 0. PERSIST THEME ---------- */
(function () {
  const saved = localStorage.getItem('theme');
  document.body.classList.toggle('light', saved === 'light');
})();

/* ---------- 1. TYPEWRITER ---------- */
(function typewriter() {
  const words = ['Full-Stack Developer', 'ML Enthusiast', 'Problem Solver'];
  let i = 0, j = 0, forward = true;
  const el = document.getElementById('typewriter');
  (function type() {
    const speed = forward ? 70 : 30;
    if (j === 0) el.textContent = '';
    el.textContent = words[i].slice(0, j);
    if (forward) {
      j++;
      if (j > words[i].length) { forward = false; setTimeout(type, 1200); return; }
    } else {
      j--;
      if (j === 0) { forward = true; i = (i + 1) % words.length; setTimeout(type, 600); return; }
    }
    setTimeout(type, speed);
  })();
})();

/* ---------- 2. SCROLL REVEAL ---------- */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .section{opacity:0;transform:translateY(40px);transition:opacity .6s ease,transform .6s ease;}
    .section.reveal{opacity:1;transform:translateY(0);}
  `;
  document.head.appendChild(style);

  const obs = new IntersectionObserver(
    entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('reveal')),
    { threshold: 0.2 }
  );
  document.querySelectorAll('.section').forEach(el => obs.observe(el));
})();

/* ---------- 3. THEME INITIALISATION & TOGGLE ---------- */
(function () {
  const toggleBtn = document.getElementById('theme-toggle');
  const bodyEl    = document.body;
  const icon      = toggleBtn.querySelector('i');

  function refreshIcon() {
    const isLight = bodyEl.classList.contains('light');
    icon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
    lucide.createIcons();
  }

  // 1. restore saved theme
  const saved = localStorage.getItem('theme');
  bodyEl.classList.toggle('light', saved === 'light');

  // 2. set correct icon for restored theme
  refreshIcon();

  // 3. click handler
  toggleBtn.addEventListener('click', () => {
    bodyEl.classList.toggle('light');
    const nowLight = bodyEl.classList.contains('light');
    localStorage.setItem('theme', nowLight ? 'light' : 'dark');
    refreshIcon();
    updateParticleColor();
  });
})();

/* ---------- 4. HAMBURGER ---------- */
(function () {
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  document.querySelectorAll('.nav-links a').forEach(link =>
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    })
  );
})();

/* ---------- 5. RECOMMENDATIONS ---------- */
document.getElementById('rec-form').addEventListener('submit', e => {
  e.preventDefault();
  const [text, name] = [...e.target.elements].map(el => el.value.trim());
  if (!text) return;

  const card = document.createElement('div');
  card.className = 'rec-card';
  card.innerHTML = `<blockquote>“${text}”</blockquote><footer>— ${name || 'Anonymous'}</footer>`;

  document.querySelector('.rec-slider').appendChild(card);
  alert('Thank you for leaving a recommendation!');  
  e.target.reset();
});
/* ---------- 6. YEAR ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- 7. PARTICLE BG ---------- */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function pickColour() {
  return document.body.classList.contains('light')
    ? 'rgba(34, 61, 238, 0.5)'
    : 'rgba(34, 211, 238, 0.5)';
}
function updateParticleColor() {
  particles.forEach(p => p.c = pickColour());
}

class Particle {
  constructor() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.r  = Math.random() * 2 + 0.5;
    this.dx = Math.random() * 0.4 - 0.2;
    this.dy = Math.random() * 0.4 - 0.2;
    this.c  = pickColour();
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x < 0 || this.x > canvas.width)  this.dx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.dy *= -1;
  }
  draw() {
    ctx.fillStyle = this.c;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles.length = 0;
  for (let i = 0; i < 80; i++) particles.push(new Particle());
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

// kick everything off
initParticles();
animateParticles();
updateParticleColor();

/* ---------- 8. MOBILE EXTRAS ---------- */
if (window.innerWidth < 768) {
  document.querySelectorAll('[data-tilt]').forEach(el => el.vanillaTilt?.destroy());
}

/* ---------- 9. SCROLL ANIMATIONS ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const cls = el.dataset.animation || 'fade-up';
        el.classList.add('animated', cls);
        obs.unobserve(el);
      }
    }),
    { threshold: 0.2 }
  );
  document.querySelectorAll('[data-animation]').forEach(el => obs.observe(el));

  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
/* ---------- HERO PARALLAX (kept separate & light) ---------- */
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    heroContent.style.transform = `translateY(${scrolled * -0.3}px)`;
  });
}