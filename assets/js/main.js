/* Chanpheng's Mandarin Cuisine — site interactivity
   Three things only:
   1. Menu tab switching
   2. Marquee click-to-step arrows (continuous scroll is pure CSS)
   3. Scroll-reveal on [data-reveal] sections (adds .is-visible)
   No framework. No dependencies. Loaded with `defer`.
*/
(function () {
  'use strict';

  // -------- 1. Menu tabs --------
  function initMenuTabs() {
    var tabs = document.querySelectorAll('.menu__tabs .tab');
    var panels = document.querySelectorAll('.menu__panels .menu-panel');
    if (!tabs.length || !panels.length) return;

    function activate(idx) {
      tabs.forEach(function (t, i) {
        t.classList.toggle('is-active', i === idx);
        t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
        t.setAttribute('tabindex', i === idx ? '0' : '-1');
      });
      panels.forEach(function (p, i) {
        p.classList.toggle('is-active', i === idx);
        p.hidden = i !== idx;
      });
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { activate(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); var n = (i + 1) % tabs.length; tabs[n].focus(); activate(n); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); var p = (i - 1 + tabs.length) % tabs.length; tabs[p].focus(); activate(p); }
      });
    });
  }

  // -------- 2. Marquee click-arrows --------
  // CSS handles continuous scroll + hover-pause. JS just lets the arrows nudge.
  function initMarquee() {
    var track = document.querySelector('.marquee__track');
    var marquee = document.querySelector('.marquee');
    var prev = document.querySelector('[data-marquee-prev]');
    var next = document.querySelector('[data-marquee-next]');
    if (!track || !marquee) return;

    var tiles = Array.from(track.children);
    var SETN = Math.floor(tiles.length / 3); // we render the dish list 3× for seamless loop
    if (SETN < 1) return;

    // The CSS animation runs by transforming -33.333% over a fixed duration.
    // To support manual stepping, we switch from CSS animation to a JS-driven transform
    // the moment an arrow is first pressed, and from then on use a manual offset.
    var manual = false;
    var offset = 0; // px

    function measure() {
      var sum = 0;
      var bounds = [0];
      for (var i = 0; i < SETN; i++) {
        sum += tiles[i].offsetWidth + 16; // 16 = gap
        bounds.push(sum);
      }
      return { setW: sum, bounds: bounds };
    }

    function enterManualMode() {
      if (manual) return;
      manual = true;
      track.classList.add('is-paused');
      // Convert the current CSS-driven transform position into our manual offset
      var t = window.getComputedStyle(track).transform;
      var m = /matrix\(([^)]+)\)/.exec(t);
      if (m) {
        var parts = m[1].split(',').map(parseFloat);
        offset = -parts[4]; // tx
      }
      apply();
    }

    function apply() {
      var info = measure();
      // Wrap offset into [0, setW)
      offset = ((offset % info.setW) + info.setW) % info.setW;
      track.style.transform = 'translateX(' + (-offset) + 'px)';
    }

    function step(dir) {
      enterManualMode();
      var info = measure();
      if (dir > 0) {
        var nb = info.bounds.find(function (b) { return b > offset + 1; });
        offset = nb !== undefined ? nb : info.setW;
      } else {
        var pb = null;
        for (var i = info.bounds.length - 1; i >= 0; i--) {
          if (info.bounds[i] < offset - 1) { pb = info.bounds[i]; break; }
        }
        offset = pb !== null ? pb : info.bounds[info.bounds.length - 1] - info.setW;
      }
      apply();
    }

    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });

    window.addEventListener('resize', function () { if (manual) apply(); });
  }

  // -------- 3. Scroll reveal --------
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    els.forEach(function (el) { el.classList.add('reveal'); });

    var show = function (el) { el.classList.add('is-visible'); };

    if (!('IntersectionObserver' in window)) {
      els.forEach(show);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          show(e.target);
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    els.forEach(function (el) { io.observe(el); });

    // Safety net: if a section is still hidden after 4s (e.g. user opens deep link,
    // or browser quirk prevents IO from firing), force it visible.
    setTimeout(function () {
      els.forEach(function (el) {
        if (!el.classList.contains('is-visible')) show(el);
      });
    }, 4000);
  }

  // -------- boot --------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initMenuTabs();
      initMarquee();
      initReveal();
    });
  } else {
    initMenuTabs();
    initMarquee();
    initReveal();
  }
})();
