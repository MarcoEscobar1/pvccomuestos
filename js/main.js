/**
 * PVC Compuestos S.A. — main.js
 * Funcionalidades: Navbar sticky/glassmorphism, Hamburger menu,
 * Tabs de productos, Scroll reveal (Intersection Observer)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. NAVBAR — Scroll & Over-hero behavior
     ========================================================= */
  const navbar     = document.getElementById('navbar');
  const hero       = document.getElementById('hero');
  const hamburger  = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function updateNavbar() {
    const scrollY    = window.scrollY;
    const heroBottom = hero ? hero.getBoundingClientRect().bottom + scrollY : 0;

    // Glassmorphism después de 50px
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Texto blanco sobre el hero
    if (scrollY < heroBottom - 72) {
      navbar.classList.add('over-hero');
    } else {
      navbar.classList.remove('over-hero');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // Estado inicial

  /* =========================================================
     2. HAMBURGER MENU (móvil)
     ========================================================= */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      // Bloquear scroll del body
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Cerrar al hacer click en un link
    mobileMenu.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* =========================================================
     3. SMOOTH SCROLL para links del navbar
     ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navbarH = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--navbar-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navbarH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* =========================================================
     5. SCROLL REVEAL — Intersection Observer
     ========================================================= */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Una sola vez
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: mostrar todos sin animación
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* =========================================================
     6. ACTIVE LINK en navbar según sección visible
     ========================================================= */
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.navbar__link[data-section]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active-link'));
          const activeLink = document.querySelector(
            `.navbar__link[data-section="${entry.target.id}"]`
          );
          if (activeLink) activeLink.classList.add('active-link');
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(sec => sectionObserver.observe(sec));

  /* =========================================================
     7. FORMULARIO — Prevención básica + feedback visual
     ========================================================= */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      if (btn) {
        btn.textContent = '✓ Mensaje enviado';
        btn.disabled = true;
        btn.style.opacity = '0.7';
        setTimeout(() => {
          btn.textContent = 'Enviar Mensaje';
          btn.disabled = false;
          btn.style.opacity = '';
          contactForm.reset();
        }, 3000);
      }
    });
  }

});
