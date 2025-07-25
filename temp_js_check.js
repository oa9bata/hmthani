
// ========== SECURITY WARNING ==========
console.log('%câڑ ï¸ڈ SEVERE SECURITY WARNING âڑ ï¸ڈ', 'color: #ff0000; font-size: 24px; font-weight: bold; background: #ffeeee; padding: 10px; border: 3px solid #ff0000;');
console.log('%cWARNING: This website is legally protected!', 'color: #ff0000; font-size: 18px; font-weight: bold;');
console.log('%cًںڑ¨ DEVELOPERS ONLY WARNING ًںڑ¨', 'color: #ff0000; font-size: 20px; font-weight: bold; text-decoration: underline;');
console.log('%cIf you are not an authorized developer, you are violating the law!', 'color: #ff0000; font-size: 16px; font-weight: bold;');
console.log('%cًں”’ Your IP address is logged and monitored: ' + window.location.hostname, 'color: #ff0000; font-size: 16px; font-weight: bold; background: #ffe6e6;');
console.log('%câڑ–ï¸ڈ Mathani Quranic Association - Protected under Saudi Law', 'color: #ff0000; font-size: 16px; font-weight: bold;');
console.log('%cAuthorized developers only - Under security surveillance', 'color: #ff0000; font-size: 14px; font-weight: bold;');
console.log('%c' + '='.repeat(80), 'color: #ff0000; font-weight: bold;');

// ========== SITE MANAGEMENT & ERROR HANDLING ==========
// Site closure check
function checkSiteClosure() {
    const isClosed = localStorage.getItem('mthani-site-closed') === 'true';
    if (isClosed && !window.location.pathname.includes('dashboard.html') && !window.location.pathname.includes('wait-for-us.html')) {
        window.location.href = 'wait-for-us.html';
        return false;
    }
    return true;
}

// Global error handler (only for critical errors)
window.onerror = function(message, source, lineno, colno, error) {
    console.error('JavaScript Error:', { message, source, lineno, colno, error });
    // Only redirect on critical errors, not minor ones
    if (message.includes('Script error') || message.includes('Network Error') || message.includes('Cannot read property')) {
        setTimeout(() => {
            window.location.href = 'error.html?code=js&msg=' + encodeURIComponent(message);
        }, 3000); // Increased delay to avoid false positives
    }
    return false;
};

// Unhandled promise rejection handler (only for critical rejections)
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    // Only redirect on critical promise rejections
    if (event.reason && (event.reason.toString().includes('Network') || event.reason.toString().includes('Failed to fetch'))) {
        setTimeout(() => {
            window.location.href = 'error.html?code=promise&msg=' + encodeURIComponent(event.reason);
        }, 3000);
    }
});

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Check site closure first
    if (!checkSiteClosure()) return;
    
    // ========== DROPDOWN MENU FUNCTIONALITY ==========
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('button');
        const content = dropdown.querySelector('.dropdown-content');
        
        // Show dropdown on mouse enter
        dropdown.addEventListener('mouseenter', function() {
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.querySelector('.dropdown-content').style.display = 'none';
                    otherDropdown.querySelector('button').setAttribute('aria-expanded', 'false');
                }
            });
            
            // Show current dropdown
            content.style.display = 'block';
            button.setAttribute('aria-expanded', 'true');
        });
        
        // Hide dropdown on mouse leave
        dropdown.addEventListener('mouseleave', function() {
            content.style.display = 'none';
            button.setAttribute('aria-expanded', 'false');
        });
        
        // Handle keyboard navigation for accessibility
        button.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });

    // ========== MOBILE MENU FUNCTIONALITY ==========
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
            
            // Reset all mobile dropdowns to hidden when opening menu
            if (!mobileMenu.classList.contains('hidden')) {
                const allMobileDropdowns = mobileMenu.querySelectorAll('.mobile-dropdown-content');
                allMobileDropdowns.forEach(dropdown => {
                    dropdown.classList.add('hidden');
                });
            }
        });
    }

    // ========== INTERACTIVE HERO CAROUSEL FUNCTIONALITY ==========
    class InteractiveCarousel {
        constructor() {
            this.slides = document.querySelectorAll('.hero-slide');
            this.dots = document.querySelectorAll('.carousel-dot');
            this.prevBtn = document.getElementById('prevSlide');
            this.nextBtn = document.getElementById('nextSlide');
            this.carousel = document.querySelector('.hero-carousel');
            
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            this.autoSlideDelay = 5000; // 5 seconds
            this.isPlaying = true;
            this.touchStartX = 0;
            this.touchEndX = 0;
            
            this.init();
        }
        
        init() {
            if (this.slides.length === 0) return;
            
            this.setupEventListeners();
            this.startAutoSlide();
            this.setupTouchEvents();
            this.setupKeyboardNavigation();
        }
        
        // Method to refresh carousel after dynamic content is loaded
        refresh() {
            // Stop any existing auto-slide
            this.pauseAutoSlide();
            
            // Re-query for slides and dots
            this.slides = document.querySelectorAll('.hero-slide');
            this.dots = document.querySelectorAll('.carousel-dot');
            this.currentSlide = 0;
            
            // Reinitialize if we have slides
            if (this.slides.length > 0) {
                this.init();
                console.log('Carousel refreshed with', this.slides.length, 'slides');
            } else {
                console.log('No slides found during carousel refresh');
            }
        }
        
        setupEventListeners() {
            // Arrow button clicks - REVERSED: Left arrow goes next, Right arrow goes previous
            this.prevBtn?.addEventListener('click', () => this.nextSlide()); // Left arrow = Next
            this.nextBtn?.addEventListener('click', () => this.prevSlide()); // Right arrow = Previous
            
            // Dot clicks
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    const direction = index > this.currentSlide ? 'next' : 'prev';
                    this.goToSlide(index, direction);
                });
            });
            
            // Pause on hover, resume on leave
            this.carousel?.addEventListener('mouseenter', () => this.pauseAutoSlide());
            this.carousel?.addEventListener('mouseleave', () => this.resumeAutoSlide());
            
            // Pause when page is hidden, resume when visible
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseAutoSlide();
                } else {
                    this.resumeAutoSlide();
                }
            });
        }
        
        setupTouchEvents() {
            if (!this.carousel) return;
            
            // Touch events for swipe navigation
            this.carousel.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            this.carousel.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });
            
            // Mouse events for desktop drag (optional)
            let isDragging = false;
            this.carousel.addEventListener('mousedown', (e) => {
                isDragging = true;
                this.touchStartX = e.clientX;
                e.preventDefault();
            });
            
            this.carousel.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
            });
            
            this.carousel.addEventListener('mouseup', (e) => {
                if (!isDragging) return;
                isDragging = false;
                this.touchEndX = e.clientX;
                this.handleSwipe();
            });
            
            this.carousel.addEventListener('mouseleave', () => {
                isDragging = false;
            });
        }
        
        setupKeyboardNavigation() {
            document.addEventListener('keydown', (e) => {
                if (document.activeElement && document.activeElement.closest('.hero-carousel')) {
                    switch(e.key) {
                        case 'ArrowLeft':
                            e.preventDefault();
                            this.nextSlide(); // Left arrow goes to next (reversed)
                            break;
                        case 'ArrowRight':
                            e.preventDefault();
                            this.prevSlide(); // Right arrow goes to previous (reversed)
                            break;
                        case ' ':
                            e.preventDefault();
                            this.toggleAutoSlide();
                            break;
                    }
                }
            });
        }
        
        handleSwipe() {
            const swipeThreshold = 50; // Minimum distance for swipe
            const diff = this.touchStartX - this.touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swiped left - go to next slide
                    this.nextSlide();
                } else {
                    // Swiped right - go to previous slide
                    this.prevSlide();
                }
            }
        }
        
        showSlide(index, direction = 'next') {
            if (index === this.currentSlide) return;
            
            const currentSlideElement = this.slides[this.currentSlide];
            const nextSlideElement = this.slides[index];
            
            // Remove all transition classes first
            this.slides.forEach(slide => {
                slide.classList.remove('active', 'slide-out-left', 'slide-out-right');
            });
            
            // Set the animation direction
            if (direction === 'next') {
                // Current slide moves out to left, next slide comes from right
                currentSlideElement?.classList.add('slide-out-left');
                nextSlideElement?.classList.remove('slide-out-right');
                nextSlideElement?.classList.add('active');
            } else {
                // Current slide moves out to right, next slide comes from left  
                currentSlideElement?.classList.add('slide-out-right');
                nextSlideElement?.classList.remove('slide-out-left');
                nextSlideElement?.classList.add('active');
            }
            
            // Update dots
            this.dots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === index) {
                    dot.classList.add('active');
                }
            });
            
            this.currentSlide = index;
        }
        
        nextSlide() {
            const next = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(next, 'next');
        }
        
        prevSlide() {
            const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.goToSlide(prev, 'prev');
        }
        
        goToSlide(index, direction = 'next') {
            if (index >= 0 && index < this.slides.length) {
                this.showSlide(index, direction);
                this.restartAutoSlide(); // Restart timer when manually navigated
            }
        }
        

        
        startAutoSlide() {
            if (this.slides.length <= 1) return;
            
            this.autoSlideInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoSlideDelay);
            
            this.isPlaying = true;
            this.carousel?.classList.remove('paused');
        }
        
        pauseAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
            this.isPlaying = false;
            this.carousel?.classList.add('paused');
        }
        
        resumeAutoSlide() {
            if (!this.isPlaying && this.slides.length > 1) {
                this.startAutoSlide();
            }
        }
        
        restartAutoSlide() {
            this.pauseAutoSlide();
            this.startAutoSlide();
        }
        
        toggleAutoSlide() {
            if (this.isPlaying) {
                this.pauseAutoSlide();
            } else {
                this.resumeAutoSlide();
            }
        }
    }
    

    // ========== NEWS TICKER FUNCTIONALITY ==========
    const newsTicker = document.getElementById('news-ticker');
    if (newsTicker) {
        let tickerPosition = 0;
        const tickerSpeed = 1;

        function animateTicker() {
            tickerPosition -= tickerSpeed;
            if (tickerPosition <= -newsTicker.offsetWidth) {
                tickerPosition = newsTicker.parentElement.offsetWidth;
            }
            newsTicker.style.transform = `translateX(${tickerPosition}px)`;
            requestAnimationFrame(animateTicker);
        }

        animateTicker();
    }

    // ========== MEDIA TABS FUNCTIONALITY ==========
    const mediaTabs = document.querySelectorAll('.media-tab');
    const mediaContents = document.querySelectorAll('.media-content');

    mediaTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Update active tab
            mediaTabs.forEach(t => t.classList.remove('active', 'bg-white', 'text-[#432d17]'));
            this.classList.add('active', 'bg-white', 'text-[#432d17]');
            
            // Show/hide content
            mediaContents.forEach(content => {
                if (content.id === targetTab) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    // ========== LIGHTBOX FUNCTIONALITY ==========
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    let lightboxModal = null;

    function createLightbox(src, title) {
        // Remove existing lightbox if any
        if (lightboxModal) {
            lightboxModal.remove();
        }

        // Create lightbox modal
        lightboxModal = document.createElement('div');
        lightboxModal.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4';
        lightboxModal.innerHTML = `
            <div class="relative max-w-4xl max-h-full">
                <img src="${src}" alt="${title}" class="max-w-full max-h-full object-contain">
                <button class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 lightbox-close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-4 py-2 rounded">
                    <h3 class="font-semibold">${title}</h3>
                </div>
            </div>
        `;

        document.body.appendChild(lightboxModal);

        // Close lightbox functionality
        const closeBtn = lightboxModal.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', closeLightbox);
        
        lightboxModal.addEventListener('click', function(e) {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });
    }

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.remove();
            lightboxModal = null;
        }
    }

    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const src = this.dataset.src;
            const title = this.querySelector('h3').textContent;
            createLightbox(src, title);
        });
    });

    //  COUNTER ANIMATION 
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                let duration = Math.min(4000, Math.max(1200, target * 10)); 
                if (target > 10000) duration = Math.min(6000, target * 0.2); 
                const step = target / (duration / 16); // 60fps
                let current = 0;

                counter.style.transition = 'transform 0.3s cubic-bezier(.68,-0.55,.27,1.55), color 0.3s';
                counter.style.transform = 'scale(1.2)';
                counter.style.color = 'white';

                setTimeout(() => {
                    counter.style.transform = 'scale(1)';
                }, 300);

                const updateCounter = () => {
                    if (current < target) {
                        current += step;
                        counter.textContent = Math.floor(current).toLocaleString('en-US');
                        if (target > 0 && Math.abs(current % (target / 5)) < step) {
                            counter.style.transform = 'scale(1.15)';
                            setTimeout(() => {
                                counter.style.transform = 'scale(1)';
                            }, 120);
                        }
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString('en-US');
                        counter.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            counter.style.transform = 'scale(1)';
                        }, 200);
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // PARTNERS CAROUSEL
    const partnerScroll = document.querySelector('.partner-scroll');
    if (partnerScroll) {
        let scrollPosition = 0;
        const scrollSpeed = 1;

        function animatePartners() {
            scrollPosition -= scrollSpeed;
            if (scrollPosition <= -partnerScroll.scrollWidth / 2) {
                scrollPosition = 0;
            }
            partnerScroll.style.transform = `translateX(${scrollPosition}px)`;
            requestAnimationFrame(animatePartners);
        }

        animatePartners();
    }

    // FADE IN ANIMATION
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element is in view - animate in
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                // Element is out of view - reset for next animation
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(element);
    });

    // SCROLL TO TOP FUNCTIONALITY 
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'fixed bottom-6 left-6 bg-[#00a17d] text-white w-12 h-12 rounded-full shadow-lg hover:bg-[#00a17d]/80 transition-all duration-300 z-50 scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.style.display = 'none';
    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
            scrollToTopBtn.style.alignItems = 'center';
            scrollToTopBtn.style.justifyContent = 'center';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    // ========== SMOOTH SCROLLING FOR ANCHOR LINKS ==========
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========== SERVICE CARDS INTERACTIONS ==========
    const serviceCards = document.querySelectorAll('.hero-content .grid > div, .grid.grid-cols-2.md\\:grid-cols-4.lg\\:grid-cols-6 > div');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('h3').textContent;
            alert(`ط³ظٹطھظ… طھظˆط¬ظٹظ‡ظƒظ… ط¥ظ„ظ‰ طµظپط­ط© ${serviceName} ظ‚ط±ظٹط¨ط§ظ‹`);
        });
    });

    // ========== ACCESSIBILITY ENHANCEMENTS ==========
    
    // Keyboard navigation for dropdowns
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('button');
        const links = dropdown.querySelectorAll('a');
        
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const content = dropdown.querySelector('.dropdown-content');
                if (content.style.display === 'block') {
                    const firstLink = content.querySelector('a');
                    if (firstLink) firstLink.focus();
                }
            }
        });

        links.forEach((link, index) => {
            link.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextLink = links[index + 1];
                    if (nextLink) nextLink.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevLink = links[index - 1];
                    if (prevLink) {
                        prevLink.focus();
                    } else {
                        button.focus();
                    }
                } else if (e.key === 'Escape') {
                    dropdown.querySelector('.dropdown-content').style.display = 'none';
                    button.setAttribute('aria-expanded', 'false');
                    button.focus();
                }
            });
        });
    });

    // ========== MOBILE MENU DROPDOWN FUNCTIONALITY ==========
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
    mobileDropdowns.forEach(drop => {
        const btn = drop.querySelector('button');
        const content = drop.querySelector('.mobile-dropdown-content');
        
        // Handle dropdown button click (show/hide dropdown within mobile menu)
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close other dropdowns
            mobileDropdowns.forEach(other => {
                if (other !== drop) {
                    other.querySelector('.mobile-dropdown-content').classList.add('hidden');
                }
            });
            
            // Toggle current dropdown
            content.classList.toggle('hidden');
        });
        
        const dropdownLinks = content.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
                
                mobileDropdowns.forEach(dropdown => {
                    dropdown.querySelector('.mobile-dropdown-content').classList.add('hidden');
                });
            });
        });
    });

    // ========== MOBILE MENU REGULAR LINKS ==========
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Close mobile menu when regular link is clicked
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // ========== PERFORMANCE OPTIMIZATIONS ==========
    
    // Lazy loading for images (if supported)
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
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

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ========== ERROR HANDLING ==========
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // Could send error to logging service here
    });

    // ========== INITIALIZATION COMPLETE ==========
    
    // Dispatch custom event to indicate site is ready
    const siteReadyEvent = new CustomEvent('siteReady', {
        detail: { message: 'ط§ظ„ظ…ظˆظ‚ط¹ ط¬ط§ظ‡ط² ظ„ظ„ط§ط³طھط®ط¯ط§ظ…' }
    });
    document.dispatchEvent(siteReadyEvent);
});

// ========== UTILITY FUNCTIONS ==========

// Function to format numbers in Arabic
function formatArabicNumber(number) {
    return number.toString().replace(/\d/g, function(d) {
        return 'ظ ظ،ظ¢ظ£ظ¤ظ¥ظ¦ظ§ظ¨ظ©'[d];
    });
}

// Function to handle RTL text direction
function handleRTL() {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
}

// Function to detect if user prefers reduced motion
function respectsReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Apply reduced motion preferences
if (respectsReducedMotion()) {
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}; 

// Load 6 random news cards from database for homepage ticker
(async function() {
    const ticker = document.getElementById('homepage-news-ticker');
    if (!ticker) return;
    
    try {
        // Show loading state
        ticker.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6 text-center flex-shrink-0" style="min-width: 320px;">
                <i class="fas fa-spinner fa-spin text-gray-400 text-4xl mb-2"></i>
                <h3 class="text-lg font-bold text-gray-800 mb-2">ط¬ط§ط±ظٹ طھط­ظ…ظٹظ„ ط§ظ„ط£ط®ط¨ط§ط±...</h3>
            </div>
        `;
        
        const savedNews = await databaseService.getAllNews();
    
    if (savedNews.length === 0) {
        ticker.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6 text-center flex-shrink-0" style="min-width: 320px;">
                <i class="fas fa-newspaper text-gray-400 text-4xl mb-2"></i>
                <h3 class="text-lg font-bold text-gray-800 mb-2">ظ„ط§ طھظˆط¬ط¯ ط£ط®ط¨ط§ط±</h3>
                <p class="text-gray-600 text-sm">ط³ظٹطھظ… ط¹ط±ط¶ ط§ظ„ط£ط®ط¨ط§ط± ظ‡ظ†ط§ ط¹ظ†ط¯ ط¥ط¶ط§ظپطھظ‡ط§ ظ…ظ† ظ„ظˆط­ط© ط§ظ„طھط­ظƒظ…</p>
            </div>
        `;
        return;
    }
    
    // Shuffle and pick 6
    const shuffled = [...savedNews];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected = shuffled.slice(0, 6);
    
    // Format date function
    function formatDate(dateString) {
        const date = new Date(dateString);
        const months = ['ظٹظ†ط§ظٹط±','ظپط¨ط±ط§ظٹط±','ظ…ط§ط±ط³','ط§ط¨ط±ظٹظ„','ظ…ط§ظٹظˆ','ظٹظˆظ†ظٹظˆ','ظٹظˆظ„ظٹظˆ','ط§ط؛ط³ط·ط³','ط³ط¨طھظ…ط¨ط±','ط§ظƒطھظˆط¨ط±','ظ†ظˆظپظ…ط¨ط±','ط¯ظٹط³ظ…ط¨ط±'];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    
    // Check if we should animate (more than 3 cards)
    const shouldAnimate = selected.length > 3;
    
    // Remove animation class if not needed
    const tickerContainer = ticker.parentElement;
    if (shouldAnimate) {
        ticker.classList.add('news-scroll');
        // Duplicate cards for smooth infinite scroll like partners
        const allCards = [...selected, ...selected];
        
        // Generate cards HTML
        ticker.innerHTML = allCards.map(newsItem => {
            const TEXT_LIMIT = 100; // Shorter limit for homepage cards
            const mainText = newsItem.mainText || '';
            const excerptText = mainText.length > TEXT_LIMIT ? mainText.substring(0, TEXT_LIMIT) + '...' : mainText;
            
            return `
                <article class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex-shrink-0" style="min-width: 320px; max-width: 340px;">
                    <img src="${newsItem.image}" alt="${newsItem.title}" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">${newsItem.title}</h3>
                        <p class="text-gray-600 text-sm mb-3 line-clamp-3">${excerptText}</p>
                        <div class="text-xs text-gray-500">${formatDate(newsItem.date)}</div>
                    </div>
                </article>
            `;
        }).join('');
    } else {
        ticker.classList.remove('news-scroll');
        ticker.style.justifyContent = 'center';
        ticker.style.gap = '2rem';
        
        // Generate cards HTML without duplication
        ticker.innerHTML = selected.map(newsItem => {
            const TEXT_LIMIT = 100; // Shorter limit for homepage cards
            const mainText = newsItem.mainText || '';
            const excerptText = mainText.length > TEXT_LIMIT ? mainText.substring(0, TEXT_LIMIT) + '...' : mainText;
            
            return `
                <article class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex-shrink-0" style="min-width: 320px; max-width: 340px;">
                    <img src="${newsItem.image}" alt="${newsItem.title}" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">${newsItem.title}</h3>
                        <p class="text-gray-600 text-sm mb-3 line-clamp-3">${excerptText}</p>
                        <div class="text-xs text-gray-500">${formatDate(newsItem.date)}</div>
                    </div>
                </article>
            `;
        }).join('');
    }
    } catch (error) {
        console.error('Error loading news for homepage:', error);
        ticker.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6 text-center flex-shrink-0" style="min-width: 320px;">
                <i class="fas fa-exclamation-triangle text-red-400 text-4xl mb-2"></i>
                <h3 class="text-lg font-bold text-red-800 mb-2">ط®ط·ط£ ظپظٹ طھط­ظ…ظٹظ„ ط§ظ„ط£ط®ط¨ط§ط±</h3>
                <p class="text-gray-600 text-sm">طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ</p>
            </div>
        `;
    }
})();

    // ========== DYNAMIC CAROUSEL LOADING FROM DATABASE ==========
    async function loadCarouselFromDatabase() {
        try {
            console.log('Loading carousel images from database...');
            const images = await databaseService.getAllCarouselImages();
            const activeImages = images.filter(img => img.is_active);
            
            console.log('Found', activeImages.length, 'active carousel images');
            
            const carousel = document.querySelector('.hero-carousel');
            const dotsContainer = document.querySelector('.carousel-dots');
            
            if (!carousel || !dotsContainer) {
                console.error('Carousel containers not found');
                return false;
            }
            
            // Clear existing slides (if any)
            const existingSlides = carousel.querySelectorAll('.hero-slide');
            existingSlides.forEach(slide => slide.remove());
            
            // Clear existing dots
            dotsContainer.innerHTML = '';
            
            if (activeImages.length === 0) {
                console.log('No active images found, using fallback');
                // Fallback to default image if no database images
                const fallbackSlide = document.createElement('div');
                fallbackSlide.className = 'hero-slide active';
                fallbackSlide.innerHTML = '<img src="assets/hdr-background.jpg" alt="طµظˆط±ط© ط§ظپطھط±ط§ط¶ظٹط©" class="carousel-image">';
                
                // Insert before navigation arrows
                const prevBtn = carousel.querySelector('#prevSlide');
                carousel.insertBefore(fallbackSlide, prevBtn);
                
                // Add single dot
                const dot = document.createElement('button');
                dot.className = 'carousel-dot active';
                dot.setAttribute('data-slide', '0');
                dot.setAttribute('aria-label', 'ط§ظ„ط´ط±ظٹط­ط© 1');
                dotsContainer.appendChild(dot);
                
                return true;
            }
            
            // Add database images as slides
            activeImages.forEach((image, index) => {
                // Create slide
                const slide = document.createElement('div');
                slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
                slide.innerHTML = `<img src="${image.image_url}" alt="${image.alt_text || 'طµظˆط±ط© ط§ظ„ط¨ط·ظ„'}" class="carousel-image">`;
                
                // Insert before navigation arrows
                const prevBtn = carousel.querySelector('#prevSlide');
                carousel.insertBefore(slide, prevBtn);
                
                // Create dot
                const dot = document.createElement('button');
                dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
                dot.setAttribute('data-slide', index.toString());
                dot.setAttribute('aria-label', `ط§ظ„ط´ط±ظٹط­ط© ${index + 1}`);
                dotsContainer.appendChild(dot);
            });
            
            console.log('Carousel images loaded successfully');
            return true;
            
        } catch (error) {
            console.error('Error loading carousel from database:', error);
            // Fallback to default image on error
            const carousel = document.querySelector('.hero-carousel');
            const dotsContainer = document.querySelector('.carousel-dots');
            
            if (carousel && dotsContainer) {
                const fallbackSlide = document.createElement('div');
                fallbackSlide.className = 'hero-slide active';
                fallbackSlide.innerHTML = '<img src="assets/hdr-background.jpg" alt="طµظˆط±ط© ط§ظپطھط±ط§ط¶ظٹط©" class="carousel-image">';
                
                const prevBtn = carousel.querySelector('#prevSlide');
                carousel.insertBefore(fallbackSlide, prevBtn);
                
                const dot = document.createElement('button');
                dot.className = 'carousel-dot active';
                dot.setAttribute('data-slide', '0');
                dot.setAttribute('aria-label', 'ط§ظ„ط´ط±ظٹط­ط© 1');
                dotsContainer.appendChild(dot);
            }
            return false;
        }
    }
    
    // Load carousel images and then initialize carousel
    (async function initializeCarousel() {
        // Initialize carousel first (it will be empty initially)
        const heroCarousel = new InteractiveCarousel();
        // Make it globally accessible
        window.heroCarousel = heroCarousel;
        
        // Load images from database
        await loadCarouselFromDatabase();
        
        // Refresh carousel with loaded images
        heroCarousel.refresh();
    })();

    
