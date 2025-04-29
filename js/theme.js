// Theme Toggle Functionality
document.addEventListener("DOMContentLoaded", function() {
    const themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) return; // Exit if element not found
    
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else if (currentTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else if (prefersDarkScheme.matches) {
      document.documentElement.setAttribute("data-theme", "dark");
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  
    // Theme toggle button click handler
    themeToggle.addEventListener("click", function() {
      console.log("Theme toggle clicked");
      if (document.documentElement.getAttribute("data-theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        console.log("Switched to light theme");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        console.log("Switched to dark theme");
      }
    });
  });