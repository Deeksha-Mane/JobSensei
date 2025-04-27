document.addEventListener("DOMContentLoaded", () => {
  // Navbar Toggle Functionality
  function toggleNavbar() {
    const navbarLinks = document.querySelector(".navbar-links");
    navbarLinks.classList.toggle("active");
  }

  // Theme Switching Functionality
  const themeToggle = document.getElementById("theme-toggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Check for saved theme preference or use system preference
  const currentTheme =
    localStorage.getItem("theme") ||
    (prefersDarkScheme.matches ? "dark" : "light");

  // Apply the saved theme
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon(currentTheme);

  // Theme toggle button click handler
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });

  // Update theme icon based on current theme
  function updateThemeIcon(theme) {
    if (themeToggle) {
      themeToggle.innerHTML =
        theme === "dark"
          ? '<i class="fas fa-sun" aria-hidden="true"></i>'
          : '<i class="fas fa-moon" aria-hidden="true"></i>';
    }
  }

  // Carousel Functionality
  const track = document.getElementById("carouselTrack");
  const cards = document.querySelectorAll(".job-card");
  const cardWidth = cards[0].offsetWidth + 20; // card + margin
  let position = 0;
  let visibleCards = 3;

  function moveCarousel(direction) {
    const totalCards = cards.length;
    position += direction;

    if (position < 0) {
      position = totalCards - visibleCards;
    } else if (position > totalCards - visibleCards) {
      position = 0;
    }

    const offset = -position * cardWidth;
    track.style.transform = `translateX(${offset}px)`;
  }

  // Scroll to Top Functionality
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.className = "scroll-top-btn";
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
  scrollTopBtn.title = "Scroll to top";
  document.body.appendChild(scrollTopBtn);

  window.onscroll = function () {
    if (
      document.body.scrollTop > 300 ||
      document.documentElement.scrollTop > 300
    ) {
      scrollTopBtn.style.display = "block";
    } else {
      scrollTopBtn.style.display = "none";
    }
  };

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Chatbot Button
  const chatbotBtn = document.createElement("a");
  chatbotBtn.href = "../pages/chatbot.html";
  chatbotBtn.className = "chatbot-button";
  chatbotBtn.title = "Chat with AI Career Assistant";
  chatbotBtn.innerHTML = '<i class="fas fa-robot" aria-hidden="true"></i>';
  document.body.appendChild(chatbotBtn);

  // Language Translation Toggle
  const translateToggle = document.getElementById("translate-toggle");
  const translateBox = document.getElementById("google_translate_element");

  translateToggle.addEventListener("click", () => {
    const isHidden =
      translateBox.style.display === "none" || !translateBox.style.display;
    translateBox.style.display = isHidden ? "block" : "none";
  });

  // Initialize theme styles
  updateThemeIcon(currentTheme);

  // Responsive adjustments
  function adjustCarousel() {
    const width = window.innerWidth;
    if (width <= 768) {
      visibleCards = 1;
    } else if (width <= 1024) {
      visibleCards = 2;
    } else {
      visibleCards = 3;
    }
    moveCarousel(0); // Reset position
  }

  window.addEventListener("resize", adjustCarousel);
  adjustCarousel(); // Initial adjustment
});

let autoSlideInterval;

// Start Auto Slide
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    moveCarousel(1); // Move to next slide every 3 seconds
  }, 3000);
}

// Stop Auto Slide
function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Start auto-slide when page loads
startAutoSlide();

// Optional: Pause auto-slide on mouse hover over carousel
if (track) {
  track.addEventListener('mouseenter', stopAutoSlide);
  track.addEventListener('mouseleave', startAutoSlide);
}