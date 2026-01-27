// Enhanced Animations - Mobile Optimized
(function () {
    'use strict';

    const isMobile = window.innerWidth <= 768;
    const isTouch = 'ontouchstart' in window;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll Progress Indicator
    function updateScrollProgress() {
        const progress = document.getElementById('scrollProgress');
        if (!progress) return;
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY / windowHeight;
        progress.style.transform = 'scaleX(' + scrolled + ')';
    }

    // Particle System (Desktop Only)
    if (!isMobile && !reducedMotion) {
        const container = document.getElementById('particlesContainer');
        if (container) {
            for (let i = 0; i < 25; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                const size = Math.random() * 4 + 2;
                const duration = Math.random() * 15 + 10;
                const delay = Math.random() * 5;
                const drift = (Math.random() - 0.5) * 100;
                particle.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (Math.random() * 100) + '%;animation-duration:' + duration + 's;animation-delay:' + delay + 's;--drift:' + drift + 'px';
                container.appendChild(particle);
            }
        }
    }

    // Parallax Effect
    let ticking = false;
    function updateParallax() {
        if (reducedMotion) return;
        const scrolled = window.scrollY;
        document.querySelectorAll('.parallax-element').forEach(function (element) {
            const speed = element.dataset.parallaxSpeed || 0.5;
            element.style.transform = 'translateY(' + (-(scrolled * speed)) + 'px)';
        });
        ticking = false;
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // 3D Card Tilt (Desktop Only)
    // 3D Card Tilt (Desktop Only) - Smoothed with Lerp
    if (!isTouch && !reducedMotion) {
        const cards = document.querySelectorAll('.card-3d');
        const cardStates = new Map();

        // Helper: Linear Interpolation
        function lerp(start, end, factor) {
            return start + (end - start) * factor;
        }

        function updateCard(card) {
            const state = cardStates.get(card);
            if (!state) return;

            // Interpolate
            state.currentX = lerp(state.currentX, state.targetX, 0.2);
            state.currentY = lerp(state.currentY, state.targetY, 0.2);

            // Apply transform
            card.style.setProperty('--rotate-x', state.currentY.toFixed(2) + 'deg');
            card.style.setProperty('--rotate-y', state.currentX.toFixed(2) + 'deg');

            // Check if animation should continue
            const delta = Math.abs(state.targetX - state.currentX) + Math.abs(state.targetY - state.currentY);

            if (delta > 0.05) {
                state.frameId = requestAnimationFrame(() => updateCard(card));
            } else {
                state.frameId = null;
            }
        }

        function startCardAnimation(card) {
            const state = cardStates.get(card);
            if (state && !state.frameId) {
                state.frameId = requestAnimationFrame(() => updateCard(card));
            }
        }

        cards.forEach(function (card) {
            // Initialize state
            cardStates.set(card, {
                currentX: 0,
                currentY: 0,
                targetX: 0,
                targetY: 0,
                frameId: null
            });

            card.addEventListener('mousemove', function (e) {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;

                const state = cardStates.get(card);
                if (state) {
                    state.targetX = x;
                    state.targetY = y;
                    startCardAnimation(card);
                }
            });

            card.addEventListener('mouseleave', function () {
                const state = cardStates.get(card);
                if (state) {
                    state.targetX = 0;
                    state.targetY = 0;
                    startCardAnimation(card);
                }
            });
        });

        // Magnetic Buttons
        document.querySelectorAll('.magnetic-btn').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                const rect = btn.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
                btn.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.transform = '';
            });
        });
    }

    // Scroll-Triggered Animations
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Find card-3d (could be the target or a child)
                const card3d = entry.target.classList.contains('card-3d') ?
                    entry.target :
                    entry.target.querySelector('.card-3d');

                if (card3d) {
                    setTimeout(function () {
                        // Keep other transitions but exclude transform to allow smooth JS tilt
                        card3d.style.transition = 'opacity 0.6s, background 0.5s, border-color 0.5s, color 0.3s, box-shadow 0.3s';
                    }, 750);
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stagger-item').forEach(function (item) {
        observer.observe(item);
    });

    // Navbar Scroll Effect
    function updateNavbar() {
        const navbar = document.querySelector('nav');
        if (!navbar) return;
        if (window.scrollY > 100) {
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.backdropFilter = '';
            navbar.style.background = '';
            navbar.style.boxShadow = '';
        }
    }

    // Active Section Highlighting
    function updateActiveSection() {
        var current = '';
        document.querySelectorAll('section[id]').forEach(function (section) {
            if (window.scrollY >= section.offsetTop - 200) {
                current = section.id;
            }
        });
        document.querySelectorAll('nav a[href^="#"]').forEach(function (link) {
            var isActive = link.getAttribute('href') === '#' + current;
            link.classList.toggle('text-white', isActive);
            if (!isTouch) {
                link.style.transform = isActive ? 'scale(1.05)' : '';
            }
        });
    }

    // Event Listeners
    var scrollTimeout;
    window.addEventListener('scroll', function () {
        updateScrollProgress();
        requestParallaxUpdate();
        updateNavbar();
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveSection, 100);
    }, { passive: true });

    // Initialize
    updateScrollProgress();
    updateActiveSection();

    // Reinitialize Lucide icons after all content loads
    if (typeof lucide !== 'undefined') {
        setTimeout(function () {
            lucide.createIcons();
        }, 100);
    }

    console.log('Enhanced Animations loaded successfully!');
})();
