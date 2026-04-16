/* ═══════════════════════════════════════════════════════
   DEEPANSHU.EXE — script.js
   DOM interactions, animations, IntersectionObserver
   ═══════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── 1. NAVBAR: scroll-aware styling ──────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });


  /* ─── 2. MOBILE MENU ────────────────────────────────── */
  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');

  function toggleMenu(open) {
    menuBtn.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  menuBtn.addEventListener('click', () => {
    toggleMenu(!menuBtn.classList.contains('open'));
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });


  /* ─── 3. TYPING EFFECT ──────────────────────────────── */
  const typingEl = document.getElementById('typing-text');
  const phrases = [
    'CSE Engineer_',
    'Data Analyst_',
    'Hardware Builder_',
    'Biofeedback Dev_',
    'Problem Solver_',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  function typeLoop() {
    const current = phrases[phraseIndex];

    if (isPaused) {
      isPaused = false;
      isDeleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }

    if (!isDeleting) {
      typingEl.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(typeLoop, 100);
      } else {
        setTimeout(typeLoop, 68);
      }
    } else {
      typingEl.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeLoop, 350);
      } else {
        setTimeout(typeLoop, 40);
      }
    }
  }

  // Delay start until hero animation settles
  setTimeout(typeLoop, 900);


  /* ─── 4. INTERSECTION OBSERVER — section reveals ────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings within same parent
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 0.08}s`;
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* ─── 5. SKILL BAR ANIMATION ────────────────────────── */
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach(bar => barObserver.observe(bar));


  /* ─── 6. CONTACT FORM (mock submit) ─────────────────── */
  const contactForm = document.getElementById('contact-form');
  const formMsg     = document.getElementById('form-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = contactForm.name.value.trim();
      const email   = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !message) return;

      // Animate button
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = '⌛ Transmitting...';
      btn.disabled = true;

      setTimeout(() => {
        // Build mailto fallback
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
        window.location.href = `mailto:deepanshu.kumar@email.com?subject=${subject}&body=${body}`;

        btn.textContent = '✓ Transmitted';
        btn.style.borderColor = 'var(--green)';
        btn.style.color       = 'var(--green)';

        formMsg.classList.remove('hidden');
        contactForm.reset();

        setTimeout(() => {
          btn.textContent = '⌁ Transmit Message';
          btn.disabled = false;
          btn.style.borderColor = '';
          btn.style.color       = '';
          formMsg.classList.add('hidden');
        }, 4000);
      }, 900);
    });
  }


  /* ─── 7. ACTIVE NAV LINK (scroll-spy) ───────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.style.color = isActive ? 'var(--cyan)' : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => spyObserver.observe(s));


  /* ─── 8. CURSOR GLOW (subtle, desktop only) ─────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: transform 0.08s linear;
    `;
    document.body.appendChild(glow);

    window.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

})();