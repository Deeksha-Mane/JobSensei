/**
 * Toggle mobile navigation menu
 * This function handles the mobile menu toggle functionality
 * when the screen size is 768px or less
 */
function toggleNavbar() {
    // Select the navbar links container
    const navbarLinks = document.querySelector('.navbar-links');
    
    // Toggle the 'active' class to show/hide the mobile menu
    navbarLinks.classList.toggle('active');
    
    // Optional: Toggle aria-expanded attribute for accessibility
    const navbarToggler = document.querySelector('.navbar-toggler');
    const isExpanded = navbarLinks.classList.contains('active');
    navbarToggler.setAttribute('aria-expanded', isExpanded);
    
    // Optional: Change button text/icon when expanded
    // navbarToggler.innerHTML = isExpanded ? '✕' : '☰';
  }
  
  // Close mobile menu when clicking a link
  document.addEventListener('DOMContentLoaded', function() {
    // Get all navbar links
    const navLinks = document.querySelectorAll('.navbar-links a');
    
    // Add click event to each link to close menu when navigating
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Only run this on mobile view when menu is expanded
        if (window.innerWidth <= 768) {
          const navbarLinks = document.querySelector('.navbar-links');
          if (navbarLinks.classList.contains('active')) {
            navbarLinks.classList.remove('active');
            
            // Reset the toggler button state
            const navbarToggler = document.querySelector('.navbar-toggler');
            navbarToggler.setAttribute('aria-expanded', 'false');
            // navbarToggler.innerHTML = '☰';
          }
        }
      });
    });
    
    // Handle window resize to fix menu state
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        const navbarLinks = document.querySelector('.navbar-links');
        navbarLinks.classList.remove('active');
      }
    });
  });