/* ============================================================
   ARPITA BISWAS — PORTFOLIO  ·  script.js
   Features:
     - Custom cursor
     - Scroll-triggered reveal animations
     - Counter / stat animations
     - Proficiency bar animations
     - Active nav highlighting
     - Sticky nav shrink
     - Hamburger menu
     - Contact form validation
   ============================================================ */

'use strict';

/* ── CUSTOM CURSOR ────────────────────────────────────────── */
(function initCursor () {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (!cursor || !follower) return;

  let mx = 0, my = 0;   // mouse
  let fx = 0, fy = 0;   // follower

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    // snap dot to cursor immediately
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // smooth follower via rAF
  function animateFollower () {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // hover effect on interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, .tag, .project-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform   = 'translate(-50%,-50%) scale(2.5)';
      follower.style.transform = 'translate(-50%,-50%) scale(1.6)';
      cursor.style.background  = 'transparent';
      cursor.style.border      = '1.5px solid var(--gold)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform   = 'translate(-50%,-50%) scale(1)';
      follower.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.background  = 'var(--gold)';
      cursor.style.border      = 'none';
    });
  });
})();


/* ── NAVBAR — SHRINK & ACTIVE SECTION ─────────────────────── */
(function initNavbar () {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section[id]');

  function onScroll () {
    // shrink
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else                      navbar.classList.remove('scrolled');

    // active link
    let current = '';
    sections.forEach(sec => {
      const top    = sec.offsetTop - 120;
      const bottom = top + sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── HAMBURGER MENU ────────────────────────────────────────── */
(function initHamburger () {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // close on link click
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* ── SCROLL REVEAL ─────────────────────────────────────────── */
(function initReveal () {
  const elements = document.querySelectorAll('.reveal');

  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // once only
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();


/* ── COUNTER ANIMATION (hero stats) ───────────────────────── */
(function initCounters () {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;

  function animateCounter (el) {
    const target  = parseFloat(el.dataset.target);
    const decimal = parseInt(el.dataset.decimal, 10) || 0;
    const duration = 1800;  // ms
    const start    = performance.now();

    function step (now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease     = 1 - Math.pow(1 - progress, 3);
      const value    = (target * ease).toFixed(decimal);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const heroStats = document.querySelector('.hero-stats');
  if (!heroStats) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nums.forEach(animateCounter);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(heroStats);
})();


/* ── SKILL BAR ANIMATION ───────────────────────────────────── */
(function initSkillBars () {
  const bars = document.querySelectorAll('.bar-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bars.forEach((bar, i) => {
          setTimeout(() => {
            bar.style.width = bar.dataset.width + '%';
          }, i * 120);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const section = document.querySelector('.skill-bars');
  if (section) observer.observe(section);
})();


/* ── CONTACT FORM VALIDATION ───────────────────────────────── */
(function initContactForm () {
  const form    = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    'cf-name':    { id: 'err-name',    label: 'Name',    validate: v => v.trim().length >= 2 },
    'cf-email':   { id: 'err-email',   label: 'Email',   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    'cf-subject': { id: 'err-subject', label: 'Subject', validate: v => v.trim().length >= 3 },
    'cf-message': { id: 'err-message', label: 'Message', validate: v => v.trim().length >= 10 },
  };

  // Real-time validation on blur
  Object.entries(fields).forEach(([id, cfg]) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('blur', () => validateField(el, cfg));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(el, cfg);
    });
  });

  function validateField (el, cfg) {
    const errEl = document.getElementById(cfg.id);
    if (!errEl) return true;

    if (!cfg.validate(el.value)) {
      el.classList.add('error');
      if (el.id === 'cf-email') {
        errEl.textContent = 'Please enter a valid email address.';
      } else if (el.id === 'cf-message') {
        errEl.textContent = cfg.label + ' must be at least 10 characters.';
      } else {
        errEl.textContent = cfg.label + ' is required.';
      }
      return false;
    } else {
      el.classList.remove('error');
      errEl.textContent = '';
      return true;
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    Object.entries(fields).forEach(([id, cfg]) => {
      const el = document.getElementById(id);
      if (el && !validateField(el, cfg)) isValid = false;
    });

    if (!isValid) return;

    // Simulate send
    const btn     = form.querySelector('.btn-primary');
    const btnText = btn.querySelector('.btn-text');
    const success = document.getElementById('form-success');

    btn.disabled = true;
    btnText.textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btnText.textContent = 'Send Message';
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1600);
  });
})();


/* ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────────── */
(function initSmoothScroll () {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // nav height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── PARALLAX HERO BG TEXT ─────────────────────────────────── */
(function initParallax () {
  const bgText = document.querySelector('.hero-bg-text');
  if (!bgText) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    bgText.style.transform = `translate(-50%, calc(-55% + ${y * 0.25}px))`;
  }, { passive: true });
})();


/* ── TILT EFFECT ON PROJECT CARDS ──────────────────────────── */
(function initTilt () {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect    = card.getBoundingClientRect();
      const cx      = rect.left + rect.width  / 2;
      const cy      = rect.top  + rect.height / 2;
      const dx      = (e.clientX - cx) / (rect.width  / 2);
      const dy      = (e.clientY - cy) / (rect.height / 2);
      const rotX    = -dy * 5;
      const rotY    =  dx * 5;
      card.style.transform = `translateY(-5px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s ease';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
})();
