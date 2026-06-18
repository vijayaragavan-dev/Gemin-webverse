(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  const loadingScreen = $('#loading-screen');
  const navbar = $('#navbar');
  const navToggle = $('.nav-toggle');
  const heroSection = $('#hero');
  const particleCanvas = $('#particle-canvas');
  const posterTilt = $('#poster-tilt');
  const posterModal = $('#poster-modal');
  const modalOverlay = $('#modal-overlay');
  const modalClose = $('.modal-close');
  const modalContent = $('.modal-content');
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
  const volumeControl = $('.volume-control');
  const equalizer = $('#equalizer');
  const scrollTopBtn = $('#scroll-top');
  const classroomParallax = $('#classroom-parallax');
  const classroomFrame = $('.classroom-frame');
  const scrollProgress = $('#scroll-progress');
  const testimonialTrack = $('#testimonial-track');
  const testimonialDots = $('#testimonial-dots');
  const prevBtn = $('.prev-btn');
  const nextBtn = $('.next-btn');
  const cursorGlow = $('#cursor-glow');
  const heroContent = $('.hero-content');

  let audioErrorShown = false;

  function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function debounce(fn, ms) {
    ms = ms || 100;
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, arguments), ms);
    };
  }

  function throttle(fn, ms) {
    ms = ms || 100;
    let last = 0;
    return function () {
      const now = Date.now();
      if (now - last >= ms) {
        last = now;
        fn.apply(this, arguments);
      }
    };
  }

  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  function addTouchTilt(element, intensity) {
    if (!element) return;
    intensity = intensity || 4;

    element.addEventListener('touchstart', function (e) {
      const touch = e.touches[0];
      const rect = element.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -intensity;
      const rotateY = ((x - centerX) / centerX) * intensity;
      element.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
    }, { passive: true });

    element.addEventListener('touchend', function () {
      element.style.transform = '';
    }, { passive: true });
  }

  function trapFocus(element, firstFocusable, lastFocusable) {
    element.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      const first = firstFocusable || element.querySelector('[tabindex]:not([tabindex="-1"]), button, a, input');
      const last = lastFocusable || first;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* LOADING SCREEN */
  function initLoadingScreen() {
    let loaded = false;
    function hideLoading() {
      if (loaded) return;
      loaded = true;
      loadingScreen.classList.add('loaded');
      document.body.classList.remove('loading-active');
    }
    window.addEventListener('load', hideLoading);
    setTimeout(hideLoading, 3000);
    if (document.readyState === 'complete') hideLoading();
  }

  /* SCROLL PROGRESS */
  function initScrollProgress() {
    let ticking = false;
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = progress + '%';
      scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    updateProgress();
  }

  /* PARTICLES */
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

  /* NAVIGATION */
  function initNavigation() {
    const mobileMenu = $('.mobile-menu');
    const mobileLinks = $$('.mobile-link');
    const airaChat = document.getElementById('aira-chat');

    function onScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function openMenu() {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      navToggle.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (airaChat) airaChat.classList.add('aira-hidden');
      setTimeout(() => {
        const firstLink = mobileLinks[0];
        if (firstLink) firstLink.focus();
      }, 100);
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (airaChat) airaChat.classList.remove('aira-hidden');
    }

    navToggle.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        closeMenu();
        navToggle.focus();
      } else {
        openMenu();
      }
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        closeMenu();
        setTimeout(() => {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 350);
        navToggle.focus();
      });
    });

    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        closeMenu();
        navToggle.focus();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
        navToggle.focus();
      }
    });

    trapFocus(mobileMenu, mobileLinks[0], mobileLinks[mobileLinks.length - 1]);

    const sections = $$('section[id]');
    const observerOptions = {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          $$('.nav-link, .mobile-link').forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((s) => sectionObserver.observe(s));
  }

  /* SCROLL REVEAL */
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

  /* RIPPLE */
  function initRipple() {
    $$('.btn').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = ripple.style.height = '10px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /* POSTER TILT */
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

      posterTilt.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
    });

    posterTilt.addEventListener('mouseleave', () => {
      posterTilt.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });

    if (isTouchDevice()) {
      addTouchTilt(posterTilt, 8);
    }
  }

  /* POSTER MODAL */
  function initPosterModal() {
    if (!posterTilt || !posterModal) return;

    function openModal() {
      posterModal.classList.add('open');
      posterModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (modalClose) modalClose.focus();
    }

    function closeModal() {
      posterModal.classList.remove('open');
      posterModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      posterTilt.focus();
    }

    posterTilt.addEventListener('click', openModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', function handlePosterEsc(e) {
      if (e.key === 'Escape' && posterModal.classList.contains('open')) {
        closeModal();
      }
    });

    const modalImg = $('#modal-image');
    trapFocus(posterModal, modalClose, modalImg || modalClose);
  }

  /* HERO PARALLAX */
  function initHeroParallax() {
    if (!heroContent) return;

    heroSection.addEventListener('mousemove', function (e) {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroContent.style.transform = 'translate(' + (x * 15) + 'px, ' + (y * 15) + 'px)';
    });

    heroSection.addEventListener('mouseleave', function () {
      heroContent.style.transform = 'translate(0, 0)';
    });
  }

  /* ---- AUDIO PLAYER ---- */
  function initAudioPlayer() {
    if (!audio) return;

    let isPlaying = false;
    let isLooping = false;
    let isMuted = false;
    let userInteracted = false;
    let dragStartHandler, dragMoveHandler, dragEndHandler;

    function togglePlay() {
      userInteracted = true;
      if (audio.paused) {
        audio.play().catch(function () {
          if (!audioErrorShown) showAudioError();
        });
      } else {
        audio.pause();
      }
    }

    function updatePlayState() {
      isPlaying = !audio.paused;
      if (playIcon) playIcon.style.display = isPlaying ? 'none' : 'block';
      if (pauseIcon) pauseIcon.style.display = isPlaying ? 'block' : 'none';
      if (playBtn) playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
      if (equalizer) equalizer.classList.toggle('playing', isPlaying);
    }

    function updateProgress() {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      if (progressFill) progressFill.style.width = pct + '%';
      if (progressThumb) progressThumb.style.left = pct + '%';
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    }

    function setDuration() {
      if (durationEl) durationEl.textContent = formatTime(audio.duration);
    }

    function seek(e) {
      if (!progressTrack) return;
      const rect = progressTrack.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      if (clientX === undefined) return;
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      if (isFinite(audio.duration)) {
        audio.currentTime = pct * audio.duration;
      }
    }

    function setVolume(e) {
      if (!volumeTrack) return;
      const rect = volumeTrack.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      if (clientX === undefined) return;
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      audio.volume = pct;
      if (volumeFill) volumeFill.style.width = (pct * 100) + '%';
      if (volumeThumb) volumeThumb.style.left = (pct * 100) + '%';
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
      if (volumeIcon) volumeIcon.style.display = isMuted ? 'none' : 'block';
      if (muteIcon) muteIcon.style.display = isMuted ? 'block' : 'none';
      if (muteBtn) muteBtn.setAttribute('aria-pressed', isMuted);
    }

    function toggleLoop() {
      isLooping = !isLooping;
      audio.loop = isLooping;
      if (loopBtn) {
        loopBtn.classList.toggle('active', isLooping);
        loopBtn.setAttribute('aria-pressed', isLooping);
      }
    }

    function showAudioError() {
      audioErrorShown = true;
      if (playBtn) {
        playBtn.style.opacity = '0.5';
        playBtn.style.cursor = 'not-allowed';
        playBtn.setAttribute('aria-label', 'Audio unavailable');
      }
      const container = $('.soundtrack-content');
      if (container) {
        const msg = document.createElement('p');
        msg.className = 'player-error';
        msg.textContent = 'Soundtrack file not found. Ensure assets/music/First_Light_of_day.mp3 is present.';
        container.appendChild(msg);
      }
    }

    if (playBtn) playBtn.addEventListener('click', togglePlay);

    audio.addEventListener('play', updatePlayState);
    audio.addEventListener('pause', updatePlayState);
    audio.addEventListener('ended', function () {
      updatePlayState();
      if (!isLooping && equalizer) {
        equalizer.classList.remove('playing');
      }
    });
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setDuration);
    audio.addEventListener('durationchange', setDuration);
    audio.addEventListener('error', function () {
      if (!audioErrorShown) showAudioError();
    }, { once: true });

    audio.addEventListener('loadedmetadata', function () {
      console.log('[Audio] Metadata loaded. Duration:', audio.duration);
    });
    audio.addEventListener('canplay', function () {
      console.log('[Audio] Can play. ReadyState:', audio.readyState, '| NetworkState:', audio.networkState);
    });
    audio.addEventListener('loadstart', function () {
      console.log('[Audio] Loading started. Src:', audio.src);
    });
    audio.addEventListener('waiting', function () {
      console.log('[Audio] Waiting for data...');
    });
    audio.addEventListener('playing', function () {
      console.log('[Audio] Playing.');
    });
    audio.addEventListener('progress', function () {
      if (audio.buffered.length > 0) {
        console.log('[Audio] Buffered:', audio.buffered.end(0), '/', audio.duration);
      }
    });

    progressTrack.addEventListener('mousedown', function (e) {
      seek(e);
      dragStartHandler = function (ev) { seek(ev); };
      dragEndHandler = function () {
        document.removeEventListener('mousemove', dragStartHandler);
        document.removeEventListener('mouseup', dragEndHandler);
      };
      document.addEventListener('mousemove', dragStartHandler);
      document.addEventListener('mouseup', dragEndHandler);
    });

    progressTrack.addEventListener('touchstart', function (e) {
      e.preventDefault();
      seek(e);
      dragStartHandler = function (ev) { seek(ev); };
      dragEndHandler = function () {
        document.removeEventListener('touchmove', dragStartHandler);
        document.removeEventListener('touchend', dragEndHandler);
      };
      document.addEventListener('touchmove', dragStartHandler, { passive: true });
      document.addEventListener('touchend', dragEndHandler);
    }, { passive: false });

    volumeTrack.addEventListener('mousedown', function (e) {
      setVolume(e);
      dragStartHandler = function (ev) { setVolume(ev); };
      dragEndHandler = function () {
        document.removeEventListener('mousemove', dragStartHandler);
        document.removeEventListener('mouseup', dragEndHandler);
      };
      document.addEventListener('mousemove', dragStartHandler);
      document.addEventListener('mouseup', dragEndHandler);
    });

    volumeTrack.addEventListener('touchstart', function (e) {
      e.preventDefault();
      setVolume(e);
      dragStartHandler = function (ev) { setVolume(ev); };
      dragEndHandler = function () {
        document.removeEventListener('touchmove', dragStartHandler);
        document.removeEventListener('touchend', dragEndHandler);
      };
      document.addEventListener('touchmove', dragStartHandler, { passive: true });
      document.addEventListener('touchend', dragEndHandler);
    }, { passive: false });

    if (muteBtn) muteBtn.addEventListener('click', toggleMute);
    if (loopBtn) loopBtn.addEventListener('click', toggleLoop);

    if (volumeControl && isTouchDevice()) {
      volumeControl.addEventListener('click', function () {
        this.classList.toggle('active');
      });
    }

    setDuration();
    updateMuteState();
  }

  /* COUNTERS */
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
    const internalTarget = target === 1 ? 1000 : target;
    const is10X = target === 10 && suffix === 'X';

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * internalTarget);

      if (target === 1 && suffix === 'B+') {
        el.textContent = progress < 1 ? current + 'M' : '1B+';
      } else if (is10X) {
        const displayVal = Math.round(eased * 10);
        el.textContent = displayVal + 'X';
        if (progress >= 1) el.textContent = '10X';
      } else {
        el.textContent = current + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (target === 1 && suffix === 'B+') el.textContent = '1B+';
        else if (is10X) el.textContent = '10X';
        else el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  /* SCROLL TO TOP */
  function initScrollTop() {
    function checkScroll() {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* CLASSROOM PARALLAX */
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

    const scrollHandler = function () {
      if (!classroomParallax.classList.contains('parallax-active')) return;
      const rect = classroomParallax.getBoundingClientRect();
      const speed = 0.05;
      const yPos = (rect.top - window.innerHeight) * speed;
      const img = classroomParallax.querySelector('.classroom-image');
      if (img) {
        img.style.transform = 'translateY(' + yPos + 'px) scale(1.05)';
      }
    };

    window.addEventListener('scroll', throttle(scrollHandler, 16), { passive: true });

    if (classroomFrame && isTouchDevice()) {
      classroomFrame.addEventListener('click', function () {
        this.classList.toggle('touch-overlay');
      });
    }
  }

  /* EQUALIZER */
  function initEqualizer() {
    const bars = $$('.eq-bar');
    bars.forEach(function (bar) {
      bar.style.height = (Math.random() * 36 + 12) + 'px';
    });
  }

  /* FEATURE CARDS TILT */
  function initFeatureCards() {
    const cards = $$('.feature-card');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });

      if (isTouchDevice()) {
        addTouchTilt(card, 4);
      }
    });
  }

  /* TESTIMONIAL SLIDER */
  function initTestimonials() {
    if (!testimonialTrack) return;

    const slides = $$('.testimonial-card', testimonialTrack);
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoPlayInterval;
    const autoPlayDelay = 5000;

    function createDots() {
      if (!testimonialDots) return;
      testimonialDots.innerHTML = '';
      slides.forEach(function (_, i) {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        dot.addEventListener('click', function () {
          goToSlide(i);
          resetAutoPlay();
        });
        testimonialDots.appendChild(dot);
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      const offset = -currentIndex * 100;
      testimonialTrack.style.transform = 'translateX(' + offset + '%)';

      const dots = $$('.testimonial-dot');
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      goToSlide(currentIndex);
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      goToSlide(currentIndex);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }

    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
      startAutoPlay();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); resetAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); resetAutoPlay(); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { prevSlide(); resetAutoPlay(); }
      if (e.key === 'ArrowRight') { nextSlide(); resetAutoPlay(); }
    });

    const slider = $('.testimonial-slider');
    if (slider) {
      slider.addEventListener('mouseenter', stopAutoPlay);
      slider.addEventListener('mouseleave', startAutoPlay);
      slider.addEventListener('touchstart', stopAutoPlay, { passive: true });
      slider.addEventListener('touchend', startAutoPlay, { passive: true });
    }

    createDots();
    startAutoPlay();
  }

  /* DAY TIMELINE INTERACTION */
  function initDayTimeline() {
    const entries = $$('.day-entry');
    entries.forEach(function (entry) {
      entry.addEventListener('mouseenter', function () {
        const dot = entry.querySelector('.day-dot');
        if (dot) {
          dot.style.transform = 'scale(1.5)';
          dot.style.boxShadow = '0 0 40px rgba(0, 229, 255, 0.6)';
        }
      });
      entry.addEventListener('mouseleave', function () {
        const dot = entry.querySelector('.day-dot');
        if (dot) {
          dot.style.transform = '';
          dot.style.boxShadow = '';
        }
      });
    });
  }

  /* SECTION TRANSITION OBSERVER */
  function initSectionTransitions() {
    const sections = $$('.section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-transition', 'revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* TYPEWRITER */
  function initTypewriter() {
    const el = $('.tagline-text');
    if (!el) return;
    const text = el.textContent;
    el.textContent = '';
    let i = 0;
    const speed = 50;
    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(type, 400);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el.closest('.hero-tagline') || el);
  }

  /* CURSOR GLOW */
  function initCursorGlow() {
    if (!cursorGlow) return;
    if (isTouchDevice()) {
      cursorGlow.style.display = 'none';
      return;
    }
    document.addEventListener('mousemove', function (e) {
      cursorGlow.style.transform = 'translate(' + (e.clientX) + 'px, ' + (e.clientY) + 'px)';
    }, { passive: true });
  }

  /* TEAM CARD TILT */
  function initTeamTilt() {
    const cards = $$('.team-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
      if (isTouchDevice()) {
        addTouchTilt(card, 4);
      }
    });
  }

  /* ---- AIRA CHAT ---- */
  const airaResponses = {
    'what-is-eduverse': {
      title: 'What is EduVerse 2050?',
      text: '<strong>EduVerse 2050</strong> is a visionary educational ecosystem where artificial intelligence has eliminated every barrier to learning. It is a world where every student \u2014 regardless of location, language, or background \u2014 has access to a personalized AI mentor that adapts to their unique learning style, pace, and goals.<br><br>Powered by <strong>Google\'s Gemini AI</strong>, EduVerse 2050 transcends traditional classrooms through holographic interfaces, immersive virtual reality, real-time language translation, and adaptive curricula that evolve with each learner.<br><br>This is not just an evolution of education \u2014 it is a revolution. <strong>Education Without Boundaries.</strong>',
      related: ['who-is-aira', 'why-gemini', 'future-classrooms']
    },
    'who-is-aira': {
      title: 'Who is AIRA?',
      text: '<strong>AIRA</strong> (Artificial Intelligence Responsive Academic Assistant) is an intelligent AI mentor designed to guide every learner through a personalized educational journey.<br><br>Available <strong>24/7</strong>, AIRA adapts to each student\'s learning style, preferred language, academic strengths, and personal goals. She identifies areas needing reinforcement and creates customized learning paths in real-time.<br><br>AIRA is more than a tutor \u2014 she is a companion, a guide, and a gateway to unlimited knowledge. She represents the <strong>heart of the EduVerse 2050</strong> vision.',
      related: ['why-gemini', 'personalized-learning', 'day-in-life']
    },
    'why-gemini': {
      title: 'Why Gemini AI?',
      text: '<strong>Gemini</strong> provides the core intelligence behind EduVerse 2050. Developed by Google, Gemini is a state-of-the-art multimodal AI capable of understanding text, images, audio, video, and code simultaneously.<br><br>In EduVerse 2050, Gemini powers AIRA\'s ability to:<br>\u2022 Understand complex student queries across subjects<br>\u2022 Generate personalized lesson plans in real-time<br>\u2022 Provide step-by-step reasoning for problem-solving<br>\u2022 Teach in <strong>100+ languages</strong> with cultural context<br><br>Gemini makes <strong>truly adaptive education</strong> possible at a global scale.',
      related: ['what-is-eduverse', 'impact', 'vision-2050']
    },
    'future-classrooms': {
      title: 'Future Classrooms',
      text: '<strong>Classrooms of 2050</strong> bear little resemblance to today\'s schools. They are immersive, adaptive, and borderless.<br><br>Key features include:<br>\u2022 <strong>Holographic interfaces</strong> that bring complex concepts to life in 3D<br>\u2022 <strong>Virtual reality environments</strong> where students explore historical events, scientific phenomena, and distant cultures<br>\u2022 <strong>AI teaching assistants</strong> that provide instant, personalized support<br>\u2022 <strong>Real-time collaboration</strong> with students from every continent<br>\u2022 <strong>Biometric engagement tracking</strong> that adjusts lesson difficulty automatically<br><br>Learning is no longer confined to four walls \u2014 it happens <strong>everywhere</strong>.',
      related: ['personalized-learning', 'day-in-life', 'global-network']
    },
    'personalized-learning': {
      title: 'Personalized Learning',
      text: '<strong>Personalized learning</strong> is the cornerstone of EduVerse 2050. Every student receives a unique educational experience designed specifically for them.<br><br>AIRA analyzes thousands of data points per student:<br>\u2022 Learning pace and retention patterns<br>\u2022 Preferred content formats (visual, auditory, kinesthetic)<br>\u2022 Knowledge gaps and strengths<br>\u2022 Emotional engagement and focus levels<br><br>The curriculum <strong>adapts in real-time</strong>, ensuring no student is left behind and no student is held back. This is education that truly <strong>fits the individual</strong>, not the other way around.',
      related: ['who-is-aira', 'what-is-eduverse', 'impact']
    },
    'global-network': {
      title: 'Global Education Network',
      text: 'The <strong>EduVerse Global Network</strong> connects students from over <strong>190 countries</strong>, creating a truly borderless educational community.<br><br>Features of the network:<br>\u2022 Real-time translation breaks down <strong>every language barrier</strong><br>\u2022 Cultural exchange programs embedded in daily lessons<br>\u2022 Collaborative projects with peers worldwide<br>\u2022 Shared virtual campuses open 24/7<br>\u2022 Access to world-class educators regardless of geography<br><br>A student in rural India can learn alongside a peer in Tokyo, Berlin, or Nairobi \u2014 all guided by the same <strong>AIRA mentor</strong>. Geography is no longer destiny.',
      related: ['impact', 'what-is-eduverse', 'future-classrooms']
    },
    'day-in-life': {
      title: 'Day in the Life of a Student',
      text: 'A typical day for a student in <strong>EduVerse 2050</strong>:<br><br><strong>7:00 AM</strong> \u2014 AIRA reviews yesterday\'s progress and prepares a personalized schedule<br><strong>9:00 AM</strong> \u2014 Immersive VR classroom: exploring marine biology as a holographic ocean<br><strong>11:00 AM</strong> \u2014 AIRA detects a weak concept and adjusts the lesson in real-time<br><strong>2:00 PM</strong> \u2014 Global collaborative project with students from 4 continents<br><strong>5:00 PM</strong> \u2014 Hands-on AI-powered simulation to practice new skills<br><strong>8:00 PM</strong> \u2014 AIRA generates a personalized revision plan for long-term retention<br><br>Every moment is <strong>optimized for maximum learning</strong> while keeping the student engaged and inspired.',
      related: ['future-classrooms', 'personalized-learning', 'global-network']
    },
    'team-innoverse': {
      title: 'Team InnoVerse',
      text: '<strong>Team InnoVerse</strong> is the group of visionary creators behind EduVerse 2050. United by a shared passion for using AI to transform education, the team brings together expertise in full-stack development, UI/UX design, and prompt engineering.<br><br><strong>Vijayaragavan U</strong> \u2014 Full Stack Developer<br><strong>Pravin Kumar M</strong> \u2014 UI/UX Designer<br><strong>Saarukesh M</strong> \u2014 Prompt Engineer<br><br>Together, they have built this vision of the future \u2014 a world where <strong>every learner has an AI mentor</strong> and education knows no boundaries.',
      related: ['what-is-eduverse', 'vision-2050', 'why-gemini']
    },
    'impact': {
      title: 'Impact on Education',
      text: 'EduVerse 2050\'s impact on global education is <strong>transformative</strong>:<br><br>\u2022 <strong>1 Billion+</strong> students connected to AI mentors<br>\u2022 <strong>150+ languages</strong> supported for inclusive learning<br>\u2022 <strong>10x faster</strong> concept understanding through adaptive techniques<br>\u2022 <strong>100% personalized</strong> curricula for every learner<br>\u2022 <strong>24/7 access</strong> to quality education regardless of location<br><br>The traditional one-size-fits-all model is replaced by an ecosystem where <strong>every student thrives</strong>. Dropout rates approach zero, and global literacy reaches unprecedented levels.<br><br>This is the <strong>future of education</strong> \u2014 and it is already here.',
      related: ['what-is-eduverse', 'global-network', 'vision-2050']
    },
    'vision-2050': {
      title: 'Vision for 2050',
      text: 'By <strong>2050</strong>, EduVerse envisions a world where:<br><br>\u2022 <strong>Every human</strong> on Earth has access to a personalized AI mentor<br>\u2022 Language, location, and economic status are <strong>no longer barriers</strong> to education<br>\u2022 Learning is <strong>continuous, lifelong, and self-directed</strong><br>\u2022 Classrooms exist as <strong>virtual and augmented spaces</strong> that blend seamlessly with the real world<br>\u2022 AI and human teachers <strong>co-create</strong> the most effective learning experiences<br>\u2022 Education is recognized as a <strong>fundamental human right</strong>, fully realized<br><br>This is not science fiction. This is the road we are building. <strong>Education Without Boundaries.</strong>',
      related: ['what-is-eduverse', 'impact', 'why-gemini']
    }
  };

  const airaOffTopic = 'I am <strong>AIRA</strong>, an educational AI mentor focused on <strong>EduVerse 2050</strong>.<br><br>Please ask questions related to:<br>\u2022 EduVerse 2050<br>\u2022 AIRA<br>\u2022 Gemini AI<br>\u2022 Future Education<br>\u2022 Personalized Learning<br>\u2022 Future Classrooms<br><br>You can also select one of the suggested topics above.';

  const airaAllowedKeywords = [
    'eduverse', 'aira', 'gemini', 'education', 'learn', 'learning', 'classroom',
    'student', 'teacher', 'future', 'mentor', 'personalized', 'global',
    'innovation', '2050', 'curriculum', 'immersive', 'virtual', 'holographic',
    'adaptive', 'inclusive', 'boundaries', 'vision', 'innoverse', 'team',
    'impact', 'network', 'simulation', 'multilingual', 'language', 'access',
    'ai', 'intelligence', 'knowledge', 'path', 'guide', 'assistant', 'academic'
  ];

  const airaQuickTopics = [
    { id: 'what-is-eduverse', label: 'What is EduVerse 2050?' },
    { id: 'who-is-aira', label: 'Who is AIRA?' },
    { id: 'why-gemini', label: 'Why Gemini AI?' },
    { id: 'future-classrooms', label: 'Future Classrooms' },
    { id: 'personalized-learning', label: 'Personalized Learning' },
    { id: 'global-network', label: 'Global Education Network' },
    { id: 'day-in-life', label: 'Day in the Life' },
    { id: 'team-innoverse', label: 'Team InnoVerse' },
    { id: 'impact', label: 'Impact on Education' },
    { id: 'vision-2050', label: 'Vision for 2050' }
  ];

  function initAiraChat() {
    const chat = $('#aira-chat');
    const toggleBtn = $('#aira-chat-toggle');
    const closeBtn = $('#aira-chat-close');
    const messagesEl = $('#aira-chat-messages');
    const inputEl = $('#aira-chat-input');
    const sendBtn = $('#aira-chat-send');
    if (!chat) return;

    let isOpen = false;
    let isProcessing = false;
    let hasOpened = false;

    function openChat() {
      isOpen = true;
      hasOpened = true;
      chat.classList.add('open');
      chat.setAttribute('aria-hidden', 'false');
      toggleBtn.setAttribute('aria-expanded', 'true');
      setTimeout(function () { if (inputEl) inputEl.focus(); }, 400);
      if (messagesEl && messagesEl.children.length === 0) {
        showGreeting();
      }
    }

    function closeChat() {
      isOpen = false;
      chat.classList.remove('open');
      chat.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
      setTimeout(function () { if (toggleBtn) toggleBtn.focus(); }, 100);
    }

    function scrollToBottom() {
      if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addMessage(type, content) {
      const div = document.createElement('div');
      div.className = 'aira-message ' + type;
      div.innerHTML = content;
      if (messagesEl) {
        messagesEl.appendChild(div);
        scrollToBottom();
      }
      return div;
    }

    function showTyping() {
      const div = document.createElement('div');
      div.className = 'aira-typing';
      div.id = 'aira-typing-indicator';
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = 'aira-typing-dot';
        div.appendChild(dot);
      }
      if (messagesEl) {
        messagesEl.appendChild(div);
        scrollToBottom();
      }
    }

    function hideTyping() {
      const el = document.getElementById('aira-typing-indicator');
      if (el) el.remove();
    }

    function showQuickActions() {
      const container = document.createElement('div');
      container.className = 'aira-quick-actions';
      container.id = 'aira-quick-actions';

      for (let i = 0; i < airaQuickTopics.length; i++) {
        const topic = airaQuickTopics[i];
        const btn = document.createElement('button');
        btn.className = 'aira-quick-btn';
        btn.textContent = topic.label;
        btn.setAttribute('data-topic', topic.id);
        btn.addEventListener('click', function () {
          handleQuickAction(topic.id);
        });
        container.appendChild(btn);
      }

      if (messagesEl) {
        messagesEl.appendChild(container);
        scrollToBottom();
      }
    }

    function removeQuickActions() {
      const el = document.getElementById('aira-quick-actions');
      if (el) el.remove();
    }

    function showSuggestedTopics(topicIds) {
      if (!topicIds || topicIds.length === 0) return;
      const container = document.createElement('div');
      container.className = 'aira-suggested';

      const label = document.createElement('span');
      label.className = 'aira-suggested-label';
      label.textContent = 'Suggested Topics:';
      container.appendChild(label);

      for (let i = 0; i < topicIds.length; i++) {
        const id = topicIds[i];
        let topic = null;
        for (let j = 0; j < airaQuickTopics.length; j++) {
          if (airaQuickTopics[j].id === id) { topic = airaQuickTopics[j]; break; }
        }
        if (!topic) continue;
        const btn = document.createElement('button');
        btn.className = 'aira-suggested-btn';
        btn.textContent = topic.label;
        btn.addEventListener('click', function () {
          handleQuickAction(id);
        });
        container.appendChild(btn);
      }

      if (messagesEl) {
        messagesEl.appendChild(container);
        scrollToBottom();
      }
    }

    function handleQuickAction(topicId) {
      if (isProcessing) return;
      const response = airaResponses[topicId];
      if (!response) return;

      removeQuickActions();
      addMessage('user', response.title);

      isProcessing = true;
      setInputState(true);
      showTyping();

      setTimeout(function () {
        hideTyping();
        addMessage('aira', response.text);
        showSuggestedTopics(response.related);
        isProcessing = false;
        setInputState(false);
      }, 1200);
    }

    function handleTextInput(text) {
      if (!text.trim()) return;
      if (isProcessing) return;

      if (inputEl) inputEl.value = '';
      removeQuickActions();
      addMessage('user', text);

      isProcessing = true;
      setInputState(true);
      showTyping();

      const isRelevant = isQuestionRelevant(text);
      const matchedTopic = findMatchingTopic(text);

      setTimeout(function () {
        hideTyping();
        if (matchedTopic) {
          const response = airaResponses[matchedTopic];
          addMessage('aira', response.text);
          showSuggestedTopics(response.related);
        } else if (isRelevant) {
          addMessage('aira', 'That is a great question about the future of education.<br><br><strong>EduVerse 2050</strong> envisions a world where AI mentors guide every learner, breaking down barriers of language, location, and background. Every student receives a <strong>personalized, adaptive education</strong> powered by <strong>Gemini AI</strong>.<br><br>Would you like to explore one of these topics?');
          showSuggestedTopics(['what-is-eduverse', 'personalized-learning', 'future-classrooms']);
        } else {
          addMessage('aira', airaOffTopic);
          showSuggestedTopics(['what-is-eduverse', 'who-is-aira', 'why-gemini']);
        }
        isProcessing = false;
        setInputState(false);
      }, 1200);
    }

    function isQuestionRelevant(text) {
      const lower = text.toLowerCase();
      for (let i = 0; i < airaAllowedKeywords.length; i++) {
        if (lower.indexOf(airaAllowedKeywords[i]) !== -1) return true;
      }
      return false;
    }

    function findMatchingTopic(text) {
      const lower = text.toLowerCase();
      let bestMatch = null;
      let bestScore = 0;

      for (const key in airaResponses) {
        if (airaResponses.hasOwnProperty(key)) {
          const title = airaResponses[key].title.toLowerCase();
          let score = 0;
          const words = title.replace(/[2050?]/g, '').split(' ');
          for (let i = 0; i < words.length; i++) {
            const w = words[i].toLowerCase().trim();
            if (w.length > 2 && lower.indexOf(w) !== -1) {
              score++;
            }
          }
          if (score > bestScore) {
            bestScore = score;
            bestMatch = key;
          }
        }
      }

      return bestScore >= 2 ? bestMatch : null;
    }

    function setInputState(disabled) {
      if (inputEl) inputEl.disabled = disabled;
      if (sendBtn) sendBtn.disabled = disabled;
    }

    function showGreeting() {
      addMessage('greeting', 'Hello, I am <strong>AIRA</strong>.<br><br>I can help you explore <strong>EduVerse 2050</strong>.<br><br>Choose one of the topics below or ask me anything about the future of education.');
      showQuickActions();
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        if (isOpen) {
          closeChat();
        } else {
          openChat();
        }
      });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeChat);

    if (sendBtn) {
      sendBtn.addEventListener('click', function () {
        if (inputEl) handleTextInput(inputEl.value);
      });
    }

    if (inputEl) {
      inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleTextInput(inputEl.value);
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    });

    trapFocus(chat, inputEl, closeBtn);

    setTimeout(function () {
      if (!hasOpened) openChat();
    }, 4000);
  }

  /* INIT */
  document.body.classList.add('loading-active');

  function init() {
    initLoadingScreen();
    initScrollProgress();
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
    initTestimonials();
    initDayTimeline();
    initSectionTransitions();
    initTypewriter();
    initCursorGlow();
    initTeamTilt();
    initAiraChat();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
