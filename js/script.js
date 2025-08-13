// Modern JavaScript for SkillSquad Academy
class SkillSquadApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupFAB();
        this.setupModuleInteractions();
        this.setupCounters();
        this.setupFormHandling();
        this.setupPerformanceOptimizations();
    }

    // Navigation Setup
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });
        }

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu?.classList.remove('active');
                navToggle?.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });

        // Navbar scroll effect
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (navbar) {
                if (currentScrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Hide/show navbar on scroll
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollY = currentScrollY;
        });

        // Active link highlighting
        this.updateActiveNavLink();
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Scroll Effects
    setupScrollEffects() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Parallax effect for hero shapes
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const shapes = document.querySelectorAll('.shape');
            
            shapes.forEach((shape, index) => {
                const speed = 0.5 + (index * 0.1);
                shape.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Animation Setup
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Stagger animations for grid items
                    if (entry.target.classList.contains('features-grid') || 
                        entry.target.classList.contains('success-grid')) {
                        this.staggerGridAnimations(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll(`
            .feature-card,
            .success-card,
            .trust-item,
            .module-item,
            .section-header,
            .hero-left,
            .hero-right
        `).forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });

        // Floating cards animation
        this.animateFloatingCards();
    }

    staggerGridAnimations(container) {
        const items = container.querySelectorAll('.feature-card, .success-card, .trust-item');
        
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = `slideInUp 0.6s ease forwards`;
            }, index * 100);
        });
    }

    animateFloatingCards() {
        const cards = document.querySelectorAll('.floating-card');
        
        cards.forEach((card, index) => {
            // Random initial position
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            
            card.style.transform = `translate(${randomX}px, ${randomY}px)`;
            
            // Continuous floating animation
            setInterval(() => {
                const newX = Math.random() * 30 - 15;
                const newY = Math.random() * 30 - 15;
                
                card.style.transform = `translate(${newX}px, ${newY}px)`;
            }, 3000 + (index * 500));
        });
    }

    // Floating Action Button
    setupFAB() {
        const fabMain = document.getElementById('fabMain');
        const fabContainer = document.querySelector('.fab-container');
        
        if (fabMain && fabContainer) {
            fabMain.addEventListener('click', () => {
                fabContainer.classList.toggle('active');
            });

            // Close FAB when clicking outside
            document.addEventListener('click', (e) => {
                if (!fabContainer.contains(e.target)) {
                    fabContainer.classList.remove('active');
                }
            });

            // Track FAB interactions
            document.querySelectorAll('.fab-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const action = option.getAttribute('data-tooltip');
                    this.trackEvent('fab_click', { action });
                });
            });
        }
    }

    // Module Interactions
    setupModuleInteractions() {
        const moduleItems = document.querySelectorAll('.module-item');
        
        moduleItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Remove active class from all items
                moduleItems.forEach(module => module.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Track interaction
                const moduleName = item.querySelector('h4').textContent;
                this.trackEvent('module_click', { module: moduleName, index });
            });

            // Auto-cycle through modules
            setTimeout(() => {
                item.classList.add('active');
                setTimeout(() => {
                    item.classList.remove('active');
                }, 2000);
            }, index * 3000);
        });
    }

    // Counter Animations
    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = element.textContent;
        const isNumber = /^\d+$/.test(target);
        
        if (isNumber) {
            const finalNumber = parseInt(target);
            let currentNumber = 0;
            const increment = finalNumber / 50;
            const duration = 2000;
            const stepTime = duration / 50;

            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    element.textContent = finalNumber + '+';
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(currentNumber) + '+';
                }
            }, stepTime);
        } else if (target.includes('/')) {
            // Handle ratings like "4.9/5"
            const [rating] = target.split('/');
            let currentRating = 0;
            const finalRating = parseFloat(rating);
            const increment = finalRating / 50;

            const timer = setInterval(() => {
                currentRating += increment;
                if (currentRating >= finalRating) {
                    element.textContent = target;
                    clearInterval(timer);
                } else {
                    element.textContent = currentRating.toFixed(1) + '/5';
                }
            }, 40);
        }
    }

    // Form Handling
    setupFormHandling() {
        const forms = document.querySelectorAll('form:not(#applicationForm)');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        });
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.showSuccessMessage(form);
            form.reset();
            
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            // Track form submission
            this.trackEvent('form_submit', { form: form.id || 'unknown' });
        }, 2000);
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Email validation
        else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        // Phone validation
        else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    showSuccessMessage(form) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                <h4 style="margin-bottom: 0.5rem;">✅ Success!</h4>
                <p>Your message has been sent successfully. We'll get back to you soon!</p>
            </div>
        `;
        
        form.parentNode.insertBefore(successMessage, form);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // Utility Functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Lazy loading for images
        this.setupLazyLoading();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Setup service worker (if available)
        this.setupServiceWorker();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    preloadCriticalResources() {
        const criticalResources = [
            '/css/modern-styles.css',
            '/js/modern-script.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    // Analytics & Tracking
    trackEvent(eventName, properties = {}) {
        // Console log for development
        console.log('Event tracked:', eventName, properties);
        
        // Here you would integrate with your analytics service
        // Example: Google Analytics, Mixpanel, etc.
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
    }

    // Theme Management
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                this.trackEvent('theme_toggle', { theme: newTheme });
            });
        }
    }

    // Accessibility Enhancements
    setupAccessibility() {
        // Skip to main content link
        this.addSkipLink();
        
        // Keyboard navigation for custom elements
        this.setupKeyboardNavigation();
        
        // Focus management
        this.setupFocusManagement();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-600);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupKeyboardNavigation() {
        // Add keyboard support for custom interactive elements
        document.querySelectorAll('.module-item, .feature-card').forEach(element => {
            element.setAttribute('tabindex', '0');
            element.setAttribute('role', 'button');
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    setupFocusManagement() {
        // Trap focus in mobile menu when open
        const navMenu = document.getElementById('navMenu');
        const focusableElements = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && navMenu?.classList.contains('active')) {
                const focusable = navMenu.querySelectorAll(focusableElements);
                const firstFocusable = focusable[0];
                const lastFocusable = focusable[focusable.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new SkillSquadApp();

    // Make app globally available for debugging
    window.SkillSquadApp = app;

    console.log('🚀 SkillSquad Academy loaded successfully!');
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Here you would send error reports to your monitoring service
});

// Performance monitoring
window.addEventListener('load', () => {
    // Measure and report performance metrics
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkillSquadApp;
}


document.addEventListener("DOMContentLoaded", () => {
    // --- Element Selection ---
    const categoryFilter = document.getElementById("category-filter");
    const durationFilter = document.getElementById("duration-filter");
    const courseGrid = document.getElementById("course-grid");
    const courseCards = courseGrid.querySelectorAll(".course-card");
    const noResultsMessage = document.getElementById("no-results-message");
  
    // For mobile responsive filters
    const mobileFilterToggle = document.getElementById("mobile-filter-toggle");
    const sidebar = document.querySelector(".filters-sidebar");
  
    // --- State Management ---
    let currentFilters = {
      category: "all",
      duration: "all",
    };
  
    // --- Main Filter Logic ---
    const filterCourses = () => {
      let visibleCoursesCount = 0;
  
      courseCards.forEach((card) => {
        const cardCategory = card.dataset.category;
        const cardDuration = card.dataset.duration;
  
        // Check if card matches current filters
        const categoryMatch =
          currentFilters.category === "all" ||
          currentFilters.category === cardCategory;
        const durationMatch =
          currentFilters.duration === "all" ||
          currentFilters.duration === cardDuration;
  
        if (categoryMatch && durationMatch) {
          card.classList.remove("hidden");
          visibleCoursesCount++;
        } else {
          card.classList.add("hidden");
        }
      });
  
      // Toggle the 'no results' message based on visibility count
      noResultsMessage.classList.toggle("hidden", visibleCoursesCount > 0);
    };
  
    // --- Generic Filter Event Handler ---
    const addFilterListener = (filterElement, filterKey) => {
      filterElement.addEventListener("click", (e) => {
        if (e.target && e.target.tagName === "LI") {
          // Update active class
          filterElement.querySelector(".active").classList.remove("active");
          e.target.classList.add("active");
  
          // Update filter state
          currentFilters[filterKey] = e.target.dataset[filterKey];
  
          // Re-run the filter function
          filterCourses();
        }
      });
    };
  
    addFilterListener(categoryFilter, "category");
    addFilterListener(durationFilter, "duration");
  
    // --- Mobile Filter Toggle ---
    mobileFilterToggle.addEventListener("click", () => {
      // The 'open' class will toggle 'display: block' on mobile
      sidebar.classList.toggle("open");
    });
  
    // Close all other forms when opening a new one
    function closeAllForms() {
      document.querySelectorAll(".enquiry-form-container").forEach((form) => {
        form.classList.remove("active");
      });
    }
  
    // Toggle form visibility
    document.querySelectorAll(".enquiry-btn").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const cardContent = this.closest(".card-content");
        const formContainer = cardContent.querySelector(
          ".enquiry-form-container"
        );
  
        // Close all forms first
        closeAllForms();
  
        // Toggle the current form
        formContainer.classList.toggle("active");
  
        // Scroll to the form if it's being opened
        if (formContainer.classList.contains("active")) {
          formContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
    });
  
    // Close form when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !e.target.closest(".enquiry-form-container") &&
        !e.target.classList.contains("enquiry-btn")
      ) {
        closeAllForms();
      }
    });
  
    // Form submission handling
    document.querySelectorAll(".enquiry-form form").forEach((form) => {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        // Here you would typically send the form data to your server
        alert("Form submitted successfully! We will contact you shortly.");
        this.reset();
        this.closest(".enquiry-form-container").classList.remove("active");
      });
    });
  });
  
