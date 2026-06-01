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
