/* ==========================================================================
   Preeti Patil - Portfolio Shared JavaScript
   Features:
   1. Image Zoom / Lightbox Modal (click to enlarge, close with Esc or click)
   2. Reading Progress Bar (top of case study pages)
   3. Mobile Navigation Menu Toggle
   4. Sticky Rail Active Section Highlighting via IntersectionObserver
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  // --- 1. Mobile Menu Toggle ---
  var menuToggle = document.querySelector('.menu-toggle');
  var primaryNav = document.querySelector('.bar nav');
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = primaryNav.classList.toggle('mobile-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    // Close when clicking any nav link
    primaryNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        primaryNav.classList.remove('mobile-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      });
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!primaryNav.contains(e.target) && !menuToggle.contains(e.target)) {
        primaryNav.classList.remove('mobile-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      }
    });
  }

  // --- 2. Reading Progress Bar ---
  var progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    var updateProgress = function () {
      var scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal > 0) {
        var progress = (window.pageYOffset || document.documentElement.scrollTop) / scrollTotal;
        var percentage = Math.min(100, Math.max(0, Math.round(progress * 100)));
        progressBar.style.width = percentage + '%';
      }
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  // --- 3. Lightbox Modal for Screenshots ---
  var lightbox = document.getElementById('lightbox-modal');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg) {
    var closeLightbox = function () {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      if (lightboxImg) lightboxImg.src = '';
      if (lightboxCaption) lightboxCaption.textContent = '';
    };

    var openLightbox = function (imgEl) {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt || 'Screenshot enlarged';

      // Find caption if inside a figure
      var captionText = '';
      var fig = imgEl.closest('figure');
      if (fig) {
        var cap = fig.querySelector('figcaption');
        if (cap) {
          captionText = cap.innerText || cap.textContent;
        }
      }
      if (!captionText && imgEl.alt) {
        captionText = imgEl.alt;
      }
      if (lightboxCaption) {
        lightboxCaption.textContent = captionText;
      }

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    // Attach click listeners to all screenshots in figures
    document.querySelectorAll('figure img, .zoomable').forEach(function (img) {
      img.addEventListener('click', function (e) {
        e.preventDefault();
        openLightbox(this);
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', function (e) {
        e.stopPropagation();
        closeLightbox();
      });
    }

    lightbox.addEventListener('click', function (e) {
      if (e.target !== lightboxImg && e.target !== lightboxCaption) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // --- 4. Sticky Rail IntersectionObserver ---
  try {
    var railLinks = [].slice.call(document.querySelectorAll('.rail a'));
    var sections = document.querySelectorAll('section[id]');
    if (railLinks.length > 0 && sections.length > 0 && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            railLinks.forEach(function (link) {
              link.classList.toggle('on', link.getAttribute('href') === '#' + entry.target.id);
            });
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });

      sections.forEach(function (sec) {
        observer.observe(sec);
      });
    }
  } catch (err) {
    // Graceful fallback
  }
});
