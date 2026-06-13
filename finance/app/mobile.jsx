/* ============================================================
   Mobile preview — iOS phone frames showcasing key screens
============================================================ */
(function () {
  const D = window.DATA;

  function StatusBar({ title }) {
    return (
      <div style={{
        height: 38, padding: "12px 18px 6px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontFamily: "var(--mono)", fontSize: 11, color: "var(--tx-1)",
      }}>
        <span>09:41</span>
        <span style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 540 }}>{title}</span>
        <span style={{ display: "inline-flex", gap: 2 }}>
          <span style={{ width: 16, height: 9, borderRadius: 2, border: "1px solid var(--tx-1)" }}>
            <span style={{ display: "block", width: 11, height: 5, background: "var(--tx-1)", margin: 1, borderRadius: 1 }}></span>
          </span>
        </span>
      </div>
    );
  }

  const mShell = { padding: "8px 14px 16px", display: "flex", flexDirection: "column", gap: 11, height: "calc(100% - 50px)", overflow: "hidden" };
  const mcard  = { background: "var(--bg-2)", border: "1px solid var(--line-soft)", borderRadius: 14, padding: 14 };

  function Phone({ label, children }) {
    return (
      <div style={{ flexShrink: 0 }}>
        <div className="phone">
          <div className="phone-notch" />
          <div className="phone-screen">{children}</div>
        </div>
        <div className="phone-label">{label}</div>
      </div>
    );
  }

  function Screen1() {
    return (
      <>
        <StatusBar title="Bugün" />
        <div style={mShell}>
          <div style={mcard}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--tx-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Today's Brief</span>
            <div className="serif" style={{ fontSize: 18, fontStyle: "italic", color: "var(--tx-0)", marginTop: 4, lineHeight: 1.2, fontWeight: 380 }}>
              Günaydın, Taha.
            </div>
            <p style={{ fontSize: 12, color: "var(--tx-1)", lineHeight: 1.4, marginTop: 6, fontFamily: "var(--serif)" }}>
              Bu ay hedefin önündesin. Restoran harcamaların biraz üzerinde.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={mcard}>
              <span style={{ fontSize: 10, color: "var(--tx-2)" }}>Net</span>
              <div className="mono" style={{ fontSize: 16, color: "var(--tx-0)", fontWeight: 500 }}>{D.fmtK(53860)}</div>
              <span className="delta up mono" style={{ fontSize: 9, padding: "1px 6px", marginTop: 4, display: "inline-flex" }}>+%4.2</span>
            </div>
            <div style={mcard}>
              <span style={{ fontSize: 10, color: "var(--tx-2)" }}>Bugün</span>
              <div className="mono" style={{ fontSize: 16, color: "var(--neg)", fontWeight: 500 }}>{D.fmt(1850)}</div>
              <span className="muted" style={{ fontSize: 9 }}>4 işlem · WhatsApp</span>
            </div>
          </div>

          <div style={mcard}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--tx-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Yaklaşan</span>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 8 }}>
              {D.upcoming.slice(0, 3).map((u, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
                  <span style={{ color: "var(--tx-0)" }}>{u.name.slice(0, 22)}</span>
                  <span className="mono" style={{ color: "var(--tx-1)" }}>{D.fmtK(u.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  function Screen2() {
    return (
      <>
        <StatusBar title="Hızlı ekle" />
        <div style={mShell}>
          <div style={{ ...mcard, padding: 18 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--tx-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Yeni harcama</span>
            <div className="serif" style={{ fontSize: 32, fontStyle: "italic", color: "var(--tx-0)", marginTop: 4, fontWeight: 380 }}>₺ 0</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 12 }}>
              {[1,2,3,4,5,6,7,8,9,".",0,"⌫"].map((k, i) => (
                <div key={i} style={{
                  height: 38, borderRadius: 10, background: "var(--bg-3)",
                  display: "grid", placeItems: "center", fontSize: 16,
                  color: "var(--tx-0)", fontFamily: "var(--mono)",
                }}>{k}</div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <button className="btn primary sm" style={{ justifyContent: "center" }}>Onayla</button>
            <button className="btn ghost sm" style={{ justifyContent: "center" }}>WhatsApp'tan ekle</button>
          </div>
        </div>
      </>
    );
  }

  function Screen3() {
    const m = D.waInbox[0];
    return (
      <>
        <StatusBar title="WhatsApp" />
        <div style={mShell}>
          <div style={mcard}>
            <div style={{ alignSelf: "flex-end", maxWidth: "85%", padding: "8px 12px",
              background: "linear-gradient(180deg, oklch(0.55 0.13 152), oklch(0.45 0.13 152))",
              color: "#fff", borderRadius: 16, fontSize: 12, marginLeft: "auto",
            }}>{m.raw}</div>
            <div style={{ marginTop: 10, padding: 10, background: "var(--bg-1)", border: "1px solid var(--line-soft)", borderRadius: 12 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ac)", letterSpacing: "0.08em", textTransform: "uppercase" }}>AI parse · %{Math.round(m.parsed.confidence * 100)}</span>
              <div className="serif" style={{ fontSize: 18, fontStyle: "italic", color: "var(--tx-0)", marginTop: 2, fontWeight: 380 }}>{D.fmt(m.parsed.amount)}</div>
              <span className="muted" style={{ fontSize: 11, display: "block" }}>{m.parsed.name} · {m.parsed.category}</span>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <button className="btn primary sm" style={{ flex: 1, justifyContent: "center" }}>Onayla</button>
                <button className="btn ghost sm" style={{ flex: 1, justifyContent: "center" }}>Düzenle</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  function Screen4() {
    return (
      <>
        <StatusBar title="Uyarılar" />
        <div style={mShell}>
          {[
            ["Akbank kart son ödeme · 6 gün", "warn", "₺39.850"],
            ["WhatsApp'ta 2 onay bekliyor", "ac", "Migros · Starbucks"],
            ["Yatırım +%2.8 (haftalık)", "pos", "Altın + hisse"],
            ["Restoran kategorisi normalin üstünde", "warn", "+%34"],
          ].map(([title, t, hint], i) => (
            <div key={i} style={{ ...mcard, padding: 12 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 9,
                  background: `var(--${t}-soft)`, color: `var(--${t})`,
                  display: "grid", placeItems: "center", flexShrink: 0,
                }}>
                  <Icon name="bell" style={{ width: 14, height: 14 }} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ fontSize: 12, color: "var(--tx-0)" }}>{title}</b>
                  <span style={{ display: "block", fontSize: 10.5, color: "var(--tx-2)", marginTop: 2 }}>{hint}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  function Screen5() {
    return (
      <>
        <StatusBar title="AI Coach" />
        <div style={mShell}>
          <div style={{ ...mcard, padding: 14, background: "linear-gradient(180deg, var(--ac-soft), transparent 60%), var(--bg-2)" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ac)", letterSpacing: "0.12em", textTransform: "uppercase" }}>AI · sakin</span>
            <div className="serif" style={{ fontSize: 18, fontStyle: "italic", color: "var(--tx-0)", marginTop: 4, lineHeight: 1.25, fontWeight: 380 }}>
              "Bu ay nereden kısmalıyım?"
            </div>
            <p style={{ fontSize: 12, color: "var(--tx-1)", lineHeight: 1.45, marginTop: 6, fontFamily: "var(--serif)" }}>
              Restoran harcaman normalin %34 üzerinde. Kalan günlerde günlük ₺310 limiti yeterli olur. Beklenen etki: -₺1.250 / +%2 tasarruf.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {["3 ayda ₺50K?", "Kart borcu planı?", "Sabit gider oranı?"].map((q, i) => (
              <span key={i} className="chip" style={{ alignSelf: "flex-start", fontSize: 11 }}>{q}</span>
            ))}
          </div>
        </div>
      </>
    );
  }

  function Mobile() {
    return (
      <div className="page">
        <div className="page-head">
          <div>
            <div className="page-eyebrow">iOS preview</div>
            <h1 className="page-title">Mobile</h1>
            <p className="page-sub">iPhone widget mantığında — büyük dokunma alanı, sade kartlar, AI sade konuşur.</p>
          </div>
        </div>
        <div className="phones">
          <Phone label="Bugün">    <Screen1 /></Phone>
          <Phone label="Hızlı ekle"><Screen2 /></Phone>
          <Phone label="WhatsApp"> <Screen3 /></Phone>
          <Phone label="Uyarılar"> <Screen4 /></Phone>
          <Phone label="AI Coach"> <Screen5 /></Phone>
        </div>
      </div>
    );
  }

  window.Mobile = Mobile;
})();
