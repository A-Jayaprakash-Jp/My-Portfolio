document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    const icon = themeToggle.querySelector('i');
    
    // Apply the saved theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Add transition class for smooth change
        document.documentElement.classList.add('theme-transition');
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update icon
        updateThemeIcon(newTheme);
        
        // Store preference
        localStorage.setItem('theme', newTheme);
        
        // Remove transition class after animation completes
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 500);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            icon.style.color = '#FFD43B';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            icon.style.color = '';
        }
    }
    // Update when theme changes
    function updateParticleColors(theme) {
        if (window.pJSDom && window.pJSDom[0]) {
            const pJS = window.pJSDom[0].pJS;
            pJS.particles.color.value = theme === 'dark' ? '#7f78d2' : '#6c63ff';
            pJS.particles.line_linked.color = theme === 'dark' ? '#7f78d2' : '#6c63ff';
            pJS.fn.vendors.densityAutoParticles();
        }
    }

    // Call this in your theme toggle function
    updateParticleColors(currentTheme);
    
    // Listen for system color scheme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        updateParticleColors(newTheme);
    });
});