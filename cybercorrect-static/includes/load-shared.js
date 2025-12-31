// Shared Header and Footer Loader
(function() {
    // ============================================
    // THEME MANAGEMENT (runs immediately to prevent flash)
    // ============================================
    (function() {
        // Apply theme immediately before page renders
        try {
            const savedMode = localStorage.getItem('darkMode');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (savedMode === 'true' || (!savedMode && prefersDark)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        } catch (e) {
            // Ignore errors in localStorage access
        }
    })();

    // Theme toggle functionality (works with dynamically loaded header)
    function initThemeToggle() {
        function toggleTheme(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            const html = document.documentElement;
            const isDark = html.classList.contains('dark');
            
            if (isDark) {
                html.classList.remove('dark');
                localStorage.setItem('darkMode', 'false');
            } else {
                html.classList.add('dark');
                localStorage.setItem('darkMode', 'true');
            }
            
            // Update button labels and sync animated background
            updateThemeButtons();
            syncAnimatedBackground();
        }
        
        function syncAnimatedBackground() {
            const html = document.documentElement;
            const isDark = html.classList.contains('dark');
            const container = document.querySelector('.animated-background-container');
            
            if (container) {
                if (isDark) {
                    container.classList.add('dark');
                } else {
                    container.classList.remove('dark');
                }
            }
        }
        
        function updateThemeButtons() {
            const isDark = document.documentElement.classList.contains('dark');
            const buttons = document.querySelectorAll('button[aria-label*="Switch"]') || 
                           document.querySelectorAll('button#themeToggle') ||
                           document.querySelectorAll('[id*="themeToggle"]');

            // Toggle icons if present
            const sun = document.getElementById('sunIcon');
            const moon = document.getElementById('moonIcon');
            if (sun && moon) {
                if (isDark) {
                    sun.classList.add('hidden');
                    moon.classList.remove('hidden');
                } else {
                    moon.classList.add('hidden');
                    sun.classList.remove('hidden');
                }
            }
            
            buttons.forEach(button => {
                if (isDark) {
                    button.setAttribute('aria-label', 'Switch to Light Mode');
                    button.setAttribute('title', 'Switch to Light Mode');
                } else {
                    button.setAttribute('aria-label', 'Switch to Dark Mode');
                    button.setAttribute('title', 'Switch to Dark Mode');
                }
            });
        }
        
        // Use event delegation for theme toggle buttons (works with dynamically loaded content)
        document.addEventListener('click', function(e) {
            const button = e.target.closest('button[aria-label*="Switch"]') || 
                          e.target.closest('button#themeToggle') ||
                          e.target.closest('[id*="themeToggle"]');
            if (button) {
                toggleTheme(e);
            }
        });
        
        // Update button labels and sync background on load
        updateThemeButtons();
        syncAnimatedBackground();
        
        // Re-run after header loads to update buttons
        return { updateThemeButtons, syncAnimatedBackground };
    }

    // Initialize theme toggle
    let themeControls = null;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            themeControls = initThemeToggle();
        });
    } else {
        themeControls = initThemeToggle();
    }

    // ============================================
    // HEADER/FOOTER LOADING
    // ============================================
    
    // Check if running on file:// protocol (local file system)
    const isFileProtocol = window.location.protocol === 'file:';
    
    if (isFileProtocol) {
        console.error('%c⚠️ CORS Error: File Protocol Detected', 'color: red; font-weight: bold; font-size: 14px;');
        console.error('%cThe site must be served via HTTP/HTTPS to load shared components.', 'color: orange; font-size: 12px;');
        console.info('%c📋 To fix this, run a local server:', 'color: blue; font-weight: bold;');
        console.info('%c   Python 3: python -m http.server 8000', 'color: #0f0;');
        console.info('%c   Node.js: npx http-server -p 8000', 'color: #0f0;');
        console.info('%c   Then open: http://localhost:8000', 'color: #0f0;');
        console.info('%c   Or use the provided server script: python server.py', 'color: #0f0;');
        
        // Show a visible message on the page
        const showFileProtocolWarning = () => {
            const headerPlaceholder = document.getElementById('shared-header');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = `
                    <div style="background: #fee; border: 2px solid #f00; padding: 20px; margin: 10px; border-radius: 8px; color: #c00;">
                        <h3 style="margin-top: 0;">⚠️ Local File Protocol Detected</h3>
                        <p><strong>The site must be served via HTTP to load shared components.</strong></p>
                        <p>Please run a local server:</p>
                        <ul style="margin: 10px 0;">
                            <li><code>python -m http.server 8000</code> (Python 3)</li>
                            <li><code>npx http-server -p 8000</code> (Node.js)</li>
                            <li>Or use <code>python server.py</code> if available</li>
                        </ul>
                        <p>Then open: <strong>http://localhost:8000</strong></p>
                    </div>
                `;
            }
        };
        
        // Try to show warning immediately or wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showFileProtocolWarning);
        } else {
            showFileProtocolWarning();
        }
        
        return; // Exit early, don't try to load files
    }

    // Get current page identifier from data attribute or filename
    function getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';

        if (filename === 'index.html' || filename === '' || filename === 'index-aligned.html' || filename === 'proof-side-by-side.html') return 'index';
        if (filename === 'how-it-works.html') return 'how-it-works';
        if (filename === 'features.html') return 'features';
        if (filename === 'pricing.html') return 'pricing';
        if (filename === 'trust.html') return 'trust';
        if (filename === 'faq.html') return 'faq';
        if (filename === 'contact.html') return 'contact';
        if (filename === 'about.html') return 'about';
        return null;
    }

    function pageTitle(page) {
        const map = {
            index: 'Home',
            'how-it-works': 'How It Works',
            features: 'Features',
            pricing: 'Pricing',
            trust: 'Trust',
            faq: 'FAQ',
            contact: 'Contact',
            about: 'About'
        };
        return map[page] || page;
    }

    function injectBreadcrumb() {
        const page = getCurrentPage();
        if (!page || page === 'index') return;

        const main = document.querySelector('main');
        if (!main) return;

        // Avoid double-inject
        if (main.querySelector('[data-breadcrumb="true"]')) return;

        const title = pageTitle(page);
        const wrapper = document.createElement('nav');
        wrapper.setAttribute('aria-label', 'Breadcrumb');
        wrapper.setAttribute('data-breadcrumb', 'true');
        wrapper.className = 'sticky z-40 top-[var(--nav-height,64px)] bg-background/90 backdrop-blur-sm border-b border-border';
        wrapper.innerHTML = `
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ol class="flex items-center space-x-2 py-2 text-sm text-muted-foreground">
              <li>
                <a href="index.html" class="hover:text-foreground transition-colors inline-flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  Home
                </a>
              </li>
              <li class="text-muted-foreground">/</li>
              <li class="text-foreground font-medium">${title}</li>
            </ol>
          </div>
        `;

        main.insertBefore(wrapper, main.firstChild);
    }

    function initMobileMenu() {
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('[data-mobile-menu-button]');
            const menu = document.getElementById('mobileMenu');
            if (!menu) return;

            if (btn) {
                e.preventDefault();
                const isOpen = !menu.classList.contains('hidden');
                if (isOpen) {
                    menu.classList.add('hidden');
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    menu.classList.remove('hidden');
                    btn.setAttribute('aria-expanded', 'true');
                }
                return;
            }

            // Close when selecting a link
            const link = e.target.closest('#mobileMenu a');
            if (link) {
                menu.classList.add('hidden');
                const toggle = document.querySelector('[data-mobile-menu-button]');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Load header
    function loadHeader() {
        const headerPlaceholder = document.getElementById('shared-header');
        if (!headerPlaceholder) {
            console.warn('Header placeholder #shared-header not found');
            return;
        }

        // Try multiple path variations
        const paths = [
            'includes/header.html',
            './includes/header.html',
            '/includes/header.html'
        ];

        let pathIndex = 0;
        
        function tryLoadPath() {
            if (pathIndex >= paths.length) {
                console.error('Failed to load header from all attempted paths');
                return;
            }

            const currentPath = paths[pathIndex];
            console.log('Attempting to load header from:', currentPath);
            
            fetch(currentPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(html => {
                    if (!html || html.trim() === '') {
                        throw new Error('Header HTML is empty');
                    }
                    console.log('Header loaded successfully from:', currentPath);
                    headerPlaceholder.outerHTML = html;
                    
                    // Highlight active page
                    const currentPage = getCurrentPage();
                    if (currentPage) {
                        const activeLink = document.querySelector(`[data-page="${currentPage}"]`);
                        if (activeLink) {
                            activeLink.classList.remove('hover:bg-accent/10', 'text-foreground');
                            activeLink.classList.add('bg-primary', 'text-primary-foreground');
                        }
                    }

                    // Init mobile menu + breadcrumbs after header is in the DOM
                    try {
                        initMobileMenu();
                        injectBreadcrumb();
                    } catch (e) {
                        console.warn('Post-header init error:', e);
                    }
                    
                    // Update theme buttons after header loads
                    if (themeControls) {
                        themeControls.updateThemeButtons();
                    }
                })
                .catch(err => {
                    console.warn(`Failed to load from ${currentPath}:`, err.message);
                    pathIndex++;
                    tryLoadPath();
                });
        }

        tryLoadPath();
    }

    // Load footer
    function loadFooter() {
        const footerPlaceholder = document.getElementById('shared-footer');
        if (!footerPlaceholder) return;

        const paths = [
            'includes/footer.html',
            './includes/footer.html',
            '/includes/footer.html'
        ];

        let pathIndex = 0;
        
        function tryLoadPath() {
            if (pathIndex >= paths.length) {
                console.error('Failed to load footer from all attempted paths');
                return;
            }

            // Add cache-busting query parameter to force fresh load
            const cacheBuster = '?v=' + Date.now();
            const url = paths[pathIndex] + cacheBuster;
            
            fetch(url, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.text();
                })
                .then(html => {
                    if (!html || html.trim() === '') {
                        throw new Error('Footer HTML is empty');
                    }
                    console.log('Footer loaded successfully from:', paths[pathIndex]);
                    footerPlaceholder.outerHTML = html;
                })
                .catch((err) => {
                    console.warn(`Failed to load from ${paths[pathIndex]}:`, err.message);
                    pathIndex++;
                    tryLoadPath();
                });
        }

        tryLoadPath();
    }

    // Load both when DOM is ready
    function init() {
        loadHeader();
        loadFooter();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded, run immediately
        init();
    }
})();
