/* ============================================================
   Private Finance OS · Launcher
   ------------------------------------------------------------
   A small, elegant, Apple-style login affordance injected into
   the bottom-right corner of every public page. Zero impact on
   the existing site: only one <script defer> line per page.
   ------------------------------------------------------------
   - No external assets
   - Inherits the site's dark/light theme via :root variables
   - Uses sessionStorage to know if Taha already has an active
     finance session (so the icon flips to "open" mode)
   - Respects prefers-reduced-motion
============================================================ */
(function () {
  // Idempotent: never inject twice (e.g. if accidentally double-included).
  if (window.__tbtFinanceLauncher) return;
  window.__tbtFinanceLauncher = true;

  // ---- detect existing finance session (best-effort, optional) ----
  var SESSION_KEY = 'tbt_finance_session_v1';
  var hasSession = false;
  try {
    var raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      var s = JSON.parse(raw);
      if (s && s.ts && (Date.now() - s.ts) < 1000 * 60 * 60 * 24 * 7) {
        hasSession = true;
      }
    }
  } catch (_) {}

  // ---- inject CSS once ----
  var css = '\
.tbt-fl-wrap{\
  position:fixed;right:max(16px,env(safe-area-inset-right));\
  bottom:max(16px,env(safe-area-inset-bottom));\
  z-index:9999;display:inline-flex;align-items:center;\
  font-family:"Geist",system-ui,-apple-system,sans-serif;\
}\
.tbt-fl-tip{\
  position:absolute;right:46px;top:50%;transform:translate(8px,-50%);\
  white-space:nowrap;background:rgba(15,14,12,.92);color:#ece7d8;\
  font-size:11.5px;letter-spacing:.01em;padding:6px 10px;border-radius:8px;\
  border:1px solid rgba(236,231,216,.08);\
  -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);\
  box-shadow:0 8px 24px rgba(0,0,0,.25);\
  opacity:0;pointer-events:none;\
  transition:opacity .22s ease,transform .26s cubic-bezier(.2,.7,.2,1);\
}\
.tbt-fl-tip strong{font-weight:520;color:#ece7d8}\
.tbt-fl-tip small{display:block;color:rgba(236,231,216,.55);font-size:10px;margin-top:2px;letter-spacing:.04em;text-transform:uppercase;font-family:"Geist Mono",ui-monospace,monospace}\
.tbt-fl-btn{\
  position:relative;width:34px;height:34px;border-radius:999px;\
  display:inline-flex;align-items:center;justify-content:center;\
  background:rgba(15,14,12,.55);color:rgba(236,231,216,.55);\
  border:1px solid rgba(236,231,216,.08);\
  -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);\
  cursor:pointer;text-decoration:none;\
  transition:opacity .24s cubic-bezier(.2,.7,.2,1),\
             transform .24s cubic-bezier(.2,.7,.2,1),\
             background .24s ease, color .24s ease,\
             box-shadow .24s ease, border-color .24s ease;\
  opacity:.62;\
}\
.tbt-fl-btn:hover{\
  opacity:1;transform:translateY(-1px);\
  background:rgba(15,14,12,.92);color:rgba(236,231,216,.96);\
  border-color:rgba(236,231,216,.16);\
  box-shadow:0 10px 26px rgba(0,0,0,.34);\
}\
.tbt-fl-btn:focus-visible{\
  outline:1px dashed rgba(236,231,216,.6);outline-offset:3px;opacity:1;\
}\
.tbt-fl-wrap:hover .tbt-fl-tip,.tbt-fl-btn:focus-visible + .tbt-fl-tip{\
  opacity:1;transform:translate(0,-50%);\
}\
.tbt-fl-btn svg{width:14px;height:14px;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;fill:none;stroke:currentColor;display:block}\
.tbt-fl-btn .tbt-fl-dot{\
  position:absolute;top:6px;right:6px;width:5px;height:5px;border-radius:50%;\
  background:oklch(0.7 0.18 152);\
  box-shadow:0 0 0 2px rgba(15,14,12,.92);\
  display:none;\
}\
.tbt-fl-btn[data-session="1"] .tbt-fl-dot{display:block}\
\
/* light mode (when site is in light) */\
html:not(.dark) .tbt-fl-btn{\
  background:rgba(255,255,255,.7);color:rgba(21,20,15,.55);\
  border:1px solid rgba(21,20,15,.08);\
}\
html:not(.dark) .tbt-fl-btn:hover{\
  background:rgba(255,255,255,.96);color:rgba(21,20,15,.95);\
  border-color:rgba(21,20,15,.16);\
}\
html:not(.dark) .tbt-fl-btn .tbt-fl-dot{box-shadow:0 0 0 2px rgba(255,255,255,.96)}\
html:not(.dark) .tbt-fl-tip{\
  background:rgba(255,255,255,.96);color:#15140f;\
  border:1px solid rgba(21,20,15,.08);\
}\
html:not(.dark) .tbt-fl-tip strong{color:#15140f}\
html:not(.dark) .tbt-fl-tip small{color:rgba(21,20,15,.55)}\
\
@media (max-width:540px){\
  .tbt-fl-wrap{right:max(12px,env(safe-area-inset-right));\
    bottom:max(12px,env(safe-area-inset-bottom));}\
  .tbt-fl-btn{width:30px;height:30px}\
  .tbt-fl-btn svg{width:12px;height:12px}\
  .tbt-fl-tip{display:none}\
}\
@media (prefers-reduced-motion:reduce){\
  .tbt-fl-btn,.tbt-fl-tip{transition:none}\
  .tbt-fl-btn:hover{transform:none}\
}\
';

  var style = document.createElement('style');
  style.id = 'tbt-fl-style';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // ---- inject DOM ----
  function mount() {
    if (document.querySelector('.tbt-fl-wrap')) return;

    // Lock + tiny dot icon — Apple/Wallet vibe.
    // Two glyphs depending on session state:
    // - locked padlock when no session
    // - subtle "open" key when session is alive
    var icon = hasSession
      ? '<svg viewBox="0 0 24 24" aria-hidden="true">\
           <circle cx="9" cy="13" r="3"/>\
           <path d="M11.5 11l8-8M16 6l3 3"/>\
         </svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true">\
           <rect x="5" y="11" width="14" height="9" rx="2"/>\
           <path d="M8 11V8a4 4 0 0 1 8 0v3"/>\
         </svg>';

    var label = hasSession
      ? '<strong>Open finance</strong><small>Session active</small>'
      : '<strong>Private finance</strong><small>Sign in</small>';

    var wrap = document.createElement('div');
    wrap.className = 'tbt-fl-wrap';
    wrap.innerHTML =
      '<a class="tbt-fl-btn" href="/finance/" aria-label="Private finance — sign in" ' +
      'data-session="' + (hasSession ? '1' : '0') + '">' +
      icon +
      '<span class="tbt-fl-dot" aria-hidden="true"></span>' +
      '</a>' +
      '<div class="tbt-fl-tip" role="tooltip">' + label + '</div>';

    document.body.appendChild(wrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
