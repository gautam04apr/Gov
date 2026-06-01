/* ═══════════════════════════════════════════════
   GOVERNMENT OF ODISHA — SCRIPT.JS
═══════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   PARTIAL LOADER
   Fetches header.html / footer.html and injects
   them into #site-header / #site-footer.
   After injection, initHeader() is called so all
   header interactions bind to the freshly-added DOM.
═══════════════════════════════════════════════ */
async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load " + url);
    el.innerHTML = await res.text();

    // ✅ Always init header AFTER HTML exists in the DOM
    if (selector === "#site-header") {
      initHeader();
      setActiveNavLink();
    }
  } catch (err) {
    console.error(err);
  }
}

/* ═══════════════════════════════════════════════
   SET ACTIVE NAV LINK
   Matches current page filename to nav href.
═══════════════════════════════════════════════ */
function setActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav-item-link");
  const currentPath = window.location.pathname;
  // Get just the filename e.g. "registration.html"
  const currentFile = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    let isActive = false;
    if (href === "index.html") {
      isActive = currentFile === "index.html" || currentFile === "";
    } else {
      isActive = currentFile === href;
    }
    link.classList.toggle("active", isActive);
  });
}

/* ═══════════════════════════════════════════════
   INIT HEADER
   Binds all header-specific interactions:
   font size, language switcher, search, nav clicks.
   Called AFTER header HTML is in the DOM —
   either via loadPartial() or directly on pages
   that have the header hard-coded.
═══════════════════════════════════════════════ */
function initHeader() {

  /* ─────────────────────────────────────────
     1. FONT SIZE ACCESSIBILITY
  ───────────────────────────────────────── */
  const BASE_SIZE = 16;
  const MIN_SIZE  = 13;
  const MAX_SIZE  = 20;
  const STEP      = 1;
  let currentSize = BASE_SIZE;
  const htmlEl    = document.documentElement;

  function applyFontSize(size) {
    currentSize = Math.min(MAX_SIZE, Math.max(MIN_SIZE, size));
    htmlEl.style.fontSize = currentSize + "px";
  }

  document.getElementById("btn-increase")?.addEventListener("click", function () {
    applyFontSize(currentSize + STEP);
  });
  document.getElementById("btn-decrease")?.addEventListener("click", function () {
    applyFontSize(currentSize - STEP);
  });
  document.getElementById("btn-reset")?.addEventListener("click", function () {
    applyFontSize(BASE_SIZE);
  });

  /* ─────────────────────────────────────────
     2. LANGUAGE SWITCHER
  ───────────────────────────────────────── */
  const langOptions    = document.querySelectorAll(".lang-option");
  const selectedLangEl = document.getElementById("selected-lang");

  langOptions.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      const chosen = this.getAttribute("data-lang");
      if (selectedLangEl) selectedLangEl.textContent = chosen;

      langOptions.forEach(function (opt) { opt.classList.remove("active"); });
      this.classList.add("active");

      // Close Bootstrap dropdown
      const ddEl   = document.getElementById("langDropdown");
      const ddInst = ddEl ? bootstrap.Dropdown.getInstance(ddEl) : null;
      if (ddInst) ddInst.hide();
    });
  });

  /* ─────────────────────────────────────────
     3. SEARCH — EXPAND / COLLAPSE + AUTO-CLOSE
  ───────────────────────────────────────── */
  const searchToggle    = document.getElementById("search-toggle");
  const searchInputWrap = document.getElementById("search-input-wrap");
  const searchInput     = document.getElementById("search-input");

  // Guard — if elements don't exist, skip silently
  if (!searchToggle || !searchInputWrap) return;

  let searchOpen     = false;
  let autoCloseTimer = null;

  function openSearch() {
    searchOpen = true;
    searchInputWrap.classList.add("open");
    searchToggle.classList.add("active");
    // Focus input after CSS transition starts
    setTimeout(function () { searchInput?.focus(); }, 80);
    startAutoClose();
  }

  function closeSearch() {
    searchOpen = false;
    searchInputWrap.classList.remove("open");
    searchToggle.classList.remove("active");
    if (searchInput) searchInput.value = "";
    clearAutoClose();
  }

  function startAutoClose() {
    clearAutoClose();
    // Auto-close after 10 s if input is still empty
    autoCloseTimer = setTimeout(function () {
      if (!searchInput || searchInput.value.trim() === "") closeSearch();
    }, 10000);
  }

  function clearAutoClose() {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
    }
  }

  searchToggle.addEventListener("click", function () {
    searchOpen ? closeSearch() : openSearch();
  });

  searchInput?.addEventListener("input", function () {
    this.value.trim() !== "" ? clearAutoClose() : startAutoClose();
  });

  searchInput?.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSearch();
  });

  /* ─────────────────────────────────────────
     4. ACTIVE NAV — click handler
     (setActiveNavLink handles page-load state;
      this handles in-page clicks)
  ───────────────────────────────────────── */
  const navLinks = document.querySelectorAll(".nav-item-link");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (this.getAttribute("href") === "#") e.preventDefault();
      navLinks.forEach(function (l) { l.classList.remove("active"); });
      this.classList.add("active");
    });
  });
}

/* ═══════════════════════════════════════════════
   DOM CONTENT LOADED
   For pages using fetch partials:  loadPartial()
     calls initHeader() after HTML is injected.
   For pages with hard-coded header HTML:
     initHeader() is called directly here.
═══════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {
  // If #site-header placeholder exists → partial loading mode
  // loadPartial() is responsible for calling initHeader()
  const usesPartials = document.getElementById("site-header");

  if (!usesPartials) {
    // Hard-coded header on page → init immediately
    initHeader();
    setActiveNavLink();
  }
});


/* ═══════════════════════════════════════════════
   SECTION 3 — HERO CAROUSEL
═══════════════════════════════════════════════ */
(function () {
  const TOTAL       = 6;
  const INTERVAL_MS = 5000;

  const slides = document.querySelectorAll(".hero-slide");
  const dots   = document.querySelectorAll(".hero-dot");
  const prev   = document.getElementById("heroPrev");
  const next   = document.getElementById("heroNext");

  if (!slides.length) return;

  let current = 0;
  let timer   = null;

  function goTo(n) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (n + TOTAL) % TOTAL;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, INTERVAL_MS);
  }

  prev?.addEventListener("click", function () { goTo(current - 1); startTimer(); });
  next?.addEventListener("click", function () { goTo(current + 1); startTimer(); });

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      goTo(parseInt(this.getAttribute("data-dot"), 10));
      startTimer();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft")  { goTo(current - 1); startTimer(); }
    if (e.key === "ArrowRight") { goTo(current + 1); startTimer(); }
  });

  const carousel = document.getElementById("heroCarousel");
  carousel?.addEventListener("mouseenter", function () { clearInterval(timer); });
  carousel?.addEventListener("mouseleave", startTimer);

  startTimer();
})();


/* ═══════════════════════════════════════════════
   SECTION 4 — NOTIFICATION TICKER (seamless clone)
═══════════════════════════════════════════════ */
(function () {
  const track = document.getElementById("notifTrack");
  if (!track) return;
  // Duplicate items so the loop is seamless
  track.innerHTML += track.innerHTML;
})();


/* ═══════════════════════════════════════════════
   SECTION 5 — VIDEO PLAYER
═══════════════════════════════════════════════ */
(function () {
  const featuredThumb   = document.getElementById("featuredThumb");
  const featuredIframe  = document.getElementById("featuredIframe");
  const featuredPlayBtn = document.getElementById("featuredPlayBtn");
  const featuredThumbImg = document.getElementById("featuredThumbImg");
  const featuredTitle   = document.getElementById("featuredTitle");
  const thumbCards      = document.querySelectorAll(".vthumb-card");
  let currentVid        = "r80IU7cVn-s";

  function playFeatured(vid) {
    featuredIframe.src =
      "https://www.youtube.com/embed/" + vid + "?autoplay=1&rel=0&modestbranding=1";
    featuredIframe.classList.remove("d-none");
    featuredThumb.style.opacity      = "0";
    featuredThumb.style.pointerEvents = "none";
  }

  function resetFeatured() {
    featuredIframe.src = "";
    featuredIframe.classList.add("d-none");
    featuredThumb.style.opacity      = "1";
    featuredThumb.style.pointerEvents = "auto";
  }

  featuredPlayBtn?.addEventListener("click", function () { playFeatured(currentVid); });

  thumbCards.forEach(function (card) {
    card.addEventListener("click", function () {
      const vid   = this.getAttribute("data-vid");
      const title = this.getAttribute("data-title");

      thumbCards.forEach(function (c) { c.classList.remove("active"); });
      this.classList.add("active");

      resetFeatured();
      currentVid = vid;

      featuredThumbImg.src = "https://img.youtube.com/vi/" + vid + "/maxresdefault.jpg";
      featuredThumbImg.onerror = function () {
        this.src = "https://img.youtube.com/vi/" + vid + "/hqdefault.jpg";
      };
      if (featuredTitle) featuredTitle.textContent = title;

      setTimeout(function () { playFeatured(vid); }, 120);
    });
  });
})();


/* ═══════════════════════════════════════════════
   SECTION 5b — STAT COUNT-UP (repeats every 10s)
═══════════════════════════════════════════════ */
(function () {
  const stats = document.querySelectorAll(".stat-num[data-target]");
  if (!stats.length) return;

  function countUp(el) {
    const target   = +el.getAttribute("data-target");
    const duration = 1800;
    const step     = target / (duration / 16);
    let current    = 0;

    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = target >= 1000
        ? Math.floor(current / 1000) + "K+"
        : Math.floor(current) + "+";
    }, 16);
  }

  function runAll() { stats.forEach(countUp); }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        runAll();
        setInterval(runAll, 10000);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const section = document.getElementById("about-section");
  if (section) observer.observe(section);
})();


/* ═══════════════════════════════════════════════
   SECTION 5c — VIDEO THUMB SLIDER (arrow scroll)
═══════════════════════════════════════════════ */
(function () {
  const slider = document.getElementById("videoThumbSlider");
  const prev   = document.getElementById("vSliderPrev");
  const next   = document.getElementById("vSliderNext");
  if (!slider) return;

  const SCROLL = 200;

  next?.addEventListener("click", function () {
    const atEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5;
    if (atEnd) slider.scrollTo({ left: 0, behavior: "smooth" });
    else       slider.scrollBy({ left: SCROLL, behavior: "smooth" });
  });

  prev?.addEventListener("click", function () {
    const atStart = slider.scrollLeft <= 5;
    if (atStart) slider.scrollTo({ left: slider.scrollWidth, behavior: "smooth" });
    else         slider.scrollBy({ left: -SCROLL, behavior: "smooth" });
  });
})();


/* ═══════════════════════════════════════════════
   SECTION 5d — HONEYCOMB CANVAS TRANSITION
   3D coin-flip with ember-wave effect
═══════════════════════════════════════════════ */
(function () {
  const card   = document.getElementById("honeycombCard");
  const canvas = document.getElementById("honeycombCanvas");
  if (!card || !canvas) return;

  const ctx    = canvas.getContext("2d");
  const images = [
    "assets/images/hero-1.png",
    "assets/images/hero-2.png",
    "assets/images/hero-3.png",
    "assets/images/hero-4.png",
  ];

  const HEX_SIZE   = 52;
  const TRANSITION = 1400;
  const HOLD       = 3200;

  let imgObjs  = [];
  let current  = 0;
  let hexCells = [];
  let W, H;

  // Load all images first
  let loaded = 0;
  images.forEach(function (src, i) {
    const img  = new Image();
    img.src    = src;
    img.onload = function () {
      imgObjs[i] = img;
      if (++loaded === images.length) init();
    };
    img.onerror = function () {
      if (++loaded === images.length) init();
    };
  });

  function init() {
    resize();
    window.addEventListener("resize", resize);
    drawFrame(imgObjs[current], 1);
    setTimeout(nextSlide, HOLD);
  }

  function resize() {
    W = canvas.width  = card.offsetWidth;
    H = canvas.height = card.offsetHeight || 280;
    buildHexGrid();
  }

  function buildHexGrid() {
    hexCells = [];
    const colW = HEX_SIZE * Math.sqrt(3);
    const rowH = HEX_SIZE * 1.5;
    const cols = Math.ceil(W / colW) + 2;
    const rows = Math.ceil(H / rowH) + 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const offset = (col % 2) * HEX_SIZE * 0.75;
        hexCells.push({ cx: col * colW * 0.865, cy: row * rowH + offset, col, row });
      }
    }
  }

  function drawFrame(img, alpha) {
    if (!img) return;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, 0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  function hexPath(cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i - 30);
      i === 0
        ? ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle))
        : ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    }
    ctx.closePath();
  }

  function nextSlide() {
    const fromImg  = imgObjs[current];
    const nextIdx  = (current + 1) % imgObjs.length;
    const toImg    = imgObjs[nextIdx];

    if (!fromImg || !toImg) {
      current = nextIdx;
      setTimeout(nextSlide, HOLD);
      return;
    }

    const startTime = performance.now();
    const maxDiag   = Math.max(...hexCells.map(function (h) { return h.col + h.row; }));

    function animate(now) {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, W, H);
      drawFrame(fromImg, 1);

      hexCells.forEach(function (hex) {
        const diagNorm  = (hex.col + hex.row) / maxDiag;
        const waveStart = diagNorm * (TRANSITION * 0.5);
        const localT    = Math.min(1, Math.max(0, (elapsed - waveStart) / (TRANSITION * 0.45)));

        if (localT <= 0) return;

        const flip   = Math.abs(Math.cos(localT * Math.PI)); // 1 → 0 → 1
        const isBack = localT > 0.5;

        ctx.save();
        ctx.translate(hex.cx, hex.cy);
        ctx.scale(flip, 1); // fake 3D perspective
        ctx.translate(-hex.cx, -hex.cy);

        hexPath(hex.cx, hex.cy, HEX_SIZE);
        ctx.clip();

        ctx.drawImage(isBack ? toImg : fromImg, 0, 0, W, H);

        // Ember flash at flip midpoint
        const emberAlpha = Math.max(0, 1 - flip * 6);
        if (emberAlpha > 0) {
          ctx.fillStyle = "rgba(222, 89, 46, " + (emberAlpha * 0.92) + ")";
          ctx.fill();
          ctx.fillStyle = "rgba(255, 200, 120, " + (emberAlpha * 0.6) + ")";
          hexPath(hex.cx, hex.cy, HEX_SIZE * 0.55);
          ctx.fill();
        }

        ctx.restore();
      });

      if (elapsed < TRANSITION + maxDiag * 18) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, W, H);
        drawFrame(toImg, 1);
        current = nextIdx;
        setTimeout(nextSlide, HOLD);
      }
    }

    requestAnimationFrame(animate);
  }
})();


/* ═══════════════════════════════════════════════
   SECTION 6 — PARTNERS CAROUSEL
═══════════════════════════════════════════════ */
(function () {
  const carouselTrack   = document.getElementById("partnersCarouselTrack");
  const carouselWrapper = document.querySelector(".partners-carousel-wrapper");
  if (!carouselTrack || !carouselWrapper) return;

  // Hover pause (CSS handles it too, but JS ensures cross-browser)
  carouselWrapper.addEventListener("mouseenter", function () {
    carouselTrack.style.animationPlayState = "paused";
  });
  carouselWrapper.addEventListener("mouseleave", function () {
    carouselTrack.style.animationPlayState = "running";
  });

  // Touch support
  let touchStartX = 0;
  carouselWrapper.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].screenX;
    carouselTrack.style.animationPlayState = "paused";
  }, false);
  carouselWrapper.addEventListener("touchend", function () {
    carouselTrack.style.animationPlayState = "running";
  }, false);

  // Start animation when section enters viewport
  const section = document.getElementById("partners-carousel-section");
  if (section) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) carouselTrack.style.animationPlayState = "running";
      });
    }, { threshold: 0.1 }).observe(section);
  }
})();


/* ═══════════════════════════════════════════════
   SECTION 7 — FOOTER ANIMATIONS & NEWSLETTER
═══════════════════════════════════════════════ */

// Scroll-in animation
const footerElement = document.getElementById("main-footer");
if (footerElement) {
  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.animation = "footer-fade-up 0.8s ease-out 0.2s both";
        this.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 }).observe(footerElement);
}

// Newsletter form
const newsletterForm = document.getElementById("footer-newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const input = this.querySelector(".footer-input");
    const btn   = this.querySelector(".footer-btn");
    const email = input.value.trim();

    if (!email || !email.includes("@")) {
      input.style.borderColor = "#ff6b6b";
      setTimeout(function () { input.style.borderColor = ""; }, 1500);
      return;
    }

    btn.style.background = "linear-gradient(135deg, #90ee90, #76d776)";
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';

    setTimeout(function () {
      btn.style.background = "linear-gradient(135deg, var(--btn), #c74a24)";
      btn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
      input.value = "";
    }, 2000);
  });

  const footerInput = newsletterForm.querySelector(".footer-input");
  if (footerInput) {
    footerInput.addEventListener("focus", function () {
      this.parentElement.style.boxShadow =
        "0 0 20px rgba(222, 89, 46, 0.3), inset 0 0 15px rgba(222, 89, 46, 0.1)";
    });
    footerInput.addEventListener("blur", function () {
      this.parentElement.style.boxShadow = "";
    });
  }
}