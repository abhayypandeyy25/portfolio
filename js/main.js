/**
 * Abhay Pandey Portfolio — Main JS
 * Navigation, scroll animations, and email-capture forms.
 */

(function () {
    'use strict';

    var navbar = document.getElementById('navbar');
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    var navLinks = document.querySelectorAll('.nav-link');

    var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzUg80aGDZ_eT4_dlEnN9_5SjZrDIcvlcy9G9ze8pvjGjTTogZqYUJnnXgUmFYR0Wjrag/exec';
    var GITHUB_REPO_URL = 'https://github.com/abhayypandeyy25/ai-leadership-team';
    var DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1woJgTqyq57mYc14mLI50BzmQXsUgVcI5?usp=sharing';

    // ---- Navigation ----
    function handleNavScroll() {
        if (window.scrollY > 20) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }

    function closeMobileNav() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    function toggleMobileNav() {
        var open = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = open ? 'hidden' : '';
    }

    function handleNavClick(e) {
        var href = this.getAttribute('href');
        if (href && href.charAt(0) === '#') {
            e.preventDefault();
            var target = document.getElementById(href.substring(1));
            if (target) {
                closeMobileNav();
                var top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 8;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        }
    }

    function updateActiveNavLink() {
        var sections = document.querySelectorAll('section[id], header[id]');
        var pos = window.scrollY + navbar.offsetHeight + 120;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            if (pos >= top && pos < top + section.offsetHeight) {
                var id = section.getAttribute('id');
                navLinks.forEach(function (link) {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }

    // ---- Fade-in animations ----
    function initFadeAnimations() {
        var els = document.querySelectorAll('.fade-in');
        if (!('IntersectionObserver' in window)) {
            els.forEach(function (el) { el.classList.add('visible'); });
            return;
        }
        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
        els.forEach(function (el) { observer.observe(el); });
    }

    // ---- Email capture ----
    // Posts to Google Sheets, then opens the destination in a new tab.
    function wireForm(formId, opts) {
        var form = document.getElementById(formId);
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = document.getElementById(opts.inputId);
            var email = input.value;
            var btn = form.querySelector('button');
            var original = btn.textContent;
            btn.textContent = 'Sending…';
            btn.disabled = true;

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'email=' + encodeURIComponent(email) + '&source=' + encodeURIComponent(opts.source)
            }).then(function () {
                form.style.display = 'none';
                var note = document.getElementById(opts.noteId);
                if (note) note.style.display = 'none';
                var success = document.getElementById(opts.successId);
                if (success) success.style.display = 'block';
                setTimeout(function () { window.open(opts.dest, '_blank'); }, 800);
            }).catch(function () {
                btn.textContent = original;
                btn.disabled = false;
                alert('Something went wrong. Please try again.');
            });
        });
    }

    // ---- Init ----
    function init() {
        window.addEventListener('scroll', handleNavScroll, { passive: true });
        window.addEventListener('scroll', updateActiveNavLink, { passive: true });

        if (navToggle) navToggle.addEventListener('click', toggleMobileNav);
        navLinks.forEach(function (link) { link.addEventListener('click', handleNavClick); });

        var backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            backToTop.addEventListener('click', function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMobileNav();
        });
        document.addEventListener('click', function (e) {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMobileNav();
            }
        });

        // AI Leadership Team (hero + free-value section)
        wireForm('aiTeamForm', { inputId: 'aiTeamEmail', noteId: 'aiTeamPrivacy', successId: 'aiTeamSuccess', source: 'ai-leadership-team', dest: GITHUB_REPO_URL });
        wireForm('aiTeamForm2', { inputId: 'aiTeamEmail2', noteId: 'aiTeamPrivacy2', successId: 'aiTeamSuccess2', source: 'ai-leadership-team', dest: GITHUB_REPO_URL });
        // PM Advisor & Coach
        wireForm('pmPluginForm', { inputId: 'pmPluginEmail', noteId: 'pmPrivacy', successId: 'pmSuccess', source: 'pm-plugins', dest: DRIVE_FOLDER_URL });

        initFadeAnimations();
        handleNavScroll();
        updateActiveNavLink();

        // Reveal hero immediately
        var heroEls = document.querySelectorAll('.hero .fade-in');
        heroEls.forEach(function (el, i) {
            setTimeout(function () { el.classList.add('visible'); }, 80 + i * 90);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
