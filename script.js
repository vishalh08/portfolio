// Theme Toggle Functionality
const themeToggle = document.getElementById("theme-toggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

const getPreferredTheme = () => {
  return (
    localStorage.getItem("theme") ||
    (prefersDarkScheme.matches ? "dark" : "light")
  );
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.innerHTML = theme === "dark" ? "☀︎" : "🌙";
};

const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
  localStorage.setItem("theme", newTheme);
};

// Initialize theme
applyTheme(getPreferredTheme());

// Event Listeners
themeToggle.addEventListener("click", toggleTheme);
prefersDarkScheme.addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) {
    applyTheme(e.matches ? "dark" : "light");
  }
});

// Back to Top Functionality
const backToTopButton = document.getElementById("back-to-top");

const toggleBackToTopButton = () => {
  const scrollTop =
    document.body.scrollTop || document.documentElement.scrollTop;
  backToTopButton.style.display = scrollTop > 100 ? "block" : "none";
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.addEventListener("scroll", toggleBackToTopButton);
backToTopButton.addEventListener("click", scrollToTop);

// Form Validation
const validateForm = (event) => {
  event.preventDefault();

  const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    message: document.getElementById("message"),
  };

  const validations = {
    name: {
      required: true,
      pattern: /^[a-zA-Z\s]*$/,
      errorMessage: "Name can only contain letters and spaces",
    },
    email: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.){1,2}[a-zA-Z]{2,6}$/,
      errorMessage:
        "Enter a valid email address in the format: example@domain.com",
    },
    message: {
      required: true,
      minLength: 10,
      errorMessage: "Message must be at least 10 characters long",
    },
  };

  let isValid = true;

  // Reset validation styles
  Object.values(fields).forEach(resetFieldValidation);

  // Validate fields
  Object.entries(fields).forEach(([fieldName, field]) => {
    const validation = validations[fieldName];
    if (!validateField(field, validation)) {
      isValid = false;
    }
  });

  if (isValid) {
    console.log("Form is valid");
  }

  return isValid;
};

const resetFieldValidation = (field) => {
  field.classList.remove("error", "success");
  const existingMessage = field.parentElement.querySelector(
    ".validation-message"
  );
  if (existingMessage) existingMessage.remove();
};

const validateField = (field, validation) => {
  const value = field.value.trim();

  if (validation.required && value === "") {
    showError(field, `${field.name} is required`);
    return false;
  }

  if (validation.pattern && !validation.pattern.test(value)) {
    showError(field, validation.errorMessage);
    return false;
  }

  if (validation.minLength && value.length < validation.minLength) {
    showError(field, validation.errorMessage);
    return false;
  }

  field.classList.add("success");
  return true;
};

const showError = (element, message) => {
  element.classList.add("error");
  const errorDiv = document.createElement("div");
  errorDiv.className = "validation-message";
  errorDiv.textContent = message;
  element.parentElement.appendChild(errorDiv);
};

// Skills Carousel Functionality
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".skills-grid");
  const prevButton = document.getElementById("prevBtn");
  const nextButton = document.getElementById("nextBtn");

  let currentPosition = 0;

  const updateCarousel = () => {
    const visibleWidth = track.parentElement.offsetWidth;
    const totalWidth = track.scrollWidth;

    const showButtons = totalWidth > visibleWidth;
    [prevButton, nextButton].forEach(
      (btn) => (btn.style.display = showButtons ? "flex" : "none")
    );

    if (!showButtons) {
      track.style.transform = "translateX(0)";
      return { itemWidth: 0, maxScroll: 0 };
    }

    const itemsPerView =
      window.innerWidth <= 480 ? 2 : window.innerWidth <= 768 ? 3 : 5;
    const itemWidth = visibleWidth / itemsPerView;
    const maxScroll = -(totalWidth - visibleWidth);

    return { itemWidth, maxScroll };
  };

  const moveCarousel = (direction) => {
    const { itemWidth, maxScroll } = updateCarousel();

    if (direction === "prev" && currentPosition < 0) {
      currentPosition = Math.min(currentPosition + itemWidth, 0);
    } else if (direction === "next" && currentPosition > maxScroll) {
      currentPosition = Math.max(currentPosition - itemWidth, maxScroll);
    }

    track.style.transform = `translateX(${currentPosition}px)`;
  };

  prevButton.addEventListener("click", () => moveCarousel("prev"));
  nextButton.addEventListener("click", () => moveCarousel("next"));
  window.addEventListener("resize", updateCarousel);

  updateCarousel();
});
