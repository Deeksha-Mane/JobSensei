// Navbar functionality
document.addEventListener("DOMContentLoaded", function() {
    // Toggle navbar for mobile
    function toggleNavbar() {
      const navbarLinks = document.querySelector(".navbar-links");
      if (navbarLinks) {
        navbarLinks.classList.toggle("active");
      }
    }
  
    // Make toggleNavbar available globally
    window.toggleNavbar = toggleNavbar;
    
    // Add click handler for the navbar toggler
    const navbarToggler = document.querySelector(".navbar-toggler");
    if (navbarToggler) {
      navbarToggler.addEventListener("click", toggleNavbar);
    }
    
    // Handle translate toggle functionality
    const translateToggle = document.getElementById("translate-toggle");
    const googleTranslateElement = document.getElementById("google_translate_element");
    
    if (translateToggle && googleTranslateElement) {
      translateToggle.addEventListener("click", function() {
        if (googleTranslateElement.style.display === "none") {
          googleTranslateElement.style.display = "block";
        } else {
          googleTranslateElement.style.display = "none";
        }
      });
    }
  });