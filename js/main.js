/**
 * Abhay Pandey Portfolio - Main JavaScript
 * Handles theme toggle, navigation, and scroll animations
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const html = document.documentElement;
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('themeToggle');
    const fadeElements = document.querySelectorAll('.fade-in');

    // ========================================
    // Theme Management
    // ========================================
    const THEME_KEY = 'portfolio-theme';

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function getSavedTheme() {
        return localStorage.getItem(THEME_KEY);
    }

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    function initTheme() {
        const savedTheme = getSavedTheme();
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            // Use system preference if no saved theme
            setTheme(getSystemTheme());
        }
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!getSavedTheme()) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ========================================
    // Navigation - Scroll Effect
    // ========================================
    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ========================================
    // Mobile Navigation Toggle
    // ========================================
    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileNav() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ========================================
    // Smooth Scroll for Navigation Links
    // ========================================
    function handleNavClick(e) {
        const href = this.getAttribute('href');

        // Only handle internal links
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Close mobile nav if open
                closeMobileNav();

                // Calculate offset for fixed navbar
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    // ========================================
    // Intersection Observer for Fade Animations
    // ========================================
    function initFadeAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ========================================
    // Active Navigation Link Highlighting
    // ========================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ========================================
    // Back to Top Button
    // ========================================
    function handleBackToTop(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ========================================
    // Keyboard Navigation
    // ========================================
    function handleKeyboard(e) {
        // Close mobile nav on Escape
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileNav();
        }
    }

    // ========================================
    // Initialize
    // ========================================
    function init() {
        // Initialize theme
        initTheme();

        // Theme toggle
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        // Scroll events
        window.addEventListener('scroll', handleNavScroll, { passive: true });
        window.addEventListener('scroll', updateActiveNavLink, { passive: true });

        // Navigation
        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileNav);
        }

        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        // Back to top
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            backToTop.addEventListener('click', handleBackToTop);
        }

        // Keyboard
        document.addEventListener('keydown', handleKeyboard);

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !navToggle.contains(e.target)) {
                closeMobileNav();
            }
        });

        // Initialize animations
        initFadeAnimations();

        // Initial check for scroll position
        handleNavScroll();
        updateActiveNavLink();

        // Add visible class to hero elements immediately
        const heroElements = document.querySelectorAll('.hero .fade-in');
        setTimeout(() => {
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 100);
            });
        }, 100);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
