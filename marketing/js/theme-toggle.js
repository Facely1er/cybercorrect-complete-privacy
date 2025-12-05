// Theme Toggle - Exact match from React app
(function() {
  // Get theme from localStorage or default to light
  const getTheme = () => {
    const stored = localStorage.getItem('socialcaution_theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Apply theme
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('socialcaution_theme', theme);
    
    // Update all theme toggle icons
    const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
    themeToggles.forEach(toggle => {
      const icon = toggle.querySelector('.theme-toggle-icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    });
  };

  // Initialize theme on page load
  applyTheme(getTheme());

  // Theme toggle button handlers
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  
  const handleThemeToggle = () => {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', handleThemeToggle);
  }

  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', handleThemeToggle);
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('socialcaution_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
})();

