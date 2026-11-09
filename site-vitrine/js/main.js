function toggleMenu() {
  const menu = document.getElementById('navlinks');
  const button = document.querySelector('.menu-toggle');
  if (!menu || !button) return;
  const isOpen = menu.classList.toggle('open');
  button.setAttribute('aria-expanded', String(isOpen));
  button.textContent = isOpen ? '✕' : '☰';
}

function closeMenu() {
  const menu = document.getElementById('navlinks');
  const button = document.querySelector('.menu-toggle');
  if (!menu || !button) return;
  menu.classList.remove('open');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = '☰';
}

document.addEventListener('click', (e) => {
  const nav = document.querySelector('.nav');
  const menu = document.getElementById('navlinks');
  if (nav && menu && menu.classList.contains('open') && !nav.contains(e.target)) {
    closeMenu();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      if (status) {
        status.textContent = '✓ Votre message a bien été pris en compte. Nous vous répondrons rapidement.';
        status.style.display = 'block';
      }
      form.reset();
    });
  }
});
