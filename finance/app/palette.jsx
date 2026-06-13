/* ============================================================
   palette.jsx — ⌘K Command Palette
   ------------------------------------------------------------
   - 13 pages (jump to)
   - Quick actions: yeni işlem, toggle sidebar, çıkış, export, print
   - Recent transactions search by merchant
   - Fuzzy ranker: subsequence + word-prefix bonus
============================================================ */
(function () {
  const { useState, useEffect, useRef, useMemo } = React;

  function fuzzyScore(query, target) {
    if (!query) return 1;
    const q = query.toLowerCase();
    const t = (target || "").toLowerCase();
    if (!t) return 0;
    if (t === q) return 100;
    if (t.startsWith(q)) return 80;
    if (t.includes(" " + q)) return 70;
    if (t.includes(q)) return 55;
    // subsequence match
    let qi = 0, gaps = 0, lastIdx = -1;
    for (let i = 0; i < t.length && qi < q.length; i++) {
      if (t[i] === q[qi]) {
        if (lastIdx !== -1) gaps += (i - lastIdx - 1);
        lastIdx = i;
        qi++;
      }
    }
    if (qi !== q.length) return 0;
    return Math.max(10, 50 - gaps);
  }

  function buildItems({ setPage, setCollapsed, signOut, currentPage }) {
    const D = window.DATA || {};
    const TITLES = window.TITLES || {};
    const SUBTITLES = window.SUBTITLES || {};

    const pages = Object.keys(TITLES).map(id => ({
      id: "page:" + id,
      kind: "Sayfa",
      label: TITLES[id],
      hint: SUBTITLES[id] || "",
      icon: "compass",
      run: () => setPage(id),
      disabled: id === currentPage,
    }));

    const actions = [
      { id: "act:new-tx",     kind: "Aksiyon", label: "Yeni işlem ekle",      hint: "⌘N", icon: "plus",
        run: () => window.TBOpenQuickAdd?.() },
      { id: "act:toggle-sb",  kind: "Aksiyon", label: "Kenar çubuğunu daralt/aç", hint: "⌘B", icon: "sliders",
        run: () => setCollapsed(c => !c) },
      { id: "act:help",       kind: "Aksiyon", label: "Klavye kısayolları",   hint: "?", icon: "info",
        run: () => window.TBOpenHelp?.() },
      { id: "act:print",      kind: "Aksiyon", label: "Sayfayı yazdır / PDF",  hint: "⌘P", icon: "printer",
        run: () => window.print() },
      { id: "act:export-tx",  kind: "Aksiyon", label: "İşlemleri CSV indir",   hint: "tüm tx", icon: "download",
        run: () => window.TBExport?.csv((D.transactions || []).map(t => ({
          tarih: t.date, açıklama: t.merchant, kategori: t.category, tutar: t.amount, kart: t.card, etiket: t.tag,
        })), "islemler.csv") },
      { id: "act:logout",     kind: "Aksiyon", label: "Oturumu kapat",         hint: "Lock", icon: "lock",
        run: () => signOut() },
    ];

    const txs = (D.transactions || []).slice(0, 40).map(t => ({
      id: "tx:" + t.id,
      kind: "İşlem",
      label: t.merchant + " · " + (window.TBFmt?.tl(t.amount) || t.amount),
      hint: t.category + " · " + t.date,
      icon: "receipt",
      run: () => { setPage("transactions"); window.TBToast?.push("İşlem aç: " + t.merchant, "info"); },
    }));

    return [...pages, ...actions, ...txs];
  }

  function Palette({ open, onClose, setPage, setCollapsed, signOut, currentPage }) {
    const [q, setQ] = useState("");
    const [active, setActive] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const items = useMemo(
      () => buildItems({ setPage, setCollapsed, signOut, currentPage }),
      [setPage, setCollapsed, signOut, currentPage]
    );

    const ranked = useMemo(() => {
      const query = q.trim();
      if (!query) {
        // recent / pages first
        return items.filter(it => it.kind === "Sayfa" || it.kind === "Aksiyon").slice(0, 12);
      }
      return items
        .map(it => ({ it, s: Math.max(fuzzyScore(query, it.label), fuzzyScore(query, it.hint || "")) }))
        .filter(x => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 14)
        .map(x => x.it);
    }, [q, items]);

    useEffect(() => { setActive(0); }, [q, open]);

    useEffect(() => {
      if (!open) return;
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }, [open]);

    useEffect(() => {
      if (!open) return;
      const onKey = (e) => {
        if (e.key === "Escape")  { e.preventDefault(); onClose(); }
        else if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, ranked.length - 1)); }
        else if (e.key === "ArrowUp")   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
        else if (e.key === "Enter")     {
          e.preventDefault();
          const it = ranked[active];
          if (it && !it.disabled) { it.run(); onClose(); }
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [open, ranked, active, onClose]);

    useEffect(() => {
      if (!listRef.current) return;
      const el = listRef.current.querySelector('[data-active="true"]');
      if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
    }, [active]);

    if (!open) return null;
    return (
      <div className="cmdk-scrim" onClick={onClose}>
        <div className="cmdk" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Komut paleti">
          <div className="cmdk-input">
            <Icon name="search" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Sayfa, işlem, aksiyon ara…"
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
            <span className="kbd">esc</span>
          </div>
          <div className="cmdk-list" ref={listRef}>
            {ranked.length === 0 && (
              <div className="cmdk-empty">Sonuç yok · farklı bir kelime dene</div>
            )}
            {ranked.map((it, i) => (
              <button
                key={it.id}
                data-active={i === active}
                disabled={it.disabled}
                className={"cmdk-item " + (i === active ? "active " : "") + (it.disabled ? "disabled " : "")}
                onMouseEnter={() => setActive(i)}
                onClick={() => { if (!it.disabled) { it.run(); onClose(); } }}
              >
                <span className="cmdk-icon"><Icon name={it.icon} /></span>
                <span className="cmdk-main">
                  <span className="cmdk-label">{it.label}</span>
                  {it.hint && <span className="cmdk-hint">{it.hint}</span>}
                </span>
                <span className="cmdk-kind">{it.kind}</span>
              </button>
            ))}
          </div>
          <div className="cmdk-foot">
            <span><span className="kbd">↑</span><span className="kbd">↓</span> gez</span>
            <span><span className="kbd">⏎</span> seç</span>
            <span><span className="kbd">esc</span> kapat</span>
          </div>
        </div>
      </div>
    );
  }

  window.Palette = Palette;
})();
