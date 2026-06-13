/* ============================================================
   modals.jsx — global modal slots (Quick Add, Shortcuts help)
   ------------------------------------------------------------
   - QuickAdd: hızlı işlem ekleme formu (gelir / gider toggle,
              tutar, kategori chip'leri, kart picker, tarih, not)
              → drafts localStorage'a kaydedilir.
   - Shortcuts: Apple-vari klavye kısayolları yardım ekranı.
============================================================ */
(function () {
  const { useState, useEffect, useRef, useMemo } = React;
  const D = window.DATA;

  const DRAFT_KEY = "tbt_finance_drafts_v1";

  function readDrafts() {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "[]") || []; }
    catch (_) { return []; }
  }
  function writeDrafts(list) {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(list || [])); }
    catch (_) {}
  }
  // expose helper for other pages
  window.TBDrafts = { read: readDrafts, write: writeDrafts };

  // -------------------------------------------------------------
  // QuickAdd modal
  // -------------------------------------------------------------
  function QuickAdd({ open, onClose }) {
    const [kind, setKind]       = useState("expense");
    const [amount, setAmount]   = useState("");
    const [merchant, setMerch]  = useState("");
    const [category, setCat]    = useState((D.categories?.[0]?.name) || "Diğer");
    const [card, setCard]       = useState((D.cards?.[0]?.id) || "");
    const [date, setDate]       = useState(new Date().toISOString().slice(0, 10));
    const [note, setNote]       = useState("");
    const [savedAt, setSavedAt] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
      if (!open) return;
      // reset on every open
      setKind("expense");
      setAmount("");
      setMerch("");
      setCat((D.categories?.[0]?.name) || "Diğer");
      setCard((D.cards?.[0]?.id) || "");
      setDate(new Date().toISOString().slice(0, 10));
      setNote("");
      setSavedAt(null);
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }, [open]);

    useEffect(() => {
      if (!open) return;
      const onKey = (e) => {
        if (e.key === "Escape") { e.preventDefault(); onClose(); }
        else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          e.preventDefault();
          submit();
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    });

    const isValid = useMemo(() => {
      const n = parseFloat(String(amount).replace(",", "."));
      return !isNaN(n) && n > 0 && merchant.trim().length > 0;
    }, [amount, merchant]);

    function submit() {
      if (!isValid) {
        window.TBToast?.push("Tutar ve açıklama gerekli", "warn");
        return;
      }
      const n = parseFloat(String(amount).replace(",", "."));
      const draft = {
        id: "draft-" + Date.now(),
        date,
        merchant: merchant.trim(),
        category,
        amount: kind === "expense" ? -Math.abs(n) : Math.abs(n),
        card,
        note: note.trim(),
        kind,
        ts: Date.now(),
        source: "manual",
      };
      const list = readDrafts();
      list.unshift(draft);
      writeDrafts(list);
      setSavedAt(Date.now());
      window.TBToast?.push(
        (kind === "expense" ? "Gider" : "Gelir") + " eklendi · " + window.TBFmt.tl(draft.amount),
        "success"
      );
      // close after short success animation
      setTimeout(() => onClose(), 380);
    }

    if (!open) return null;
    return (
      <div className="cmdk-scrim" onClick={onClose}>
        <div className="qa-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Hızlı işlem ekle">
          <div className="qa-head">
            <div className="qa-title">
              <span className="qa-eyebrow">Yeni kayıt</span>
              <h2>Hızlı işlem ekle</h2>
            </div>
            <div className="qa-tabs" role="tablist">
              <button
                role="tab"
                aria-selected={kind === "expense"}
                className={kind === "expense" ? "active" : ""}
                onClick={() => setKind("expense")}
              ><Icon name="arrowDown" /> Gider</button>
              <button
                role="tab"
                aria-selected={kind === "income"}
                className={kind === "income" ? "active" : ""}
                onClick={() => setKind("income")}
              ><Icon name="arrowUp" /> Gelir</button>
            </div>
          </div>

          <div className="qa-body">
            <div className="qa-amount-block">
              <span className="qa-amount-prefix">₺</span>
              <input
                ref={inputRef}
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  // accept digits, comma, dot
                  const v = e.target.value.replace(/[^\d.,]/g, "");
                  setAmount(v);
                }}
                className="qa-amount"
              />
              <span className={"qa-kind-pill tone-" + (kind === "expense" ? "neg" : "pos")}>
                {kind === "expense" ? "Gider" : "Gelir"}
              </span>
            </div>

            <div className="qa-field">
              <label>Açıklama</label>
              <input
                type="text"
                placeholder="ör. BIM market alışverişi"
                value={merchant}
                onChange={(e) => setMerch(e.target.value)}
              />
            </div>

            <div className="qa-field">
              <label>Kategori</label>
              <div className="qa-chip-row">
                {(D.categories || []).map(c => (
                  <button
                    key={c.name}
                    className={"qa-chip " + (category === c.name ? "active" : "")}
                    onClick={() => setCat(c.name)}
                    type="button"
                  >
                    <span className="qa-chip-dot" style={{ background: c.color }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="qa-grid-2">
              <div className="qa-field">
                <label>Kart / Hesap</label>
                <select value={card} onChange={(e) => setCard(e.target.value)}>
                  {(D.cards || []).map(c => (
                    <option key={c.id} value={c.id}>{c.bank} · {c.num}</option>
                  ))}
                  <option value="cash">Nakit</option>
                </select>
              </div>
              <div className="qa-field">
                <label>Tarih</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <div className="qa-field">
              <label>Not (opsiyonel)</label>
              <input
                type="text"
                placeholder="küçük bir not bırak"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <div className="qa-foot">
            <span className="qa-hint">
              <span className="kbd">⌘</span><span className="kbd">⏎</span> kaydet ·
              <span className="kbd" style={{ marginLeft: 6 }}>esc</span> kapat
            </span>
            <div className="flex gap8">
              <button className="btn ghost" onClick={onClose} type="button">İptal</button>
              <button
                className={"btn " + (isValid ? "" : "disabled")}
                disabled={!isValid}
                onClick={submit}
                type="button"
              >
                {savedAt ? <><Icon name="check" /> Kaydedildi</> : <>Kaydet</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Shortcuts overlay
  // -------------------------------------------------------------
  const SHORTCUTS = [
    { group: "Genel", items: [
      { keys: ["⌘", "K"],  desc: "Komut paleti" },
      { keys: ["⌘", "B"],  desc: "Kenar çubuğunu daralt / aç" },
      { keys: ["⌘", "N"],  desc: "Yeni işlem ekle" },
      { keys: ["?"],       desc: "Bu yardım ekranı" },
      { keys: ["esc"],     desc: "Açık modal / paleti kapat" },
    ]},
    { group: "Sayfa atla", items: [
      { keys: ["g", "d"],  desc: "Dashboard" },
      { keys: ["g", "t"],  desc: "Transactions" },
      { keys: ["g", "r"],  desc: "Reports" },
      { keys: ["g", "a"],  desc: "AI Coach" },
      { keys: ["g", "s"],  desc: "Settings" },
    ]},
    { group: "Komut paleti", items: [
      { keys: ["↑", "↓"],  desc: "Önerileri gez" },
      { keys: ["⏎"],       desc: "Seçileni çalıştır" },
      { keys: ["/"],       desc: "Hızlı paleti aç (input dışında)" },
    ]},
  ];

  function ShortcutsOverlay({ open, onClose }) {
    useEffect(() => {
      if (!open) return;
      const onKey = (e) => { if (e.key === "Escape") { e.preventDefault(); onClose(); } };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;
    return (
      <div className="cmdk-scrim" onClick={onClose}>
        <div className="kbd-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Klavye kısayolları">
          <div className="kbd-head">
            <div>
              <span className="qa-eyebrow">Help</span>
              <h2>Klavye Kısayolları</h2>
            </div>
            <button className="btn ghost sm" onClick={onClose} type="button"><Icon name="x" /></button>
          </div>
          <div className="kbd-body">
            {SHORTCUTS.map(g => (
              <div className="kbd-group" key={g.group}>
                <div className="kbd-group-label">{g.group}</div>
                {g.items.map((it, i) => (
                  <div className="kbd-row" key={g.group + i}>
                    <span className="kbd-keys">
                      {it.keys.map((k, j) => (
                        <span className="kbd" key={j}>{k}</span>
                      ))}
                    </span>
                    <span className="kbd-desc">{it.desc}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="kbd-foot">
            <span className="muted">Tüm sayfalardan çalışır · küçük bir Apple-vari konfor.</span>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { QuickAdd, ShortcutsOverlay });
})();
