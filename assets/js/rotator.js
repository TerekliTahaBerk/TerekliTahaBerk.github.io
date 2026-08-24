/* ============================================================
   rotator.js — cycles the highlighted word in the hero headline,
   swapping both the text and its pill color. Each word is a real
   variation on "run it ___", tying back to the idempotency theme
   rather than being decorative. The pill's width is measured and
   animated explicitly (rather than left to reflow) so every word
   sits centered and evenly padded, matching the weight of the
   surrounding headline instead of jumping around. Falls back to a
   single static word if JS is unavailable or the user prefers
   reduced motion.
============================================================ */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var word = document.getElementById('rotate-word');
    if (!word) return;
    var pill = word.closest('.hl-pill');
    if (!pill) return;

    var frames = [
      { text: 'twice',     c: 'orange' },
      { text: 'again',     c: 'blue' },
      { text: 'cold',      c: 'purple' },
      { text: 'at 3am',    c: 'pink' },
      { text: 'next year', c: 'green' }
    ];

    // Measures the pill's natural width for whatever text is currently
    // in `word` by briefly releasing the fixed width, reading layout,
    // then restoring it — done synchronously so nothing is ever
    // painted mid-measurement.
    function lockWidthToContent() {
      pill.style.width = '';
      var natural = pill.getBoundingClientRect().width;
      pill.style.width = Math.ceil(natural) + 'px';
    }

    lockWidthToContent();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var i = 0;
    var timers = [];

    function tick() {
      i = (i + 1) % frames.length;
      word.classList.add('swap-out');
      timers.push(setTimeout(function () {
        word.textContent = frames[i].text;
        pill.setAttribute('data-c', frames[i].c);
        lockWidthToContent();
        word.classList.remove('swap-out');
        word.classList.add('swap-in');
        timers.push(setTimeout(function () {
          word.classList.remove('swap-in');
        }, 380));
      }, 220));
    }

    setInterval(tick, 2800);
  });
})();
