// ==========================
// Font Size Controls
// ==========================

let currentScale = 1;

const textElements = document.querySelectorAll(
  `
  .utility-link,
  .phone-link,
  .nav-link,
  .logo-text h5,
  .logo-text span,
  .language-btn
  `,
);

const buttonElements = document.querySelectorAll(
  `
  .login-btn,
  .register-btn
  `,
);

// Update Font Size

function updateFontSize() {
  // Text size
  textElements.forEach((el) => {
    el.style.fontSize = `${currentScale}em`;
  });

  // Button size
  buttonElements.forEach((btn) => {
    btn.style.transform = `scale(${currentScale})`;
  });
}

// Increase Font

document.getElementById("increase-font").addEventListener("click", () => {
  if (currentScale < 1.2) {
    currentScale += 0.05;

    updateFontSize();
  }
});

// Decrease Font

document.getElementById("decrease-font").addEventListener("click", () => {
  if (currentScale > 0.85) {
    currentScale -= 0.05;

    updateFontSize();
  }
});

// Reset Font

document.getElementById("reset-font").addEventListener("click", () => {
  currentScale = 1;

  textElements.forEach((el) => {
    el.style.fontSize = "";
  });

  buttonElements.forEach((btn) => {
    btn.style.transform = "";
  });
});

// ==========================
// Language Dropdown
// ==========================

const languageOptions = document.querySelectorAll(".language-option");

const languageBtn = document.querySelector(".language-btn");

languageOptions.forEach((option) => {
  option.addEventListener("click", function () {
    languageBtn.innerHTML = this.textContent.trim();
  });
});

// ==========================
// Search Expand Animation
// ==========================

const searchBtn = document.querySelector(".search-toggle");

const searchInput = document.querySelector(".search-input");

let searchTimeout;

// Open / Close Search

searchBtn.addEventListener("click", () => {
  searchInput.classList.toggle("active");

  if (searchInput.classList.contains("active")) {
    searchInput.focus();

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      if (searchInput.value.trim() === "") {
        searchInput.classList.remove("active");
      }
    }, 10000);
  }
});

// Auto close if empty

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);

  if (searchInput.value.trim() === "") {
    searchTimeout = setTimeout(() => {
      searchInput.classList.remove("active");
    }, 10000);
  }
});

// ==========================
// Hero Swiper
// ==========================

const heroSwiper = new Swiper(".heroSwiper", {
  loop: true,

  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
