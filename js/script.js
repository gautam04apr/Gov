/* ═══════════════════════════════════════════════
   GOVERNMENT OF ODISHA — SCRIPT.JS
═══════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", function () {
  /* ─────────────────────────────────────────
     1. FONT SIZE ACCESSIBILITY
  ───────────────────────────────────────── */
  const BASE_SIZE = 16; // px
  const MIN_SIZE = 13;
  const MAX_SIZE = 20;
  const STEP = 1;

  let currentSize = BASE_SIZE;

  const htmlEl = document.documentElement;
  const btnIncrease = document.getElementById("btn-increase");
  const btnDecrease = document.getElementById("btn-decrease");
  const btnReset = document.getElementById("btn-reset");

  function applyFontSize(size) {
    currentSize = Math.min(MAX_SIZE, Math.max(MIN_SIZE, size));
    htmlEl.style.fontSize = currentSize + "px";
  }

  btnIncrease?.addEventListener("click", () =>
    applyFontSize(currentSize + STEP),
  );
  btnDecrease?.addEventListener("click", () =>
    applyFontSize(currentSize - STEP),
  );
  btnReset?.addEventListener("click", () => applyFontSize(BASE_SIZE));

  /* ─────────────────────────────────────────
     2. LANGUAGE SWITCHER
  ───────────────────────────────────────── */
  const langOptions = document.querySelectorAll(".lang-option");
  const selectedLangEl = document.getElementById("selected-lang");

  langOptions.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      // Update button label
      const chosen = this.getAttribute("data-lang");
      if (selectedLangEl) selectedLangEl.textContent = chosen;

      // Mark active
      langOptions.forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");

      // Close dropdown
      const ddEl = document.getElementById("langDropdown");
      const ddInst = bootstrap.Dropdown.getInstance(ddEl);
      if (ddInst) ddInst.hide();
    });
  });

  /* ─────────────────────────────────────────
     3. SEARCH — EXPAND / COLLAPSE + AUTO-CLOSE
  ───────────────────────────────────────── */
  const searchToggle = document.getElementById("search-toggle");
  const searchInputWrap = document.getElementById("search-input-wrap");
  const searchInput = document.getElementById("search-input");

  let searchOpen = false;
  let autoCloseTimer = null;

  function openSearch() {
    searchOpen = true;
    searchInputWrap.classList.add("open");
    searchToggle.classList.add("active");
    // Focus after CSS transition starts
    setTimeout(() => searchInput?.focus(), 80);
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
    // Auto-close after 10 s if input is empty
    autoCloseTimer = setTimeout(function () {
      if (searchInput && searchInput.value.trim() === "") {
        closeSearch();
      }
    }, 10000);
  }

  function clearAutoClose() {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
    }
  }

  searchToggle?.addEventListener("click", function () {
    if (searchOpen) {
      closeSearch();
    } else {
      openSearch();
    }
  });

  // Reset auto-close timer while user types
  searchInput?.addEventListener("input", function () {
    if (this.value.trim() !== "") {
      clearAutoClose(); // typing → don't auto-close
    } else {
      startAutoClose(); // cleared → restart timer
    }
  });

  // Close on Escape key
  searchInput?.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSearch();
  });

  /* ─────────────────────────────────────────
     4. ACTIVE NAV ITEM
  ───────────────────────────────────────── */
  const navLinks = document.querySelectorAll(".nav-item-link");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      // Only prevent default for placeholder links (href="#")
      if (this.getAttribute("href") === "#") {
        e.preventDefault();
      }
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });
});

/* ═══════════════════════════════════════════════
   SECTION 3 — HERO CAROUSEL
═══════════════════════════════════════════════ */
(function () {
  const TOTAL = 6;
  const INTERVAL_MS = 5000;

  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  const prev = document.getElementById("heroPrev");
  const next = document.getElementById("heroNext");

  if (!slides.length) return;

  let current = 0;
  let timer = null;

  function goTo(n) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (n + TOTAL) % TOTAL;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(function () {
      goTo(current + 1);
    }, INTERVAL_MS);
  }

  prev?.addEventListener("click", function () {
    goTo(current - 1);
    startTimer();
  });
  next?.addEventListener("click", function () {
    goTo(current + 1);
    startTimer();
  });

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      goTo(parseInt(this.getAttribute("data-dot"), 10));
      startTimer();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      goTo(current - 1);
      startTimer();
    }
    if (e.key === "ArrowRight") {
      goTo(current + 1);
      startTimer();
    }
  });

  const carousel = document.getElementById("heroCarousel");
  carousel?.addEventListener("mouseenter", function () {
    clearInterval(timer);
  });
  carousel?.addEventListener("mouseleave", startTimer);

  startTimer();
})();

/* ═══════════════════════════════════════════════
   SECTION 4 — NOTIFICATION TICKER (seamless clone)
═══════════════════════════════════════════════ */
(function () {
  const track = document.getElementById("notifTrack");
  if (!track) return;
  // Clone all items and append — makes loop seamless
  track.innerHTML += track.innerHTML;
})();

/* SECTION 5 — VIDEO PLAYER */
(function () {
  const featuredThumb = document.getElementById("featuredThumb");
  const featuredIframe = document.getElementById("featuredIframe");
  const featuredPlayBtn = document.getElementById("featuredPlayBtn");
  const featuredThumbImg = document.getElementById("featuredThumbImg");
  const featuredTitle = document.getElementById("featuredTitle");
  const thumbCards = document.querySelectorAll(".vthumb-card");
  let currentVid = "r80IU7cVn-s";

  function playFeatured(vid) {
    featuredIframe.src =
      "https://www.youtube.com/embed/" +
      vid +
      "?autoplay=1&rel=0&modestbranding=1";
    featuredIframe.classList.remove("d-none");
    featuredThumb.style.opacity = "0";
    featuredThumb.style.pointerEvents = "none";
  }

  function resetFeatured() {
    featuredIframe.src = "";
    featuredIframe.classList.add("d-none");
    featuredThumb.style.opacity = "1";
    featuredThumb.style.pointerEvents = "auto";
  }

  featuredPlayBtn?.addEventListener("click", () => playFeatured(currentVid));

  thumbCards.forEach(function (card) {
    card.addEventListener("click", function () {
      const vid = this.getAttribute("data-vid");
      const title = this.getAttribute("data-title");
      thumbCards.forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
      resetFeatured();
      currentVid = vid;
      featuredThumbImg.src =
        "https://img.youtube.com/vi/" + vid + "/maxresdefault.jpg";
      featuredThumbImg.onerror = function () {
        this.src = "https://img.youtube.com/vi/" + vid + "/hqdefault.jpg";
      };
      if (featuredTitle) featuredTitle.textContent = title;
      setTimeout(() => playFeatured(vid), 120);
    });
  });
})();

/* Count-up animation — repeats every 10s */
(function () {
  const stats = document.querySelectorAll(".stat-num[data-target]");
  if (!stats.length) return;

  function countUp(el) {
    const target = +el.getAttribute("data-target");
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent =
        target >= 1000
          ? Math.floor(current / 1000) + "K+"
          : Math.floor(current) + "+";
    }, 16);
  }

  function runAll() {
    stats.forEach(countUp);
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runAll();
          setInterval(runAll, 10000);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.4 },
  );

  const section = document.getElementById("about-section");
  if (section) observer.observe(section);
})();

/* Video thumb slider — infinite loop arrows */
(function () {
  const slider = document.getElementById("videoThumbSlider");
  const prev = document.getElementById("vSliderPrev");
  const next = document.getElementById("vSliderNext");
  if (!slider) return;
  const SCROLL = 200;

  next?.addEventListener("click", function () {
    const atEnd =
      slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5;
    if (atEnd) slider.scrollTo({ left: 0, behavior: "smooth" });
    else slider.scrollBy({ left: SCROLL, behavior: "smooth" });
  });

  prev?.addEventListener("click", function () {
    const atStart = slider.scrollLeft <= 5;
    if (atStart)
      slider.scrollTo({ left: slider.scrollWidth, behavior: "smooth" });
    else slider.scrollBy({ left: -SCROLL, behavior: "smooth" });
  });
})();
/* Honeycomb canvas transition — 3D coin flip with ember wave */
(function () {
  const card = document.getElementById("honeycombCard");
  const canvas = document.getElementById("honeycombCanvas");
  if (!card || !canvas) return;

  const ctx = canvas.getContext("2d");
  const images = [
    "assets/images/hero-1.png",
    "assets/images/hero-2.png",
    "assets/images/hero-3.png",
    "assets/images/hero-4.png",
  ];

  const HEX_SIZE = 52;
  const TRANSITION = 1400;
  const HOLD = 3200;

  let imgObjs = [];
  let current = 0;
  let hexCells = [];
  let W, H;

  /* Load images */
  let loaded = 0;
  images.forEach(function (src, i) {
    const img = new Image();
    img.src = src;
    img.onload = function () {
      imgObjs[i] = img;
      loaded++;
      if (loaded === images.length) init();
    };
    img.onerror = function () {
      loaded++;
      if (loaded === images.length) init();
    };
  });

  function init() {
    resize();
    window.addEventListener("resize", resize);
    drawFrame(imgObjs[current], 1);
    setTimeout(nextSlide, HOLD);
  }

  function resize() {
    W = canvas.width = card.offsetWidth;
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
        hexCells.push({
          cx: col * colW * 0.865,
          cy: row * rowH + offset,
          col,
          row,
        });
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
    const fromImg = imgObjs[current];
    const next = (current + 1) % imgObjs.length;
    const toImg = imgObjs[next];
    if (!fromImg || !toImg) {
      current = next;
      setTimeout(nextSlide, HOLD);
      return;
    }

    const startTime = performance.now();
    const maxDiag = Math.max(...hexCells.map((h) => h.col + h.row));

    function animate(now) {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, W, H);

      /* Base: old image */
      drawFrame(fromImg, 1);

      hexCells.forEach(function (hex) {
        /* Diagonal wave: top-left → bottom-right */
        const diagNorm = (hex.col + hex.row) / maxDiag;
        const waveStart = diagNorm * (TRANSITION * 0.5);
        const localT = Math.min(
          1,
          Math.max(0, (elapsed - waveStart) / (TRANSITION * 0.45)),
        );

        if (localT <= 0) return;

        /* 3D coin flip: scaleX goes 1 → 0 (first half) → 1 (second half) */
        const flip = Math.abs(Math.cos(localT * Math.PI)); /* 1→0→1 */
        const isBack = localT > 0.5; /* which face showing */

        ctx.save();
        ctx.translate(hex.cx, hex.cy);
        ctx.scale(flip, 1); /* fake 3D perspective */
        ctx.translate(-hex.cx, -hex.cy);

        hexPath(hex.cx, hex.cy, HEX_SIZE);
        ctx.clip();

        if (isBack) {
          /* Second half: reveal new image */
          ctx.drawImage(toImg, 0, 0, W, H);
        } else {
          /* First half: show old image (already drawn, just re-clip) */
          ctx.drawImage(fromImg, 0, 0, W, H);
        }

        /* Ember flash at flip midpoint — orange glow when scaleX ≈ 0 */
        const emberAlpha = Math.max(0, 1 - flip * 6); /* spikes at flip=0 */
        if (emberAlpha > 0) {
          ctx.fillStyle = `rgba(222, 89, 46, ${emberAlpha * 0.92})`;
          ctx.fill();

          /* Inner bright core */
          ctx.fillStyle = `rgba(255, 200, 120, ${emberAlpha * 0.6})`;
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
        current = next;
        setTimeout(nextSlide, HOLD);
      }
    }

    requestAnimationFrame(animate);
  }
})();

/* ─────────────────────────────────────────
   7. FOOTER — SCROLL ANIMATIONS & NEWSLETTER
───────────────────────────────────────── */

// FOOTER SCROLL-IN ANIMATION
const footerElement = document.getElementById("main-footer");
if (footerElement) {
  const footerObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animation = "footer-fade-up 0.8s ease-out 0.2s both";
          footerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  footerObserver.observe(footerElement);
}

// NEWSLETTER FORM HANDLING
const newsletterForm = document.getElementById("footer-newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const input = this.querySelector(".footer-input");
    const btn = this.querySelector(".footer-btn");
    const email = input.value.trim();

    // Basic email validation
    if (!email || !email.includes("@")) {
      input.style.borderColor = "#ff6b6b";
      setTimeout(() => {
        input.style.borderColor = "";
      }, 1500);
      return;
    }

    // Button feedback
    btn.style.background = "linear-gradient(135deg, #90ee90, #76d776)";
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';

    setTimeout(() => {
      btn.style.background = "linear-gradient(135deg, var(--btn), #c74a24)";
      btn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
      input.value = "";
    }, 2000);
  });

  // Input focus animation
  const input = newsletterForm.querySelector(".footer-input");
  if (input) {
    input.addEventListener("focus", function () {
      this.parentElement.style.boxShadow =
        "0 0 20px rgba(222, 89, 46, 0.3), inset 0 0 15px rgba(222, 89, 46, 0.1)";
    });

    input.addEventListener("blur", function () {
      this.parentElement.style.boxShadow = "";
    });
  }
}

/* ─────────────────────────────────────────
   SECTION 6 — PARTNERS CAROUSEL
───────────────────────────────────────── */
(function () {
  const carouselTrack = document.getElementById("partnersCarouselTrack");
  const carouselWrapper = document.querySelector(".partners-carousel-wrapper");

  if (!carouselTrack || !carouselWrapper) return;

  // Initialize carousel — ensure seamless loop
  // The CSS animation handles the continuous scrolling
  // This JavaScript ensures smooth experience and accessibility

  // Pause animation on hover (handled by CSS, but ensure browser support)
  carouselWrapper.addEventListener("mouseenter", function () {
    carouselTrack.style.animationPlayState = "paused";
  });

  carouselWrapper.addEventListener("mouseleave", function () {
    carouselTrack.style.animationPlayState = "running";
  });

  // Touch support for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  carouselWrapper.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
      carouselTrack.style.animationPlayState = "paused";
    },
    false
  );

  carouselWrapper.addEventListener(
    "touchend",
    function (e) {
      touchEndX = e.changedTouches[0].screenX;
      carouselTrack.style.animationPlayState = "running";
    },
    false
  );

  // Scroll behavior on touch
  carouselWrapper.addEventListener("touchmove", function (e) {
    // Allow default scroll behavior
    if (Math.abs(touchStartX - touchEndX) > 50) {
      // Significant swipe detected
      e.preventDefault();
    }
  });

  // Intersection Observer for animation trigger
  const section = document.getElementById("partners-carousel-section");
  if (section) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            carouselTrack.style.animationPlayState = "running";
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
  }

  // Keyboard support
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      // Only work if carousel is in view
      const rect = carouselWrapper.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        carouselTrack.style.animationPlayState = "paused";
        setTimeout(() => {
          carouselTrack.style.animationPlayState = "running";
        }, 2000);
      }
    }
  });
})();
