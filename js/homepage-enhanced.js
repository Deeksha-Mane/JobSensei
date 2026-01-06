// ===== CUSTOM CURSOR =====
function initCursor() {
  if (window.innerWidth <= 768) return;
  
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add('active');
  });
  
  // Smooth cursor movement
  function animate() {
    const speed = 0.2;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animate);
  }
  animate();
  
  // Hover effect
  const hoverElements = document.querySelectorAll('a, button, .visual-card');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.innerHTML = '<i class="fas fa-moon"></i>';
  toggle.setAttribute('aria-label', 'Toggle theme');
  document.body.appendChild(toggle);
  
  // Check saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    toggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    toggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// ===== NAVBAR SCROLL =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 20px var(--shadow)';
      navbar.style.padding = '1rem 5%';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.padding = '1.5rem 5%';
    }
  });
}

// ===== MOBILE MENU =====
function toggleNavbar() {
  const navLinks = document.querySelector('.navbar-links');
  navLinks.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelector('.navbar-links');
  
  if (navLinks && navLinks.classList.contains('active')) {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('active');
    }
  }
});

// Handle dropdown on mobile
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const dropdown = toggle.closest('.dropdown');
      dropdown.classList.toggle('active');
    }
  });
});

// ===== SCROLL TO TOP =====
function initScrollToTop() {
  const btn = document.querySelector('.scroll-top-btn');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
    }
  });
}

window.scrollToTop = function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.steps div').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initThemeToggle();
  initNavbar();
  initScrollToTop();
  initScrollAnimations();
  
  // Fade in page
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});
