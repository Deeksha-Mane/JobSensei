document.addEventListener("DOMContentLoaded", () => {
  // Theme switching functionality
  const themeToggle = document.getElementById("theme-toggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Check for saved theme preference or use system preference
  const currentTheme =
    localStorage.getItem("theme") ||
    (prefersDarkScheme.matches ? "dark" : "light");

  // Apply the saved theme
  document.body.classList.toggle("dark-theme", currentTheme === "dark");
  updateThemeIcon(currentTheme);

  // Theme toggle button click handler
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    const newTheme = isDark ? "dark" : "light";

    // Save theme preference
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
    updateThemeStyles(newTheme);
  });

  // Update theme icon based on current theme
  function updateThemeIcon(theme) {
    if (themeToggle) {
      themeToggle.innerHTML =
        theme === "dark"
          ? '<i class="fas fa-sun"></i>'
          : '<i class="fas fa-moon"></i>';
    }
  }

  // Update all theme-dependent styles
  function updateThemeStyles(theme) {
    const root = document.documentElement;

    if (theme === "dark") {
      root.style.setProperty("--bg-primary", "#0A0F1E");
      root.style.setProperty("--bg-secondary", "#121826");
      root.style.setProperty("--text-primary", "#4A90E2");
      root.style.setProperty("--text-secondary", "#B8C2CC");
      root.style.setProperty("--accent-color", "#ffffff");
      root.style.setProperty("--card-bg", "#1A2238");
      root.style.setProperty("--border-color", "rgba(74, 144, 226, 0.1)");
      root.style.setProperty("--navbar-bg", "#1A2238");
      root.style.setProperty("--navbar-text", "#4A90E2");
      root.style.setProperty("--button-text", "#ffffff");
      root.style.setProperty("--button-bg", "#4A90E2");
    } else {
      root.style.setProperty("--bg-primary", "#f8f9fa");
      root.style.setProperty("--bg-secondary", "#ffffff");
      root.style.setProperty("--text-primary", "#0b5ed7");
      root.style.setProperty("--text-secondary", "#34495e");
      root.style.setProperty("--accent-color", "#0b5ed7");
      root.style.setProperty("--card-bg", "#ffffff");
      root.style.setProperty("--border-color", "#dee2e6");
      root.style.setProperty("--navbar-bg", "#ffffff");
      root.style.setProperty("--navbar-text", "#0b5ed7");
      root.style.setProperty("--button-text", "#ffffff");
      root.style.setProperty("--button-bg", "#0b5ed7");
    }
  }

  // Listen for system theme changes
  prefersDarkScheme.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      const newTheme = e.matches ? "dark" : "light";
      document.body.classList.toggle("dark-theme", newTheme === "dark");
      updateThemeIcon(newTheme);
      updateThemeStyles(newTheme);
    }
  });

  // Initialize theme styles
  updateThemeStyles(currentTheme);
});
