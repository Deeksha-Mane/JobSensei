// Theme Toggle Implementation
document.addEventListener('DOMContentLoaded', function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Change theme
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        const icon = themeToggleBtn.querySelector('i');
        if (newTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Set initial theme from localStorage or default to dark
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const html = document.documentElement;
        html.setAttribute('data-theme', savedTheme);
        
        // Set initial icon
        const icon = themeToggleBtn.querySelector('i');
        if (savedTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Initialize theme
    if (themeToggleBtn) {
        initializeTheme();
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
}); 