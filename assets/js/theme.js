/* ============================================================
   theme.js — theme toggle wiring (paired with the inline
   FOUC-prevention snippet that must stay inline in <head>).
============================================================ */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var btn = document.getElementById('theme');
    if (!btn) return;
    var icon = document.getElementById('theme-icon');
    var SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>';
    var MOON = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';

    function sync() {
      var isDark = document.documentElement.classList.contains('dark');
      if (icon) icon.innerHTML = isDark ? SUN : MOON;
      btn.setAttribute('aria-pressed', String(isDark));
    }
    sync();

    btn.addEventListener('click', function () {
      var root = document.documentElement;
      root.classList.toggle('dark');
      try {
        localStorage.setItem('tbt_theme', root.classList.contains('dark') ? 'dark' : 'light');
      } catch (e) {}
      sync();
    });
  });
})();
