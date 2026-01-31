/**
 * Shared UI Components for Shabdly.online
 * 
 * This file contains reusable HTML/JS snippets for:
 * - Go-to-Top Button (shows after 400px scroll)
 * - Navigation Bar with Logo
 * - Breadcrumbs
 * - Back/Forward Navigation
 */

export const sharedStyles = `
<style>
    /* Go to Top Button Styles */
    #goToTopBtn {
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
    }

    #goToTopBtn:hover {
        background-color: #1d4ed8;
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }

    #goToTopBtn.show {
        display: flex;
    }

    /* Logo Styles */
    .logo-container {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .logo-image {
        height: 40px;
        width: auto;
    }

    .logo-text {
        font-size: 1.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    /* Breadcrumb Styles */
    .breadcrumb {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 1.5rem;
    }

    .breadcrumb a {
        color: #2563eb;
        text-decoration: none;
        transition: color 0.2s;
    }

    .breadcrumb a:hover {
        color: #1d4ed8;
        text-decoration: underline;
    }

    .breadcrumb-separator {
        color: #9ca3af;
    }

    .breadcrumb-current {
        color: #374151;
        font-weight: 500;
    }

    /* Navigation Buttons */
    .nav-buttons {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .nav-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background-color: #f3f4f6;
        color: #374151;
        border-radius: 0.5rem;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.2s;
        border: 1px solid #e5e7eb;
    }

    .nav-btn:hover {
        background-color: #e5e7eb;
        border-color: #d1d5db;
        transform: translateY(-1px);
    }

    .nav-btn.primary {
        background-color: #2563eb;
        color: white;
        border-color: #2563eb;
    }

    .nav-btn.primary:hover {
        background-color: #1d4ed8;
        border-color: #1d4ed8;
    }
</style>
`;

export const goToTopButton = `
<!-- Go to Top Button -->
<button id="goToTopBtn" onclick="scrollToTop()" title="Go to top">
    <i class="fas fa-arrow-up"></i>
</button>

<script>
    // Show/hide Go to Top button based on scroll position
    window.onscroll = function() {
        const btn = document.getElementById('goToTopBtn');
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    };

    // Smooth scroll to top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
</script>
`;

export function getLogo(showText = true): string {
    return `
    <div class="logo-container">
        <img src="/static/logo.png" alt="Shabdly Logo" class="logo-image" onerror="this.style.display='none'">
        ${showText ? '<span class="logo-text">Shabdly</span>' : ''}
    </div>
    `;
}

export function getNavigation(currentPage?: string): string {
    const navItems = [
        { label: 'Home', href: '/', icon: 'home' },
        { label: 'Features', href: '/#features', icon: 'star' },
        { label: 'Pricing', href: '/#pricing', icon: 'tag' },
        { label: 'Help', href: '/help', icon: 'question-circle' },
        { label: 'FAQ', href: '/faq', icon: 'comments' },
    ];

    return `
    <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <a href="/" class="flex items-center">
                    ${getLogo(true)}
                </a>
                <div class="hidden md:flex items-center space-x-6">
                    ${navItems.map(item => `
                        <a href="${item.href}" class="text-gray-600 hover:text-blue-600 transition ${currentPage === item.href ? 'text-blue-600 font-semibold' : ''}">
                            <i class="fas fa-${item.icon} mr-1"></i>${item.label}
                        </a>
                    `).join('')}
                    <a href="/dashboard" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        Dashboard
                    </a>
                </div>
                <!-- Mobile menu button -->
                <button onclick="toggleMobileMenu()" class="md:hidden text-gray-600">
                    <i class="fas fa-bars text-xl"></i>
                </button>
            </div>
            <!-- Mobile menu -->
            <div id="mobileMenu" class="hidden md:hidden pb-4">
                ${navItems.map(item => `
                    <a href="${item.href}" class="block py-2 text-gray-600 hover:text-blue-600">
                        <i class="fas fa-${item.icon} mr-2"></i>${item.label}
                    </a>
                `).join('')}
                <a href="/dashboard" class="block py-2 text-blue-600 font-semibold">
                    <i class="fas fa-tachometer-alt mr-2"></i>Dashboard
                </a>
            </div>
        </div>
    </nav>
    <script>
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }
    </script>
    `;
}

export function getBreadcrumbs(items: Array<{ label: string; href?: string }>): string {
    return `
    <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">
            <i class="fas fa-home"></i> Home
        </a>
        ${items.map((item, index) => `
            <span class="breadcrumb-separator">
                <i class="fas fa-chevron-right text-xs"></i>
            </span>
            ${item.href ? 
                `<a href="${item.href}">${item.label}</a>` : 
                `<span class="breadcrumb-current">${item.label}</span>`
            }
        `).join('')}
    </nav>
    `;
}

export function getPageNavigation(options: {
    previousPage?: { label: string; href: string };
    nextPage?: { label: string; href: string };
    showBackButton?: boolean;
}): string {
    const { previousPage, nextPage, showBackButton = true } = options;

    return `
    <div class="nav-buttons">
        ${showBackButton ? `
            <button onclick="window.history.back()" class="nav-btn">
                <i class="fas fa-arrow-left"></i>
                Back
            </button>
        ` : ''}
        ${previousPage ? `
            <a href="${previousPage.href}" class="nav-btn">
                <i class="fas fa-chevron-left"></i>
                ${previousPage.label}
            </a>
        ` : ''}
        ${nextPage ? `
            <a href="${nextPage.href}" class="nav-btn primary">
                ${nextPage.label}
                <i class="fas fa-chevron-right"></i>
            </a>
        ` : ''}
    </div>
    `;
}

export function getFooter(): string {
    return `
    <footer class="bg-gray-900 text-white py-12 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <!-- Brand -->
                <div>
                    <div class="flex items-center space-x-2 mb-4">
                        <img src="/static/logo.png" alt="Shabdly Logo" class="h-8 w-auto" onerror="this.style.display='none'">
                        <span class="text-xl font-bold">Shabdly</span>
                    </div>
                    <p class="text-gray-400 text-sm">
                        AI-powered translation for Indian e-commerce sellers
                    </p>
                </div>
                
                <!-- Product -->
                <div>
                    <h4 class="font-semibold mb-4">Product</h4>
                    <ul class="space-y-2 text-sm text-gray-400">
                        <li><a href="/#features" class="hover:text-white transition">Features</a></li>
                        <li><a href="/#pricing" class="hover:text-white transition">Pricing</a></li>
                        <li><a href="/help" class="hover:text-white transition">Documentation</a></li>
                        <li><a href="/faq" class="hover:text-white transition">FAQ</a></li>
                    </ul>
                </div>
                
                <!-- Company -->
                <div>
                    <h4 class="font-semibold mb-4">Company</h4>
                    <ul class="space-y-2 text-sm text-gray-400">
                        <li><a href="/about" class="hover:text-white transition">About</a></li>
                        <li><a href="/contact" class="hover:text-white transition">Contact</a></li>
                        <li><a href="/terms" class="hover:text-white transition">Terms of Service</a></li>
                        <li><a href="/privacy" class="hover:text-white transition">Privacy Policy</a></li>
                    </ul>
                </div>
                
                <!-- Support -->
                <div>
                    <h4 class="font-semibold mb-4">Support</h4>
                    <ul class="space-y-2 text-sm text-gray-400">
                        <li><a href="/help" class="hover:text-white transition">Help Center</a></li>
                        <li><a href="/refund-policy" class="hover:text-white transition">Refund Policy</a></li>
                        <li><a href="mailto:heyshabdly@gmail.com" class="hover:text-white transition">Email Support</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="border-t border-gray-800 pt-8 text-center">
                <p class="text-gray-400 text-sm">© 2026 Shabdly.online. All rights reserved.</p>
                <p class="text-gray-500 text-xs mt-2">Nagpur, Maharashtra, India</p>
            </div>
        </div>
    </footer>
    `;
}

// Helper function to create a complete page template
export function createPageTemplate(options: {
    title: string;
    description?: string;
    currentPage?: string;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    content: string;
    showBackButton?: boolean;
    previousPage?: { label: string; href: string };
    nextPage?: { label: string; href: string };
}): string {
    const {
        title,
        description = '',
        currentPage,
        breadcrumbs,
        content,
        showBackButton = true,
        previousPage,
        nextPage
    } = options;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - Shabdly</title>
        ${description ? `<meta name="description" content="${description}">` : ''}
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        ${sharedStyles}
    </head>
    <body class="bg-gray-50 min-h-screen flex flex-col">
        ${getNavigation(currentPage)}

        <div class="flex-grow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                ${breadcrumbs ? getBreadcrumbs(breadcrumbs) : ''}
                
                ${(previousPage || nextPage || showBackButton) ? `
                    <div class="mb-6">
                        ${getPageNavigation({ previousPage, nextPage, showBackButton })}
                    </div>
                ` : ''}
                
                ${content}
                
                ${(previousPage || nextPage) ? `
                    <div class="mt-12">
                        ${getPageNavigation({ previousPage, nextPage, showBackButton: false })}
                    </div>
                ` : ''}
            </div>
        </div>

        ${getFooter()}
        ${goToTopButton}
    </body>
    </html>
    `;
}
