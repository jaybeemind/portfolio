/* ============================================================
   PORTFOLIO – script.js
   Vanilla JS: fixed nav, mobile menu, scroll reveal
   ============================================================ */

(function () {
  'use strict';

  // ---------------------- Helpers ----------------------

  /** Query a single element */
  const qs = (selector, root = document) => root.querySelector(selector);
  /** Query all elements */
  const qsa = (selector, root = document) => root.querySelectorAll(selector);

  // ---------------------- Dynamic year ----------------------
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------------------- Nav: scrolled state ----------------------
  const navHeader = qs('#nav-header');

  function updateNavScrolled() {
    if (!navHeader) return;
    if (window.scrollY > 20) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavScrolled, { passive: true });
  updateNavScrolled(); // run once on load

  // ---------------------- Nav: mobile menu toggle ----------------------
  const navToggle = qs('#nav-toggle');
  const navLinks  = qs('#nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a nav link is clicked
    qsa('.nav-link', navLinks).forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navHeader.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------------------- Scroll Reveal ----------------------
  /**
   * Uses IntersectionObserver to add the "visible" class to .reveal elements
   * when they enter the viewport. Falls back gracefully if the API is absent.
   */
  const revealEls = qsa('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Once revealed, stop observing
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,      // trigger when 12% of the element is visible
        rootMargin: '0px 0px -40px 0px', // slight bottom offset so elements near bottom reveal properly
      }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: immediately show all reveal elements
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  // ---------------------- Active nav link on scroll ----------------------
  /**
   * Highlights the nav link that corresponds to the currently visible section.
   */
  const sections   = qsa('section[id]');
  const navLinkEls = qsa('.nav-link');

  function setActiveLink() {
    let currentId = '';

    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top;
      // Consider section "active" if its top is within the upper portion of viewport
      if (top <= window.innerHeight * 0.35) {
        currentId = section.id;
      }
    });

    navLinkEls.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

})();
