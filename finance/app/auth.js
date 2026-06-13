/* ============================================================
   auth.js — Demo-only client-side session helper.
   ------------------------------------------------------------
   ⚠️ SECURITY NOTE
   This is a DEMO login. Hardcoded credentials in client code
   provide no real security. They are checked client-side only,
   for the single user (Taha) of this private workspace.
   For production:
     - Move credentials to environment variables
     - Use Supabase Auth / Clerk / Auth0 / Firebase
     - Validate sessions server-side
     - Encrypt finance data at rest
     - Never store sensitive numbers in localStorage as plaintext
============================================================ */
(function () {
  // Demo credentials — kept here intentionally for the MVP.
  // In production, remove this block entirely and proxy to a
  // server-side auth provider. Hashing client-side adds no security
  // (anyone can read the JS) so we keep this honest and simple.
  var DEMO_EMAIL    = "terekli@tahaberk.com";
  var DEMO_PASSWORD = "taha123";

  var SESSION_KEY = "tbt_finance_session_v1";
  var TTL_MS      = 1000 * 60 * 60 * 24 * 7; // 7 days

  function readSession() {
    try {
      var raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (!s || !s.ts) return null;
      if (Date.now() - s.ts > TTL_MS) {
        sessionStorage.removeItem(SESSION_KEY);
        return null;
      }
      return s;
    } catch (_) { return null; }
  }

  function writeSession(s) {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
    catch (_) {}
  }

  function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (_) {}
  }

  async function signIn(email, password) {
    // Trim + normalise email; password is intentionally case-sensitive.
    var e = (email || "").trim().toLowerCase();
    var p = password || "";
    // Tiny artificial delay so the loading state is perceptible without
    // feeling slow — calmer UX than instant snap.
    await new Promise(function (r) { setTimeout(r, 280); });
    if (e !== DEMO_EMAIL.toLowerCase() || p !== DEMO_PASSWORD) {
      return { ok: false, error: "E-posta veya şifre hatalı." };
    }
    var session = {
      v: 1,
      email: DEMO_EMAIL,
      ts: Date.now(),
      // No tokens, no PII stored — demo only.
      // Production: add JWT, expiry, refresh, etc. via real provider.
    };
    writeSession(session);
    return { ok: true, session: session };
  }

  function signOut() {
    clearSession();
  }

  function isAuthed() {
    return !!readSession();
  }

  window.TBTAuth = {
    signIn: signIn,
    signOut: signOut,
    isAuthed: isAuthed,
    readSession: readSession,
    SESSION_KEY: SESSION_KEY,
    DEMO_EMAIL: DEMO_EMAIL,
    SECURITY_NOTE:
      "Demo client-side login. In production, use a real auth provider " +
      "(Supabase / Clerk / Auth0 / Firebase) with server-side validation.",
  };
})();
