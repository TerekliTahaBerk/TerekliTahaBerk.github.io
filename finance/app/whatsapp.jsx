/* ============================================================
   WhatsApp Channel — primary data-entry port.
   ------------------------------------------------------------
   iMessage / Apple Messages tonu. Empty-first.
============================================================ */
(function () {
  const { useState } = React;
  const D = window.DATA;

  function Empty() {
    return (
      <div className="page">
        <div className="page-head">
          <div>
            <div className="page-eyebrow flex gap8" style={{ alignItems: "center" }}>
              <span style={{ color: "var(--tx-2)" }}>○</span> Özel kanal · sessiz
            </div>
            <h1 className="page-title">WhatsApp Inbox</h1>
            <p className="page-sub">
              Banka entegrasyonu yokken ana veri giriş kapın burası olur. Mesajını gönder, sistem işleme dönüştürür.
            </p>
          </div>
        </div>
        <div className="empty-hero">
          <div className="empty-hero-mark"><Icon name="whatsapp" /></div>
          <h2>Inbox sessiz.</h2>
          <p>
            Henüz işlenmiş mesaj yok. Bir numara bağladığında gelen
            metinler burada parse edilir, onayınla işleme dönüşür.
          </p>
          <div className="empty-hero-actions">
            <button className="btn solid"><Icon name="link" /> Numara bağla</button>
            <button className="btn ghost" onClick={() => window.TBOpenQuickAdd?.()}>
              <Icon name="plus" /> Manuel ekle
            </button>
          </div>
          <div className="empty-hero-hints">
            <span className="muted">Uçtan uca özel · sadece bu cihaz</span>
          </div>
        </div>
      </div>
    );
  }

  function Inbox({ initial }) {
    const [items, setItems] = useState(initial);
    const [sel, setSel] = useState(items.find(m => m.status === "pending")?.id || items[0].id);

    function act(id, status) {
      setItems(arr => arr.map(m => m.id === id ? { ...m, status } : m));
    }

    const current = items.find(m => m.id === sel) || items[0];
    const pending = items.filter(m => m.status === "pending").length;
    const todayTotal = items.reduce((s, m) =>
      m.parsed.category !== "Gelir" && m.parsed.category !== "Kart Borcu" && m.parsed.category !== "Hedef"
        ? s + m.parsed.amount : s, 0);

    return (
      <div className="page">
        <div className="page-head">
          <div>
            <div className="page-eyebrow flex gap8" style={{ alignItems: "center" }}>
              <span style={{ color: "var(--pos)" }}>●</span> Özel kanal · uçtan uca
            </div>
            <h1 className="page-title">WhatsApp Inbox</h1>
            <p className="page-sub">
              Mesaj geldiğinde AI parse eder, sen onaylarsın. Tek dokunuş, sessiz akış.
            </p>
          </div>
          <div className="flex gap8">
            <span className="chip tone-pos"><Icon name="check" style={{ width: 11, height: 11 }} /> {items.length - pending} onaylı</span>
            <span className="chip tone-warn">{pending} bekliyor</span>
            <button className="btn ghost"><Icon name="settings" /></button>
          </div>
        </div>

        <AIRow tone="ac" icon="spark" rationale="bugün parse edilen mesajlar">
          Bugün <b>{items.length}</b> mesaj geldi · toplam <b>{D.fmt(todayTotal)}</b> harcama parse edildi.
        </AIRow>

        <div className="wa-shell">
          <div className="wa-list">
            <div className="wa-list-head">
              <b>Mesajlar</b>
              <span>Son 7 gün</span>
            </div>
            {items.map(m => (
              <div key={m.id}
                   className={"wa-item " + (m.id === sel ? "active" : "")}
                   onClick={() => setSel(m.id)}>
                <div className="av"><Icon name="user" style={{ width: 14, height: 14 }} /></div>
                <div className="preview">
                  <div className="hd"><b>{m.parsed.name}</b><time>{m.time}</time></div>
                  <div className="msg">{m.raw}</div>
                </div>
                <span className={"st-dot " + (m.status === "approved" ? "done" : m.status === "skipped" ? "skip" : "")}></span>
              </div>
            ))}
          </div>

          <div className="wa-conv">
            <div className="wa-conv-head">
              <div className="av" style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, oklch(0.55 0.13 152), oklch(0.4 0.1 145))",
                color: "#fff", display: "grid", placeItems: "center",
              }}><Icon name="user" style={{ width: 16, height: 16 }} /></div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                <b style={{ fontSize: 13.5 }}>Özel kanal</b>
                <span className="muted" style={{ fontSize: 11, fontFamily: "var(--mono)", letterSpacing: "0.04em" }}>son aktif şimdi</span>
              </div>
              <span className="tb-spacer" />
              <span className="muted mono" style={{ fontSize: 10.5, letterSpacing: "0.06em" }}>uçtan uca · özel</span>
            </div>

            <div className="wa-thread">
              <div className="bubble me">
                {current.raw}
                <time>{current.time}</time>
              </div>

              <div className="bubble them" style={{ maxWidth: "92%", padding: 0, background: "transparent", border: 0 }}>
                <div className="parsed-card">
                  <div className="pc-head">
                    <div className="flex gap8">
                      <AIBadge label="AI parse" />
                      <Confidence value={current.parsed.confidence} dense />
                    </div>
                    <span className="muted mono" style={{ fontSize: 10.5 }}>{current.time}</span>
                  </div>
                  <div className="serif" style={{ fontSize: 26, fontStyle: "italic", color: "var(--tx-0)", fontWeight: 380, letterSpacing: "-0.02em" }}>
                    {D.fmt(current.parsed.amount)}
                  </div>
                  <dl className="kv-grid" style={{ gridTemplateColumns: "100px 1fr" }}>
                    <dt>İşlem</dt><dd>{current.parsed.name}</dd>
                    <dt>Kategori</dt><dd>{current.parsed.category}</dd>
                    <dt>Kart</dt><dd>{current.parsed.card}</dd>
                    <dt>Lokasyon</dt><dd>{current.parsed.location}</dd>
                  </dl>
                  {current.hint && (
                    <AIRow tone="warn" icon="info" rationale="eksik bilgi · destek">
                      {current.hint}
                    </AIRow>
                  )}
                  {current.status === "pending" ? (
                    <div className="flex gap8">
                      <button className="btn primary sm" onClick={() => act(current.id, "approved")}><Icon name="check" /> Onayla</button>
                      <button className="btn ghost sm"><Icon name="edit" /> Düzenle</button>
                      <button className="btn danger sm" onClick={() => act(current.id, "skipped")}><Icon name="x" /> Reddet</button>
                    </div>
                  ) : (
                    <span className={"chip tone-" + (current.status === "approved" ? "pos" : "neutral")}>
                      <Icon name={current.status === "approved" ? "check" : "x"} style={{ width: 11, height: 11 }} />
                      {current.status === "approved" ? "Onaylandı" : "Reddedildi"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ padding: 14, borderTop: "1px solid var(--line-soft)", background: "var(--bg-1)" }}>
              <div className="flex gap8">
                <input
                  placeholder="Bir işlem yaz… 'Market 920 TL'"
                  style={{
                    flex: 1, background: "var(--bg-2)", border: "1px solid var(--line)",
                    borderRadius: 999, padding: "10px 16px", fontSize: 13, outline: "none",
                  }} />
                <button className="btn primary"><Icon name="arrowRight" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function WhatsApp() {
    const list = D.waInbox || [];
    if (!list.length) return <Empty />;
    return <Inbox initial={list} />;
  }

  window.WhatsApp = WhatsApp;
})();
