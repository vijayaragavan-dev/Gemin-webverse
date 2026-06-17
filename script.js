/* ============================================================
   EDUVERSE 2050 — AI-Powered Education
   Script — All interactive features
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     DOM REFERENCES
     ============================================================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const loadingScreen = $('#loading-screen');
  const navbar = $('#navbar');
  const navToggle = $('.nav-toggle');
  const navLinks = $('.nav-links');
  const heroSection = $('#hero');
  const particleCanvas = $('#particle-canvas');
  const posterTilt = $('#poster-tilt');
  const posterModal = $('#poster-modal');
  const modalOverlay = $('#modal-overlay');
  const modalClose = $('.modal-close');
  const audio = $('#audio-player');
  const playBtn = $('#play-btn');
  const playIcon = $('#play-icon');
  const pauseIcon = $('#pause-icon');
  const progressFill = $('#progress-fill');
  const progressThumb = $('#progress-thumb');
  const progressTrack = $('#progress-track');
  const currentTimeEl = $('#current-time');
  const durationEl = $('#duration');
  const loopBtn = $('#loop-btn');
  const muteBtn = $('#mute-btn');
  const volumeIcon = $('#volume-icon');
  const muteIcon = $('#mute-icon');
  const volumeFill = $('#volume-fill');
  const volumeThumb = $('#volume-thumb');
  const volumeTrack = $('#volume-track');
  const equalizer = $('#equalizer');
  const scrollTopBtn = $('#scroll-top');
  const classroomParallax = $('#classroom-parallax');

  /* ============================================================
     UTILITY FUNCTIONS
     ============================================================ */
  function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function debounce(fn, ms = 100) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  /* ============================================================
     1. LOADING SCREEN
     ============================================================ */
  function initLoadingScreen() {
    function hideLoading() {
      loadingScreen.classList.add('loaded');
      document.body.classList.remove('loading-active');
    }

    window.addEventListener('load', () => {
      setTimeout(hideLoading, 2000);
    });

    if (document.readyState === 'complete') {
      setTimeout(hideLoading, 2000);
    }
  }

  /* ============================================================
     2. PARTICLE SYSTEM
     ============================================================ */
  function initParticles() {
    if (!particleCanvas) return;

    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    let animId;
    let w, h;

    function resize() {
      w = heroSection.offsetWidth;
      h = heroSection.offsetHeight;
      particleCanvas.width = w;
      particleCanvas.height = h;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(Math.floor((w * h) / 12000), 80);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.vx += (dx / dist) * force * 0.02;
          p.vy += (dy / dist) * force * 0.02;
        }

        p.vx *= 0.99;
        p.vy *= 0.99;
      }

      animId = requestAnimationFrame(draw);
    }

    function onMouseMove(e) {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function onResize() {
      resize();
      createParticles();
    }

    resize();
    createParticles();
    draw();

    heroSection.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', debounce(onResize, 200));

    return () => {
      cancelAnimationFrame(animId);
      heroSection.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }

  /* ============================================================
     3. NAVIGATION
     ============================================================ */
  function initNavigation() {
    /* Scroll effect */
    function onScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile menu toggle */
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    /* Close menu on link click */
    $$('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    /* Active section highlighting */
    const sections = $$('section[id]');
    const observerOptions = {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $$('.nav-link').forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((s) => sectionObserver.observe(s));
  }

  /* ============================================================
     4. SCROLL REVEAL (Intersection Observer)
     ============================================================ */
  function initScrollReveal() {
    const els = $$('[data-reveal]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    els.forEach((el) => observer.observe(el));
  }

  /* ============================================================
     5. BUTTON RIPPLE EFFECT
     ============================================================ */
  function initRipple() {
    $$('.btn').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = ripple.style.height = '10px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /* ============================================================
     6. POSTER 3D TILT EFFECT
     ============================================================ */
  function initPosterTilt() {
    if (!posterTilt) return;

    posterTilt.addEventListener('mousemove', (e) => {
      const rect = posterTilt.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      posterTilt.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    posterTilt.addEventListener('mouseleave', () => {
      posterTilt.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  }

  /* ============================================================
     7. POSTER MODAL
     ============================================================ */
  function initPosterModal() {
    if (!posterTilt || !posterModal) return;

    function openModal() {
      posterModal.classList.add('open');
      posterModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      posterModal.classList.remove('open');
      posterModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    posterTilt.addEventListener('click', openModal);
    modalOverlay.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && posterModal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  /* ============================================================
     8. AUDIO PLAYER
     ============================================================ */
  function initAudioPlayer() {
    if (!audio) return;

    let isPlaying = false;
    let isLooping = false;
    let isMuted = false;

    /* Toggle play/pause */
    function togglePlay() {
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }

    function updatePlayState() {
      isPlaying = !audio.paused;
      playIcon.style.display = isPlaying ? 'none' : 'block';
      pauseIcon.style.display = isPlaying ? 'block' : 'none';
      playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
      equalizer.classList.toggle('playing', isPlaying);
    }

    /* Update progress */
    function updateProgress() {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${pct}%`;
      progressThumb.style.left = `${pct}%`;
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }

    /* Set duration display */
    function setDuration() {
      durationEl.textContent = formatTime(audio.duration);
    }

    /* Seek */
    function seek(e) {
      const rect = progressTrack.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = pct * audio.duration;
    }

    /* Volume */
    function setVolume(e) {
      const rect = volumeTrack.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.volume = pct;
      volumeFill.style.width = `${pct * 100}%`;
      volumeThumb.style.left = `${pct * 100}%`;
      if (audio.volume > 0 && isMuted) {
        isMuted = false;
        audio.muted = false;
        updateMuteState();
      }
    }

    function toggleMute() {
      isMuted = !isMuted;
      audio.muted = isMuted;
      updateMuteState();
    }

    function updateMuteState() {
      volumeIcon.style.display = isMuted ? 'none' : 'block';
      muteIcon.style.display = isMuted ? 'block' : 'none';
      muteBtn.setAttribute('aria-pressed', isMuted);
    }

    function toggleLoop() {
      isLooping = !isLooping;
      audio.loop = isLooping;
      loopBtn.classList.toggle('active', isLooping);
      loopBtn.setAttribute('aria-pressed', isLooping);
    }

    /* Events */
    playBtn.addEventListener('click', togglePlay);

    audio.addEventListener('play', updatePlayState);
    audio.addEventListener('pause', updatePlayState);
    audio.addEventListener('ended', () => {
      updatePlayState();
      if (!isLooping) {
        equalizer.classList.remove('playing');
      }
    });
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setDuration);
    audio.addEventListener('durationchange', setDuration);

    let isDraggingProgress = false;
    progressTrack.addEventListener('mousedown', (e) => {
      isDraggingProgress = true;
      seek(e);
    });
    document.addEventListener('mousemove', (e) => {
      if (isDraggingProgress) seek(e);
    });
    document.addEventListener('mouseup', () => {
      isDraggingProgress = false;
    });

    let isDraggingVolume = false;
    volumeTrack.addEventListener('mousedown', (e) => {
      isDraggingVolume = true;
      setVolume(e);
    });
    document.addEventListener('mousemove', (e) => {
      if (isDraggingVolume) setVolume(e);
    });
    document.addEventListener('mouseup', () => {
      isDraggingVolume = false;
    });

    muteBtn.addEventListener('click', toggleMute);
    loopBtn.addEventListener('click', toggleLoop);

    /* Touch support for progress */
    progressTrack.addEventListener('touchstart', (e) => {
      seek(e.touches[0]);
    });
    progressTrack.addEventListener('touchmove', (e) => {
      seek(e.touches[0]);
    });

    /* Touch support for volume */
    volumeTrack.addEventListener('touchstart', (e) => {
      setVolume(e.touches[0]);
    });
    volumeTrack.addEventListener('touchmove', (e) => {
      setVolume(e.touches[0]);
    });

    /* Keyboard accessibility */
    audio.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        togglePlay();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        const active = document.activeElement;
        const isBtn = active && (active.tagName === 'BUTTON' || active.tagName === 'A' || active.tagName === 'INPUT');
        if (!isBtn) {
          e.preventDefault();
          togglePlay();
        }
      }
    });

    /* Audio error handling */
    audio.addEventListener('error', () => {
      playBtn.style.opacity = '0.5';
      playBtn.style.cursor = 'not-allowed';
      playBtn.setAttribute('aria-label', 'Audio unavailable');
      const msg = document.createElement('p');
      msg.className = 'player-error';
      msg.textContent = 'Soundtrack file not found. Add assets/music/First_Light_of_day.mp3.mpeg';
      msg.style.cssText = 'color: #ef4444; font-size: 13px; margin-top: 12px;';
      $('.soundtrack-content').appendChild(msg);
    }, { once: true });

    /* Initial state */
    setDuration();
    updateMuteState();
  }

  /* ============================================================
     9. ANIMATED COUNTERS (Intersection Observer)
     ============================================================ */
  function initCounters() {
    const counters = $$('.stat-number');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            animateCounter(el, target, suffix);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach((c) => observer.observe(c));
  }

  function animateCounter(el, target, suffix) {
    const duration = 2000;
    const start = performance.now();
    /* Use internal multiplier for smooth 1B+ animation */
    const internalTarget = target === 1 ? 1000 : target;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * internalTarget);

      if (target === 1 && suffix === 'B+') {
        /* Animate as millions, then final display as 1B+ */
        el.textContent = progress < 1 ? current + 'M' : '1B+';
      } else {
        el.textContent = current + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        /* Ensure exact final value */
        if (target === 1 && suffix === 'B+') el.textContent = '1B+';
        else el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  /* ============================================================
     10. SCROLL TO TOP
     ============================================================ */
  function initScrollTop() {
    function checkScroll() {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     11. CLASSROOM PARALLAX
     ============================================================ */
  function initClassroomParallax() {
    if (!classroomParallax) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            classroomParallax.classList.add('parallax-active');
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(classroomParallax);

    window.addEventListener('scroll', () => {
      if (!classroomParallax.classList.contains('parallax-active')) return;
      const rect = classroomParallax.getBoundingClientRect();
      const speed = 0.05;
      const yPos = (rect.top - window.innerHeight) * speed;
      const img = classroomParallax.querySelector('.classroom-image');
      if (img) {
        img.style.transform = `translateY(${yPos}px) scale(1.05)`;
      }
    }, { passive: true });
  }

  /* ============================================================
     12. MOUSE PARALLAX FOR HERO
     ============================================================ */
  function initHeroParallax() {
    const heroContent = $('.hero-content');

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      heroContent.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroContent.style.transform = 'translate(0, 0)';
    });
  }

  /* ============================================================
     13. EQUALIZER BARS INIT
     ============================================================ */
  function initEqualizer() {
    const bars = $$('.eq-bar');
    bars.forEach((bar) => {
      const height = Math.random() * 36 + 12;
      bar.style.height = `${height}px`;
    });
  }

  /* ============================================================
     14. FEATURE CARDS TILT
     ============================================================ */
  function initFeatureCards() {
    const cards = $$('.feature-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============================================================
     15. SET INITIAL BODY OVERFLOW
     ============================================================ */
  document.body.classList.add('loading-active');

  /* ============================================================
     INIT ALL
     ============================================================ */
  function init() {
    initLoadingScreen();
    initParticles();
    initNavigation();
    initScrollReveal();
    initRipple();
    initPosterTilt();
    initPosterModal();
    initAudioPlayer();
    initCounters();
    initScrollTop();
    initClassroomParallax();
    initHeroParallax();
    initEqualizer();
    initFeatureCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
