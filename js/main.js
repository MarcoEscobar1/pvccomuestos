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
     7. FORMULARIO — Validación completa + Web3Forms
     ========================================================= */
  const contactForm   = document.getElementById('contactForm');
  const formStatus    = document.getElementById('formStatus');
  const charCount     = document.getElementById('charCount');
  const msgTextarea   = document.getElementById('contactMensaje');
  const submitBtn     = document.getElementById('contactSubmitBtn');

  // ── Contador de caracteres del mensaje ──
  if (msgTextarea && charCount) {
    msgTextarea.addEventListener('input', () => {
      const len = msgTextarea.value.length;
      charCount.textContent = `${len} / 2000`;
      charCount.classList.toggle('form-char-count--warn', len > 1800);
    });
  }

  // ── Utilidades de validación ──
  function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input)  input.classList.add('form-input--error');
    if (error) { error.textContent = message; error.hidden = false; }
  }

  function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input)  input.classList.remove('form-input--error');
    if (error) { error.textContent = ''; error.hidden = true; }
  }

  function clearAllErrors() {
    [
      ['contactNombre',   'errorNombre'],
      ['contactEmpresa',  'errorEmpresa'],
      ['contactEmail',    'errorEmail'],
      ['contactTelefono', 'errorTelefono'],
      ['contactAsunto',   'errorAsunto'],
      ['contactMensaje',  'errorMensaje'],
    ].forEach(([iId, eId]) => clearError(iId, eId));
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function validatePhone(phone) {
    // Obligatorio: acepta formatos tipo +591 7XXXXXXX o números locales
    return /^[+\d\s\-().]{6,20}$/.test(phone);
  }

  function validateForm() {
    let valid = true;

    const nombre   = document.getElementById('contactNombre')?.value.trim()   ?? '';
    const empresa  = document.getElementById('contactEmpresa')?.value.trim()  ?? '';
    const email    = document.getElementById('contactEmail')?.value.trim()    ?? '';
    const telefono = document.getElementById('contactTelefono')?.value.trim() ?? '';
    const asunto   = document.getElementById('contactAsunto')?.value.trim()   ?? '';
    const mensaje  = document.getElementById('contactMensaje')?.value.trim()  ?? '';

    if (nombre.length < 2) {
      showError('contactNombre', 'errorNombre', 'Ingrese su nombre completo (mínimo 2 caracteres).');
      valid = false;
    }

    if (empresa.length < 2) {
      showError('contactEmpresa', 'errorEmpresa', 'Ingrese el nombre de su empresa (mínimo 2 caracteres).');
      valid = false;
    }

    if (!validateEmail(email)) {
      showError('contactEmail', 'errorEmail', 'Ingrese un correo electrónico válido.');
      valid = false;
    }

    if (!validatePhone(telefono)) {
      showError('contactTelefono', 'errorTelefono', 'Ingrese un teléfono válido (ej: +591 77999345).');
      valid = false;
    }

    if (asunto.length < 3) {
      showError('contactAsunto', 'errorAsunto', 'Ingrese un asunto (mínimo 3 caracteres).');
      valid = false;
    }

    if (mensaje.length < 10) {
      showError('contactMensaje', 'errorMensaje', 'El mensaje debe tener al menos 10 caracteres.');
      valid = false;
    }

    return valid;
  }

  // ── Validación en tiempo real al salir de cada campo ──
  [
    { id: 'contactNombre',   errId: 'errorNombre'   },
    { id: 'contactEmpresa',  errId: 'errorEmpresa'  },
    { id: 'contactEmail',    errId: 'errorEmail'    },
    { id: 'contactTelefono', errId: 'errorTelefono' },
    { id: 'contactAsunto',   errId: 'errorAsunto'   },
    { id: 'contactMensaje',  errId: 'errorMensaje'  },
  ].forEach(({ id, errId }) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => {
      clearError(id, errId);
      validateForm();
    });
  });

  // ── UI del botón ──
  function setLoading(loading) {
    if (!submitBtn) return;
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    const btnIcon    = submitBtn.querySelector('.btn-icon');
    submitBtn.disabled = loading;
    if (btnText)    btnText.textContent = loading ? 'Enviando…' : 'Enviar Mensaje';
    if (btnSpinner) btnSpinner.hidden   = !loading;
    if (btnIcon)    btnIcon.hidden      = loading;
  }

  function showFormStatus(type, message) {
    if (!formStatus) return;
    formStatus.hidden    = false;
    formStatus.className = `form-status form-status--${type}`;
    formStatus.textContent = message;
    // Auto-ocultar el mensaje de éxito después de 8s
    if (type === 'success') {
      setTimeout(() => { formStatus.hidden = true; }, 8000);
    }
  }

  // ── Envío del formulario ──
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAllErrors();
      if (formStatus) formStatus.hidden = true;

      if (!validateForm()) {
        // Scroll suave al primer error
        const firstError = contactForm.querySelector('.form-input--error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      setLoading(true);

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          showFormStatus('success', '✓ ¡Mensaje enviado! Le responderemos a la brevedad.');
          contactForm.reset();
          if (charCount) charCount.textContent = '0 / 2000';
          clearAllErrors();
        } else {
          showFormStatus('error', '✗ Hubo un problema al enviar. Por favor intente de nuevo.');
        }
      } catch (err) {
        showFormStatus('error', '✗ Error de red. Verifique su conexión e intente de nuevo.');
      } finally {
        setLoading(false);
      }
    });
  }

});
