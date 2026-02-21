// ============================================================
// Aart Sense Records — Main JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ----------------------------------------------------------
  // 1. Mobile Menu Toggle
  // ----------------------------------------------------------
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !isHidden);
      // Swap icon between menu and close
      const icon = menuBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = isHidden ? 'close' : 'menu';
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        const icon = menuBtn.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'menu';
      }
    });
  }

  // ----------------------------------------------------------
  // 2. Active Nav Link Highlighting
  // ----------------------------------------------------------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && href !== '#' && href === currentPage) {
      link.classList.add('text-primary');
      link.classList.remove('text-slate-500', 'text-slate-400', 'text-slate-600');
    }
  });

  // ----------------------------------------------------------
  // 3. Smooth Scroll for anchor links
  // ----------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        if (mobileMenu) {
          mobileMenu.classList.add('hidden');
          const icon = menuBtn && menuBtn.querySelector('.material-symbols-outlined');
          if (icon) icon.textContent = 'menu';
        }
      }
    });
  });

  // ----------------------------------------------------------
  // 4. Header Scroll Shadow
  // ----------------------------------------------------------
  const siteHeader = document.querySelector('header') || document.querySelector('nav.sticky');
  if (siteHeader) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        siteHeader.classList.add('shadow-xl', 'shadow-black/30');
      } else {
        siteHeader.classList.remove('shadow-xl', 'shadow-black/30');
      }
    }, { passive: true });
  }

  // ----------------------------------------------------------
  // 5. FAQ Accordion (click-based)
  // ----------------------------------------------------------
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const arrow = item.querySelector('.arrow-icon');

    if (!header || !content) return;

    // Set initial state
    content.style.maxHeight = '0px';
    content.style.overflow = 'hidden';
    content.style.transition = 'max-height 0.35s ease';

    header.style.cursor = 'pointer';
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');

    header.addEventListener('click', function () {
      const isOpen = content.style.maxHeight !== '0px';

      // Close all siblings first
      const parentList = item.parentElement;
      parentList.querySelectorAll('.accordion-item').forEach(function (sibling) {
        if (sibling === item) return;
        const sc = sibling.querySelector('.accordion-content');
        const sa = sibling.querySelector('.arrow-icon');
        const sh = sibling.querySelector('.accordion-header');
        if (sc) sc.style.maxHeight = '0px';
        if (sa) sa.style.transform = 'rotate(0deg)';
        if (sh) sh.setAttribute('aria-expanded', 'false');
        sibling.classList.remove('ring-1', 'ring-primary');
      });

      if (isOpen) {
        content.style.maxHeight = '0px';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
        header.setAttribute('aria-expanded', 'false');
        item.classList.remove('ring-1', 'ring-primary');
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        header.setAttribute('aria-expanded', 'true');
        item.classList.add('ring-1', 'ring-primary');
      }
    });

    // Keyboard accessibility
    header.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  // ----------------------------------------------------------
  // 6. FAQ Category Tabs
  // ----------------------------------------------------------
  const tabButtons = document.querySelectorAll('[data-faq-tab]');
  const tabSections = document.querySelectorAll('[data-faq-section]');

  if (tabButtons.length) {
    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = this.getAttribute('data-faq-tab');

        // Update active tab styles
        tabButtons.forEach(function (b) {
          b.classList.remove('border-primary', 'text-primary', 'font-bold');
          b.classList.add('border-transparent', 'text-slate-500');
        });
        this.classList.add('border-primary', 'text-primary', 'font-bold');
        this.classList.remove('border-transparent', 'text-slate-500');

        // Show/hide sections
        tabSections.forEach(function (section) {
          if (target === 'all' || section.getAttribute('data-faq-section') === target) {
            section.style.display = '';
          } else {
            section.style.display = 'none';
          }
        });
      });
    });
  }

  // ----------------------------------------------------------
  // 7. FAQ Search / Filter
  // ----------------------------------------------------------
  const faqSearch = document.querySelector('[data-faq-search]');
  if (faqSearch) {
    faqSearch.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      document.querySelectorAll('.accordion-item').forEach(function (item) {
        const q = (item.querySelector('h4') || item.querySelector('h3'))?.textContent.toLowerCase() || '';
        const a = item.querySelector('.accordion-content')?.textContent.toLowerCase() || '';
        item.style.display = (!query || q.includes(query) || a.includes(query)) ? '' : 'none';
      });
    });
  }

  // ----------------------------------------------------------
  // 8. Contact Form Validation & Submission
  // ----------------------------------------------------------
  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      contactForm.querySelectorAll('.form-error').forEach(function (el) { el.remove(); });
      contactForm.querySelectorAll('.border-red-500').forEach(function (el) {
        el.classList.remove('border-red-500');
      });

      let isValid = true;

      function showError(input, msg) {
        if (!input) return;
        input.classList.add('border-red-500');
        const err = document.createElement('p');
        err.className = 'form-error text-xs text-red-400 mt-1';
        err.textContent = msg;
        input.parentElement.appendChild(err);
        isValid = false;
      }

      const firstName = contactForm.querySelector('[name="firstName"]');
      const lastName = contactForm.querySelector('[name="lastName"]');
      const email = contactForm.querySelector('[name="email"]');
      const message = contactForm.querySelector('[name="message"]');

      if (firstName && !firstName.value.trim()) showError(firstName, 'First name is required.');
      if (lastName && !lastName.value.trim()) showError(lastName, 'Last name is required.');
      if (email) {
        if (!email.value.trim()) {
          showError(email, 'Email address is required.');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
          showError(email, 'Please enter a valid email address.');
        }
      }
      if (message && !message.value.trim()) showError(message, 'Please tell us about your project.');

      if (!isValid) return;

      const submitBtn = contactForm.querySelector('[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="material-symbols-outlined" style="animation:spin 1s linear infinite">refresh</span> Sending...';

      setTimeout(function () {
        submitBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Request Sent!';
        submitBtn.classList.replace('bg-primary', 'bg-emerald-600');

        setTimeout(function () {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          submitBtn.classList.replace('bg-emerald-600', 'bg-primary');
        }, 3000);
      }, 1500);
    });
  }

  // ----------------------------------------------------------
  // 9. Newsletter Form
  // ----------------------------------------------------------
  const newsletterForm = document.querySelector('[data-newsletter-form]');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const btn = this.querySelector('button[type="submit"]');
      if (!emailInput || !btn) return;

      if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        emailInput.classList.add('border-red-500');
        setTimeout(function () { emailInput.classList.remove('border-red-500'); }, 2000);
        return;
      }

      const original = btn.textContent;
      btn.textContent = 'Subscribed!';
      btn.classList.replace('bg-primary', 'bg-emerald-600');
      emailInput.value = '';

      setTimeout(function () {
        btn.textContent = original;
        btn.classList.replace('bg-emerald-600', 'bg-primary');
      }, 3000);
    });
  }

  // ----------------------------------------------------------
  // 10. Investor: Annual / Quarterly Toggle
  // ----------------------------------------------------------
  const investorToggle = document.querySelector('[data-investor-toggle]');
  if (investorToggle) {
    investorToggle.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        investorToggle.querySelectorAll('button').forEach(function (b) {
          b.classList.remove('bg-primary', 'text-white');
          b.classList.add('text-slate-400');
        });
        this.classList.add('bg-primary', 'text-white');
        this.classList.remove('text-slate-400');
      });
    });
  }

});

// Keyframe for spin animation used in contact form
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
document.head.appendChild(spinStyle);
