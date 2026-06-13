/* ============================================================
   Settings — Profile · Data Sources · AI · Privacy · Categories
============================================================ */
(function () {
  const { useState } = React;
  const D = window.DATA;

  function Toggle({ on, onClick }) {
    return (
      <button className={"toggle" + (on ? " on" : "")} onClick={onClick} aria-pressed={on}>
        <span className="knob" />
      </button>
    );
  }

  function Row({ icon, l, sub, right }) {
    return (
      <div className="lrow" style={{ padding: "13px 0" }}>
        {icon && <span className="l-ic" style={{ background: "var(--bg-3)" }}><Icon name={icon} /></span>}
        <div className="l-main"><b>{l}</b>{sub && <span>{sub}</span>}</div>
        {right}
      </div>
    );
  }

  function Profile() {
    return (
      <div className="card">
        <div className="card-head"><div className="card-title">Profile</div></div>
        <div className="flex gap14" style={{ alignItems: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: "linear-gradient(135deg, var(--bg-3), var(--bg-2))",
            border: "1px solid var(--bo-1)",
            display: "grid", placeItems: "center",
            color: "var(--tx-1)",
          }}>
            <Icon name="user" style={{ width: 22, height: 22 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <b style={{ fontSize: 16 }}>Yerel hesap</b>
            <span className="dim" style={{ fontSize: 13 }}>Bu cihazda saklanır</span>
            <span className="muted mono" style={{ fontSize: 11, letterSpacing: "0.06em" }}>private · single-tenant</span>
          </div>
        </div>
        <div>
          <Row icon="location" l="Saat dilimi" sub="Europe/Istanbul · GMT+3" right={<button className="btn ghost sm">Değiştir</button>} />
          <Row icon="dollar"   l="Birincil para birimi" sub="TRY · ₺" right={<button className="btn ghost sm">Değiştir</button>} />
          <Row icon="user"     l="Hesap türü" sub="Private — kimseyle paylaşılmaz" right={<span className="chip tone-pos">Aktif</span>} />
        </div>
      </div>
    );
  }

  function DataSources() {
    const sheets = D.sheets || [];
    const hasSheets = sheets.length > 0;
    return (
      <div className="card">
        <div className="card-head">
          <div className="card-title">Data Sources</div>
          <span className="muted mono" style={{ fontSize: 11 }}>Manuel · WhatsApp · Sheets</span>
        </div>

        <div className="card flat tight" style={{ padding: 16 }}>
          <div className="flex between">
            <div className="flex gap8">
              <span className="l-ic" style={{
                background: hasSheets ? "var(--pos-soft)" : "var(--bg-3)",
                color: hasSheets ? "var(--pos)" : "var(--tx-2)",
              }}><Icon name="sheet" /></span>
              <div>
                <b style={{ fontSize: 13 }}>Google Sheets</b>
                <span className="muted" style={{ fontSize: 11, display: "block", marginTop: 2 }}>
                  {hasSheets ? `Bağlı · ${sheets.length} sayfa` : "Bağlı değil · bir tablo bağla"}
                </span>
              </div>
            </div>
            <button className="btn ghost sm">
              <Icon name={hasSheets ? "sync" : "plus"} /> {hasSheets ? "Senkronize" : "Bağla"}
            </button>
          </div>
          {hasSheets && (
            <div className="grid-2" style={{ gap: 6, marginTop: 4 }}>
              {sheets.map(s => (
                <div className="lrow" key={s.name} style={{ padding: "8px 0" }}>
                  <span className="l-ic" style={{ background: "var(--bg-3)" }}><Icon name="grid" /></span>
                  <div className="l-main">
                    <b>{s.name}</b>
                    <span>{s.rows.toLocaleString("tr-TR")} satır · son senkron {s.lastSync}</span>
                  </div>
                  <span className="chip tone-pos">{s.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Row icon="whatsapp" l="WhatsApp Channel" sub="Bu cihaz · uçtan uca özel"
             right={<span className="chip">Bağlı değil</span>} />
        <Row icon="upload"   l="CSV Import"      sub="Banka ekstresi yükle"
             right={<button className="btn ghost sm">Yükle</button>} />
        <Row icon="receipt"  l="Fiş yükleme"     sub="Fotoğraf · OCR + LLM"
             right={<button className="btn ghost sm">Aç</button>} />
        <Row icon="edit"     l="Manuel giriş"    sub="Hızlı ekleme her sayfada"
             right={<span className="chip tone-pos">Açık</span>} />
      </div>
    );
  }

  function AIPrefs() {
    const [tone, setTone] = useState("calm");
    const [agg, setAgg] = useState(2);
    const [risk, setRisk] = useState(2);
    const tones = [
      { id: "calm",   label: "Sakin & kibar" },
      { id: "direct", label: "Kısa & net" },
      { id: "warm",   label: "Yakın & arkadaşça" },
    ];
    return (
      <div className="card">
        <div className="card-head"><div className="card-title">AI Preferences</div></div>
        <Row icon="ai" l="Yanıt tonu" sub="AI sana nasıl konuşsun?" right={
          <div className="seg">
            {tones.map(t => (
              <button key={t.id}
                className={"seg-btn " + (tone === t.id ? "active" : "")}
                onClick={() => setTone(t.id)}>{t.label}</button>
            ))}
          </div>
        } />
        <Row icon="sliders" l="Tasarruf agresifliği" sub="öneriler ne kadar sıkı olsun" right={
          <div className="flex gap8">
            {[1,2,3].map(v => (
              <button key={v} className={"chip " + (agg === v ? "tone-ac" : "")} onClick={() => setAgg(v)}>
                {["Yumuşak","Dengeli","Sıkı"][v-1]}
              </button>
            ))}
          </div>
        } />
        <Row icon="shield" l="Risk seviyesi" sub="yatırım gözleminde varsayılan ton" right={
          <div className="flex gap8">
            {[1,2,3].map(v => (
              <button key={v} className={"chip " + (risk === v ? "tone-inv" : "")} onClick={() => setRisk(v)}>
                {["Düşük","Orta","Yüksek"][v-1]}
              </button>
            ))}
          </div>
        } />
        <Row icon="flag" l="Hedef öncelikleri" sub="AI önce neye odaklansın?"
             right={<button className="btn ghost sm">Düzenle</button>} />
      </div>
    );
  }

  function Privacy() {
    const [priv, setPriv] = useState(true);
    const [enc, setEnc]   = useState(true);
    const [lock, setLock] = useState(false);
    return (
      <div className="card">
        <div className="card-head"><div className="card-title">Privacy & Security</div></div>
        <Row icon="lock"   l="Private mode"      sub="Ekrana göz atan birinden gizle" right={<Toggle on={priv} onClick={() => setPriv(p => !p)} />} />
        <Row icon="shield" l="Local encryption"  sub="Hassas alanlar tarayıcıda şifreli tutulur" right={<Toggle on={enc} onClick={() => setEnc(e => !e)} />} />
        <Row icon="eye"    l="Session lock"      sub="3 dakika hareketsizlik → otomatik kilit" right={<Toggle on={lock} onClick={() => setLock(l => !l)} />} />
        <Row icon="download" l="Verini dışa aktar" sub="JSON · CSV"
             right={<button className="btn ghost sm">İndir</button>} />
        <Row icon="trash"  l="Tüm veriyi sil"    sub="Geri alınamaz"
             right={<button className="btn danger sm">Sil</button>} />
        <AIRow tone="warn" icon="info" rationale="MVP / production gap">
          <b>Demo notu:</b> Şu an bu ürün <b>client-side</b> çalışıyor; gerçek production için
          Supabase/Clerk/Auth0 gibi sunucu tarafı bir auth sağlayıcısı ve şifreli depolama gerekir.
        </AIRow>
      </div>
    );
  }

  function ManageList({ title, items, icon }) {
    return (
      <div className="card">
        <div className="card-head">
          <div className="card-title">{title}</div>
          <button className="btn ghost sm"><Icon name="plus" /> Ekle</button>
        </div>
        <div className="flex gap8 wrap">
          {items.map((i, idx) => (
            <span key={idx} className="chip" style={{ paddingRight: 6, paddingLeft: 10 }}>
              <Icon name={icon} style={{ width: 11, height: 11 }} />
              {i}
              <button style={{ color: "var(--tx-3)", padding: "0 4px" }}><Icon name="x" style={{ width: 10, height: 10 }} /></button>
            </span>
          ))}
        </div>
      </div>
    );
  }

  function Settings() {
    const [tab, setTab] = useState("profile");
    return (
      <div className="page">
        <div className="page-head">
          <div>
            <div className="page-eyebrow">Tercihler</div>
            <h1 className="page-title">Settings</h1>
            <p className="page-sub">macOS System Settings hissi · sade ve odaklı.</p>
          </div>
          <PeriodSwitch value={tab} onChange={setTab} options={[
            { id: "profile",  label: "Profile" },
            { id: "data",     label: "Data" },
            { id: "ai",       label: "AI" },
            { id: "privacy",  label: "Privacy" },
            { id: "manage",   label: "Manage" },
          ]} />
        </div>

        {tab === "profile" && <Profile />}
        {tab === "data"    && <DataSources />}
        {tab === "ai"      && <AIPrefs />}
        {tab === "privacy" && <Privacy />}
        {tab === "manage"  && (
          <>
            <ManageList title="Kategoriler" items={D.categoryList} icon="tag" />
            <ManageList title="Kartlar"     items={D.cards.map(c => c.bank + " · " + c.name)} icon="card" />
            <ManageList title="Hedefler"    items={D.goals.map(g => g.name)} icon="flag" />
          </>
        )}
      </div>
    );
  }

  window.Settings = Settings;
})();
