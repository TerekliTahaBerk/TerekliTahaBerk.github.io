/* ============================================================
   reveal.js — progressive-enhancement scroll reveal.
   Elements are fully visible by default (no JS / reduced motion /
   no IntersectionObserver support); only when all three are
   available do we hide-then-reveal them as they scroll into view.
============================================================ */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    els.forEach(function (el) { el.classList.add('pre-reveal'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('pre-reveal');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    els.forEach(function (el) { io.observe(el); });
  });
})();
