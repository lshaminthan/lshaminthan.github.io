// ===== Mobile menu =====
const navLinks = document.getElementById('navLinks');
document.getElementById('menuBtn').addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ===== Sticky nav, active link =====
const nav = document.getElementById('nav');
const sections = [...document.querySelectorAll('section[id]')];
const links = [...navLinks.querySelectorAll('a')];

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 20);

  let current = 'home';
  for (const s of sections) {
    if (y >= s.getBoundingClientRect().top + y - 140) current = s.id;
  }
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Scroll reveal =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 100}ms`;
  observer.observe(el);
});

// ===== Email links =====
// On computers, mailto: often opens the wrong app (or nothing), so email links
// open Gmail's compose window instead. Phones keep mailto:, which opens their
// mail app. Every click also copies the address, for non-Gmail visitors.
const isPhone = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const toast = document.createElement('div');
toast.className = 'toast';
toast.setAttribute('role', 'status');
toast.setAttribute('aria-live', 'polite');
document.body.appendChild(toast);
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
  link.addEventListener('click', e => {
    const email = link.getAttribute('href').replace('mailto:', '').split('?')[0];

    if (!isPhone) {
      e.preventDefault();
      const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
      window.open(gmail, '_blank', 'noopener');
    }

    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(email)
      .then(() => showToast(`✅ Email copied: ${email}`))
      .catch(() => {});
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
