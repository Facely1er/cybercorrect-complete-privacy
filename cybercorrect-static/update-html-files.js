import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read header and footer templates
const headerTemplate = fs.readFileSync(path.join(__dirname, 'includes', 'header.html'), 'utf8');
const footerTemplate = fs.readFileSync(path.join(__dirname, 'includes', 'footer.html'), 'utf8');

// Page mapping: filename -> page identifier
const pageMap = {
  'index.html': 'index',
  'index-aligned.html': 'index',
  'index-original.html': 'index',
  'proof-side-by-side.html': 'index',
  'about.html': 'about',
  'how-it-works.html': 'how-it-works',
  'features.html': 'features',
  'pricing.html': 'pricing',
  'trust.html': 'trust',
  'faq.html': 'faq',
  'contact.html': 'contact'
};

// Page title mapping for breadcrumbs
const pageTitleMap = {
  'index': 'Home',
  'about': 'About',
  'how-it-works': 'How It Works',
  'features': 'Features',
  'pricing': 'Pricing',
  'trust': 'Trust',
  'faq': 'FAQ',
  'contact': 'Contact'
};

// Generate breadcrumb navigation
function generateBreadcrumb(activePage) {
  if (!activePage || activePage === 'index') return '';
  
  const title = pageTitleMap[activePage] || activePage;
  return '        <!-- Breadcrumb -->\n' +
        '        <nav aria-label="Breadcrumb" class="sticky z-40 w-full h-10 sm:h-11 text-sm border-b border-border transition-colors px-4 sm:px-6 lg:px-8 flex items-center backdrop-blur-sm bg-background/95" style="top: var(--nav-height, 64px);">\n' +
        '            <div class="max-w-7xl mx-auto w-full">\n' +
        '                <div class="flex items-center justify-between">\n' +
        '                    <div class="flex items-center space-x-1">\n' +
        '                        <div class="flex items-center">\n' +
        '                            <a class="transition-colors flex items-center text-muted-foreground hover:text-primary" href="index.html">\n' +
        '                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home h-4 w-4 mr-1"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>Home</a>\n' +
        '                        </div>\n' +
        '                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right h-4 w-4 flex-shrink-0 text-muted-foreground"><path d="m9 18 6-6-6-6"></path></svg>\n' +
        '                        <div class="flex items-center">\n' +
        '                            <span class="font-medium flex items-center text-primary">' + title + '</span>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <div class="flex items-center space-x-2 ml-4"></div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </nav>\n';
}

// Generate header with active page highlighted
function generateHeader(activePage) {
  const pages = [
    { id: 'index', href: 'index.html', label: 'Home', icon: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>' },
    { id: 'how-it-works', href: 'how-it-works.html', label: 'How It Works', icon: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path><path d="M18 2h-2a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path><path d="M6 2H4a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>' },
    { id: 'features', href: 'features.html', label: 'Features', icon: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>' },
    { id: 'pricing', href: 'pricing.html', label: 'Pricing', icon: '<line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>' },
    { id: 'trust', href: 'trust.html', label: 'Trust', icon: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>' },
    { id: 'faq', href: 'faq.html', label: 'FAQ', icon: '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path>' },
    { id: 'contact', href: 'contact.html', label: 'Contact', icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>' }
  ];

  const desktopNav = pages.map(page => {
    const isActive = page.id === activePage;
    const classes = isActive 
      ? 'nav-link relative flex items-center justify-center space-x-1.5 px-2 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground'
      : 'nav-link relative flex items-center justify-center space-x-1.5 px-2 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent/10 text-foreground';
    return `<a href="${page.href}" class="${classes}" data-page="${page.id}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 flex-shrink-0">${page.icon}</svg>
      <span>${page.label}</span>
    </a>`;
  }).join('\n            ');

  const mobileNav = pages.map(page => {
    const isActive = page.id === activePage;
    const classes = isActive
      ? 'nav-link flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground'
      : 'nav-link flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent/10';
    return `<a href="${page.href}" class="${classes}" data-page="${page.id}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">${page.icon}</svg>
      ${page.label}
    </a>`;
  }).join('\n          ');

  return `<nav class="fixed top-0 left-0 right-0 z-50 shadow-lg border-b transition-all duration-300 glass-nav overflow-visible" style="--nav-height: 64px; height: var(--nav-height,64px);">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full relative z-50 overflow-visible h-full">
      <div class="flex justify-between items-center h-full gap-1 sm:gap-2 py-1 min-w-0 overflow-visible">
        <!-- Brand (3 lines like CyberCaution) -->
        <a href="index.html" class="flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0 hover:opacity-90 transition-all duration-200 group z-10 relative min-w-0">
          <div class="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 min-w-[40px] min-h-[40px] rounded-2xl bg-background flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0 p-1">
            <img src="assets/cybercorrect.png" alt="CyberCorrect Logo" class="w-full h-full object-contain" />
          </div>
          <div class="brand-text hidden sm:flex">
            <div class="brand-name block">CyberCorrect™</div>
            <div class="brand-tagline block">Privacy Compliance</div>
            <div class="brand-attribution block">by ERMITS LLC</div>
          </div>
        </a>

        <!-- Desktop nav -->
        <div class="hidden md:flex flex-1 justify-center px-2">
          <div class="flex items-center space-x-0.5 sm:space-x-1">
            ${desktopNav}
          </div>
        </div>

        <!-- Controls (dual theme + mobile menu) -->
        <div class="flex items-center space-x-1 flex-shrink-0">
          <button id="themeToggle" aria-label="Switch theme" class="p-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-muted text-foreground hover:bg-muted/80 flex items-center justify-center min-w-[44px] min-h-[44px]" title="Switch theme">
            <svg id="sunIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun w-4 h-4 text-primary inline-block">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
            <svg id="moonIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon w-4 h-4 text-foreground hidden">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
          </button>

          <button data-mobile-menu-button="true" class="md:hidden p-2 rounded-lg transition-all duration-200 flex-shrink-0 relative z-[60] bg-muted text-foreground hover:bg-muted/80 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Open menu" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu w-5 h-5 text-foreground">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Mobile menu panel -->
  <div id="mobileMenu" class="md:hidden fixed left-0 right-0 z-50 hidden" style="top: var(--nav-height, 64px);">
    <div class="bg-background/95 backdrop-blur-sm border-b border-border shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="grid grid-cols-2 gap-2">
          ${mobileNav}
        </div>
      </div>
    </div>
  </div>`;
}

const scriptContent = `
  <script>
    // Theme toggle and mobile menu functionality
    (function() {
      // Theme toggle
      function initThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        const sunIcon = document.getElementById('sunIcon');
        const moonIcon = document.getElementById('moonIcon');
        
        function updateIcons() {
          const isDark = document.documentElement.classList.contains('dark');
          if (isDark) {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
          } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
          }
        }
        
        if (toggle) {
          toggle.addEventListener('click', function() {
            const html = document.documentElement;
            const isDark = html.classList.contains('dark');
            if (isDark) {
              html.classList.remove('dark');
              localStorage.setItem('darkMode', 'false');
            } else {
              html.classList.add('dark');
              localStorage.setItem('darkMode', 'true');
            }
            updateIcons();
          });
        }
        
        updateIcons();
      }
      
      // Mobile menu toggle
      function initMobileMenu() {
        const menuButton = document.querySelector('[data-mobile-menu-button]');
        const menu = document.getElementById('mobileMenu');
        
        if (menuButton && menu) {
          menuButton.addEventListener('click', function() {
            const isOpen = !menu.classList.contains('hidden');
            if (isOpen) {
              menu.classList.add('hidden');
              menuButton.setAttribute('aria-expanded', 'false');
            } else {
              menu.classList.remove('hidden');
              menuButton.setAttribute('aria-expanded', 'true');
            }
          });
          
          // Close menu when clicking a link
          const links = menu.querySelectorAll('a');
          links.forEach(link => {
            link.addEventListener('click', function() {
              menu.classList.add('hidden');
              menuButton.setAttribute('aria-expanded', 'false');
            });
          });
        }
      }
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          initThemeToggle();
          initMobileMenu();
        });
      } else {
        initThemeToggle();
        initMobileMenu();
      }
    })();
  </script>`;

// Process HTML files
function processFile(filePath) {
  const filename = path.basename(filePath);
  const activePage = pageMap[filename] || null;
  
  if (!activePage && !filename.includes('legal/')) {
    console.log(`Skipping ${filename} - not in page map`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove load-shared.js script
  content = content.replace(/<script src="includes\/load-shared\.js" defer><\/script>\s*/g, '');
  
  // Ensure theme CSS is included
  if (!content.includes('cybercorrect-theme.css')) {
    content = content.replace(
      /(<link rel="stylesheet" href="assets\/css\/app\.css" \/>)/g,
      '<!-- CyberCorrect Theme Colors -->\n  <link rel="stylesheet" href="assets/css/cybercorrect-theme.css" />\n  <!-- CyberCaution UI CSS (reused for alignment) -->\n  $1'
    );
  }
  
  // Remove duplicate mobile menu panels
  const mobileMenuPattern = /<!-- Mobile menu panel -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*(<!-- Mobile menu panel -->)/g;
  content = content.replace(mobileMenuPattern, '');
  
  // Replace header placeholder or entire header section
  content = content.replace(/<div id="shared-header"><\/div>/g, generateHeader(activePage));
  // Replace entire nav tag and its contents (including mobile menu)
  const headerRegex = /<nav[^>]*>[\s\S]*?<\/nav>\s*<!-- Mobile menu panel -->[\s\S]*?<\/div>\s*<\/div>/g;
  content = content.replace(headerRegex, generateHeader(activePage) + '\n\n<!-- Mobile menu panel -->\n<div id="mobileMenu" class="md:hidden fixed left-0 right-0 z-50 hidden" style="top: var(--nav-height, 64px);">\n  <div class="bg-background/95 backdrop-blur-sm border-b border-border shadow-lg">\n    <div class="max-w-7xl mx-auto px-4 py-3">\n      <div class="grid grid-cols-2 gap-2">\n        <!-- Mobile nav will be generated by generateHeader -->\n      </div>\n    </div>\n  </div>\n</div>');
  
  // Replace footer placeholder or entire footer section
  content = content.replace(/<div id="shared-footer"><\/div>/g, footerTemplate);
  // Replace entire footer tag and its contents
  content = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/g, footerTemplate);
  
  // Inject breadcrumb navigation (skip for index pages)
  if (activePage && activePage !== 'index') {
    const breadcrumb = generateBreadcrumb(activePage);
    // Remove any existing breadcrumb
    content = content.replace(/<!-- Breadcrumb -->[\s\S]*?<\/nav>\s*/g, '');
    // Insert breadcrumb inside main tag, right after opening main tag
    // Pattern: <main ...> followed by optional divs, then insert breadcrumb
    const mainPattern = /(<main[^>]*class="[^"]*pt-\[var\(--nav-height[^"]*"[^>]*>)\s*(<div[^>]*class="[^"]*relative[^"]*z-10[^"]*w-full[^"]*">)?/;
    if (mainPattern.test(content)) {
      content = content.replace(mainPattern, '$1\n        <div class="relative z-10 w-full">\n' + breadcrumb.trim());
    } else {
      // Fallback: try simpler pattern
      const simpleMainPattern = /(<main[^>]*>)/;
      if (simpleMainPattern.test(content)) {
        content = content.replace(simpleMainPattern, '$1\n        <div class="relative z-10 w-full">\n' + breadcrumb.trim());
      }
    }
  }
  
  // Replace any remaining orange/amber colors with primary teal
  content = content.replace(/text-warning-amber/g, 'text-primary');
  
  // Replace secure-green in gradients with primary teal for consistency
  content = content.replace(/from-secure-green\//g, 'from-primary/');
  
  // Add script before closing body tag
  if (!content.includes('initThemeToggle')) {
    content = content.replace(/<\/body>/g, scriptContent + '\n</body>');
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filename} (active page: ${activePage || 'none'})`);
}

// Get all HTML files
const htmlFiles = [
  'index.html',
  'index-aligned.html',
  'index-original.html',
  'proof-side-by-side.html',
  'about.html',
  'how-it-works.html',
  'features.html',
  'pricing.html',
  'trust.html',
  'faq.html',
  'contact.html'
];

// Process each file
htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    processFile(filePath);
  }
});

// Process legal files (no active page highlighting)
const legalDir = path.join(__dirname, 'legal');
if (fs.existsSync(legalDir)) {
  const legalFiles = fs.readdirSync(legalDir).filter(f => f.endsWith('.html'));
  legalFiles.forEach(file => {
    const filePath = path.join(legalDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove load-shared.js script
    content = content.replace(/<script src="\.\.\/includes\/load-shared\.js" defer><\/script>\s*/g, '');
    content = content.replace(/<script src="includes\/load-shared\.js" defer><\/script>\s*/g, '');
    
    // Ensure theme CSS is included (for legal pages, use relative path)
    if (!content.includes('cybercorrect-theme.css')) {
      content = content.replace(
        /(<link rel="stylesheet" href="\.\.\/assets\/css\/[^"]+\.css" \/>)/g,
        '<!-- CyberCorrect Theme Colors -->\n  <link rel="stylesheet" href="../assets/css/cybercorrect-theme.css" />\n  $1'
      );
    }
    
    // Remove duplicate mobile menu panels
    const mobileMenuPattern = /<!-- Mobile menu panel -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*(<!-- Mobile menu panel -->)/g;
    content = content.replace(mobileMenuPattern, '');
    
    // Replace header placeholder or entire header section (no active page)
    content = content.replace(/<div id="shared-header"><\/div>/g, generateHeader(null));
    // Replace entire nav tag and its contents (including mobile menu)
    const headerRegex = /<nav[^>]*>[\s\S]*?<\/nav>\s*<!-- Mobile menu panel -->[\s\S]*?<\/div>\s*<\/div>/g;
    content = content.replace(headerRegex, generateHeader(null) + '\n\n<!-- Mobile menu panel -->\n<div id="mobileMenu" class="md:hidden fixed left-0 right-0 z-50 hidden" style="top: var(--nav-height, 64px);">\n  <div class="bg-background/95 backdrop-blur-sm border-b border-border shadow-lg">\n    <div class="max-w-7xl mx-auto px-4 py-3">\n      <div class="grid grid-cols-2 gap-2">\n        <!-- Mobile nav will be generated by generateHeader -->\n      </div>\n    </div>\n  </div>\n</div>');
    
    // Replace footer placeholder or entire footer section
    content = content.replace(/<div id="shared-footer"><\/div>/g, footerTemplate);
    // Replace entire footer tag and its contents
    content = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/g, footerTemplate);
    
    // Inject breadcrumb navigation for legal pages (if needed)
    // Legal pages typically don't need breadcrumbs, but we can add if required
    
    // Replace any remaining orange/amber colors with primary teal
    content = content.replace(/text-warning-amber/g, 'text-primary');
    
    // Replace secure-green in gradients with primary teal for consistency
    content = content.replace(/from-secure-green\//g, 'from-primary/');
    
    // Add script before closing body tag
    if (!content.includes('initThemeToggle')) {
      content = content.replace(/<\/body>/g, scriptContent + '\n</body>');
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated legal/${file}`);
  });
}

console.log('\nDone! All HTML files have been updated with hardcoded header and footer.');


