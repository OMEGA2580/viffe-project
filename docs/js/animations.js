(function () {
  'use strict';

  function createParticles(container, count) {
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = '-10px';
      p.style.animationDuration = (8 + Math.random() * 10) + 's';
      p.style.animationDelay = (Math.random() * 8) + 's';
      const size = 2 + Math.random() * 3;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      container.appendChild(p);
    }
  }

  function initParallax() {
    const parallax = document.querySelector('.hero-parallax');
    if (!parallax) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          parallax.style.transform = 'translateY(' + (y * 0.3) + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((el) => observer.observe(el));
  }

  function animateCounter(el, target, duration) {
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('fr-FR');
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('fr-FR');
    }
    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = document.querySelectorAll('.counter[data-target]');
    if (!counters.length) return;
    if (!('IntersectionObserver' in window)) {
      counters.forEach((el) => {
        el.textContent = Number(el.dataset.target).toLocaleString('fr-FR');
      });
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el, Number(el.dataset.target), 1800);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach((el) => observer.observe(el));
  }

  function initCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    if (!track || slides.length === 0) return;

    let current = 0;
    const total = slides.length;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Témoignage ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      });
    }

    function goTo(index) {
      current = index;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      }
    }

    let auto = setInterval(() => goTo((current + 1) % total), 6000);
    carousel.addEventListener('mouseenter', () => clearInterval(auto));
    carousel.addEventListener('mouseleave', () => {
      auto = setInterval(() => goTo((current + 1) % total), 6000);
    });
  }

  function initImageFallback() {
    const images = document.querySelectorAll('img[data-fallback]');
    images.forEach((img) => {
      img.addEventListener('error', function () {
        if (this.src.endsWith(this.dataset.fallback)) return;
        this.src = this.dataset.fallback;
      }, { once: true });
    });
  }


  /* ---------- 8. Détection vidéo absente (placeholder) ---------- */
  function initVideoPlaceholder() {
    const wrapper = document.querySelector('.video-wrapper');
    const video = wrapper ? wrapper.querySelector('.pillars-video-player') : null;
    if (!wrapper || !video) return;

    // Vérifier si le fichier vidéo existe via fetch HEAD
    const src = video.querySelector('source')?.getAttribute('src');
    if (!src) {
      wrapper.classList.add('is-empty');
      return;
    }

    fetch(src, { method: 'HEAD' })
      .then((r) => {
        if (!r.ok) wrapper.classList.add('is-empty');
      })
      .catch(() => wrapper.classList.add('is-empty'));

    // Aussi vérifier l'événement error du <video>
    video.addEventListener('error', () => {
      wrapper.classList.add('is-empty');
    }, { once: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const particleContainer = document.querySelector('.particles');
    if (particleContainer) createParticles(particleContainer, 25);
    initParallax();
    initReveal();
    initCounters();
    initCarousel();
    initImageFallback();
    initVideoPlaceholder();
  });
})();

/* ============================================
   SÉLECTEUR DE MONTANTS DE DON
   ============================================ */

(function () {
  'use strict';

  function initDonSelector() {
    const buttons = document.querySelectorAll('.don-amount');
    const amountDisplay = document.getElementById('don-selected-amount');
    const mainBtn = document.getElementById('don-main-btn');
    if (!buttons.length || !mainBtn) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Retirer .active de tous
        buttons.forEach((b) => b.classList.remove('active'));
        // Activer celui cliqué
        btn.classList.add('active');

        const amount = btn.dataset.amount;
        if (amount === 'custom') {
          amountDisplay.textContent = '___';
          mainBtn.querySelector('a, span').textContent = '';
          mainBtn.href = 'dons.html?custom=1';
        } else {
          // Format avec espace pour les milliers
          const formatted = Number(amount).toLocaleString('fr-FR');
          amountDisplay.textContent = formatted;
          mainBtn.href = `dons.html?montant=${amount}`;
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initDonSelector);
})();

/* ============================================
   SAISIE DIRECTE DU MONTANT DE DON
   ============================================ */

(function () {
  'use strict';

  function formatMoney(n) {
    return Math.round(n).toLocaleString('fr-FR');
  }

  function initDonCustomInput() {
    // Chercher tous les champs custom (index.html + dons.html)
    const inputs = document.querySelectorAll('.don-amount-input');
    if (!inputs.length) return;

    inputs.forEach((input) => {
      const wrapper = input.closest('.don-custom-input');
      const amountDisplay = document.getElementById('don-selected-amount');
      const mainBtn = document.getElementById('don-main-btn');
      const amountButtons = document.querySelectorAll('.don-amount');

      input.addEventListener('input', () => {
        const raw = input.value.trim();
        const value = Number(raw);

        // Style visuel
        wrapper.classList.toggle('has-value', raw !== '' && value > 0);

        // Désactiver les boutons prédéfinis
        amountButtons.forEach((b) => b.classList.remove('active'));

        // Mettre à jour l'affichage
        if (amountDisplay && raw !== '' && value > 0) {
          amountDisplay.textContent = formatMoney(value);
        }

        // Mettre à jour le lien du bouton principal
        if (mainBtn) {
          if (raw !== '' && value >= 100) {
            mainBtn.href = `dons.html?montant=${value}`;
          } else {
            mainBtn.href = 'dons.html';
          }
        }
      });

      // Quand on clique dans le champ, désélectionner les boutons prédéfinis
      input.addEventListener('focus', () => {
        amountButtons.forEach((b) => b.classList.remove('active'));
      });

      // Effacer le champ quand on clique sur un bouton prédéfini
      input.addEventListener('blur', () => {
        // Ne pas effacer automatiquement, on laisse l'utilisateur voir sa saisie
      });
    });

    // Quand on clique sur un bouton prédéfini, vider le champ custom
    amountButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        inputs.forEach((inp) => {
          inp.value = '';
          inp.closest('.don-custom-input')?.classList.remove('has-value');
        });
      });
    });
  }

  // Réinitialiser le init existant du don : on enlève l'ancien gestionnaire "custom"
  // pour éviter les conflits avec l'ancien code qui gérait le bouton "custom"
  function patchDonSelector() {
    const buttons = document.querySelectorAll('.don-amount');
    const amountDisplay = document.getElementById('don-selected-amount');
    const mainBtn = document.getElementById('don-main-btn');
    if (!buttons.length || !mainBtn) return;

    // On retire d'abord tous les anciens listeners en clonant les boutons
    buttons.forEach((btn) => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
    });

    // Réattacher un listener propre
    const freshButtons = document.querySelectorAll('.don-amount');
    freshButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        freshButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const amount = btn.dataset.amount;
        if (amount === 'custom') {
          // Ancien cas, ne devrait plus arriver
          return;
        }

        // Vider le champ custom
        document.querySelectorAll('.don-amount-input').forEach((inp) => {
          inp.value = '';
          inp.closest('.don-custom-input')?.classList.remove('has-value');
        });

        if (amountDisplay) {
          amountDisplay.textContent = formatMoney(Number(amount));
        }
        mainBtn.href = `dons.html?montant=${amount}`;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    patchDonSelector();
    initDonCustomInput();
  });
})();
