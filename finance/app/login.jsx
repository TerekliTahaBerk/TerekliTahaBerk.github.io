/* ============================================================
   Login screen — minimal, Apple-vari
   ------------------------------------------------------------
   ⚠️ DEMO ONLY. See auth.js header. Hardcoded client-side
   credentials offer no real security. For production, swap
   for Supabase/Clerk/Auth0 + server-validated sessions.
============================================================ */
(function () {
  const { useState, useRef, useEffect } = React;

  function Login({ onSignedIn }) {
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [err, setErr] = useState(null);
    const [busy, setBusy] = useState(false);
    const emailRef = useRef(null);

    useEffect(() => { emailRef.current?.focus(); }, []);

    async function submit(e) {
      e?.preventDefault?.();
      if (busy) return;
      setBusy(true); setErr(null);
      const res = await window.TBTAuth.signIn(email, pw);
      setBusy(false);
      if (!res.ok) {
        setErr(res.error || "Giriş başarısız.");
        return;
      }
      onSignedIn?.(res.session);
    }

    return (
      <div className="login-shell">
        <form className="login-card" onSubmit={submit} autoComplete="off">
          <div className="lg-mark"><Icon name="dollar" /></div>
          <h1>Finance</h1>
          <div className="lg-sub">
            Sessiz, kişisel, akıllı.
          </div>

          <div className="lg-row">
            <label htmlFor="lg-email">E-posta</label>
            <input
              id="lg-email" ref={emailRef}
              type="email" inputMode="email" autoCapitalize="off" autoCorrect="off" spellCheck="false"
              placeholder="ornek@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="lg-row">
            <label htmlFor="lg-pw" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Şifre</span>
              <button type="button" onClick={() => setShowPw(s => !s)}
                style={{ font: "inherit", color: "var(--tx-2)", letterSpacing: "0.1em", fontSize: 10, textTransform: "uppercase", fontFamily: "var(--mono)" }}>
                {showPw ? "Gizle" : "Göster"}
              </button>
            </label>
            <input
              id="lg-pw"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={pw} onChange={(e) => setPw(e.target.value)}
              required
            />
          </div>

          {err && <div className="lg-error">{err}</div>}

          <button className="lg-submit" type="submit" disabled={busy}>
            {busy ? <span className="login-spin" /> : <Icon name="lock" style={{ width: 13, height: 13 }} />}
            <span>{busy ? "Doğrulanıyor…" : "Giriş yap"}</span>
          </button>

          <div className="lg-foot">
            <span>Demo · client-side auth</span>
            <a href="/" tabIndex={0}>← ana siteye dön</a>
          </div>
        </form>

        <div className="login-note">
          v0.1 · session 7 gün · finansal veri plaintext saklanmaz
        </div>
      </div>
    );
  }

  window.Login = Login;
})();
