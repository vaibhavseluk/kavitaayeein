/**
 * Shabdly Global Scripts
 * Included on all pages for common functionality
 */

// ============================================
// GO TO TOP BUTTON
// ============================================
(function() {
    // Create and inject Go to Top button
    const goToTopHTML = `
        <button id="goToTopBtn" title="Go to top" style="
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 99;
            border: none;
            outline: none;
            background-color: #2563eb;
            color: white;
            cursor: pointer;
            padding: 15px;
            border-radius: 50%;
            font-size: 18px;
            width: 50px;
            height: 50px;
            display: none;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        ">
            <i class="fas fa-arrow-up"></i>
        </button>
    `;

    // Inject button when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.insertAdjacentHTML('beforeend', goToTopHTML);
            initGoToTop();
        });
    } else {
        document.body.insertAdjacentHTML('beforeend', goToTopHTML);
        initGoToTop();
    }

    function initGoToTop() {
        const btn = document.getElementById('goToTopBtn');
        if (!btn) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
                btn.style.display = 'flex';
            } else {
                btn.style.display = 'none';
            }
        });

        // Add hover effect
        btn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#1d4ed8';
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
        });

        btn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#2563eb';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });

        // Smooth scroll to top
        btn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
})();

// ============================================
// MOBILE MENU TOGGLE
// ============================================
window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
};

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', function(e) {
    // Alt + H = Home
    if (e.altKey && e.key === 'h') {
        e.preventDefault();
        window.location.href = '/';
    }
    
    // Alt + F = Help/FAQ
    if (e.altKey && e.key === 'f') {
        e.preventDefault();
        window.location.href = '/help';
    }
    
    // Alt + D = Dashboard
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        window.location.href = '/dashboard';
    }
});

// ============================================
// BROWSER BACK/FORWARD DETECTION
// ============================================
window.addEventListener('popstate', function(event) {
    console.log('Navigation: Browser back/forward detected');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================
window.scrollToTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

window.scrollToElement = function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

// ============================================
// EXTERNAL LINK WARNING
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="shabdly.online"])');
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
});

console.log('✓ Shabdly global scripts loaded');
