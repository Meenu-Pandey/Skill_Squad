// Placements Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initFilterTabs();
    initCounterAnimation();
    initScrollAnimations();
});

// Filter functionality for placement categories
function initFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const placementItems = document.querySelectorAll('.placement-item');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            // Filter placement items
            placementItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Counter animation for statistics
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number based on the target type
            if (target === 500) {
                element.textContent = Math.floor(current) + '+';
            } else if (target === 150) {
                element.textContent = Math.floor(current) + '+';
            } else if (target === 12) {
                element.textContent = '₹' + Math.floor(current) + 'L';
            } else if (target === 95) {
                element.textContent = Math.floor(current) + '%';
            }
        }, 20);
    };

    // Create intersection observer for stats section
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.stat-number[data-target]');
                numbers.forEach(number => {
                    const target = parseInt(number.getAttribute('data-target'));
                    animateCounter(number, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe stats section
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

// Scroll animations for cards and elements
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add random animation delay for staggered effect
                entry.target.style.animationDelay = Math.random() * 0.5 + 's';
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.placement-card, .stat-card, .company-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Enhanced filter functionality with smooth transitions
function enhanceFilterExperience() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        tab.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// Add hover effects for placement cards
function enhanceCardInteractions() {
    const placementCards = document.querySelectorAll('.placement-card');
    
    placementCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Initialize enhanced interactions
document.addEventListener('DOMContentLoaded', function() {
    enhanceFilterExperience();
    enhanceCardInteractions();
});

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize smooth scrolling
initSmoothScrolling();

// Add loading states for better UX
function addLoadingStates() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Add loading state
            this.style.pointerEvents = 'none';
            this.style.opacity = '0.7';
            
            // Remove loading state after animation
            setTimeout(() => {
                this.style.pointerEvents = 'auto';
                this.style.opacity = '1';
            }, 600);
        });
    });
}

// Initialize loading states
addLoadingStates();

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    // Handle scroll-based animations or effects here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Add keyboard navigation support for filter tabs
function addKeyboardSupport() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach((tab, index) => {
        tab.setAttribute('tabindex', '0');
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', tab.classList.contains('active'));
        
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextTab = filterTabs[(index + 1) % filterTabs.length];
                nextTab.focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevTab = filterTabs[(index - 1 + filterTabs.length) % filterTabs.length];
                prevTab.focus();
            }
        });
    });
}

// Initialize keyboard support
addKeyboardSupport();
