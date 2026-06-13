/* ============================================================
   Shared widgets — calm, Apple-vari
   AIRow · AINote · AIBadge · TimeFilter · PeriodSwitch
   Confidence · SourceBadge · EmptyState · KbdHint
============================================================ */
(function () {
  const { useState, useRef, useEffect } = React;

  const tone = {
    ac:   { bg: "var(--ac-soft)",   fg: "var(--ac)" },
    pos:  { bg: "var(--pos-soft)",  fg: "var(--pos)" },
    neg:  { bg: "var(--neg-soft)",  fg: "var(--neg)" },
    warn: { bg: "var(--warn-soft)", fg: "var(--warn)" },
    inv:  { bg: "var(--inv-soft)",  fg: "var(--inv)" },
    neutral: { bg: "var(--bg-3)",   fg: "var(--tx-1)" },
  };

  // ----------------- AIRow -----------------
  function AIRow({ tone: t = "ac", icon = "spark", title, html, children, rationale, style }) {
    const c = tone[t] || tone.ac;
    return (
      <div className="ai-row" style={style}>
        <span className="ai-ic" style={{ background: c.bg, color: c.fg }}>
          <Icon name={icon} />
        </span>
        <div className="ai-body">
          {title && <b style={{ display: "block", marginBottom: 2 }}>{title}</b>}
          {html
            ? <span dangerouslySetInnerHTML={{ __html: html }} />
            : <span>{children}</span>}
          {rationale && <div className="ai-rationale">— {rationale}</div>}
        </div>
      </div>
    );
  }

  // ----------------- AINote -----------------
  function AINote({ children }) {
    return (
      <div className="ai-note">
        <span className="ai-dot" />
        <span>{children}</span>
      </div>
    );
  }

  // ----------------- AIBadge -----------------
  function AIBadge({ label = "AI", icon = "spark" }) {
    return (
      <span className="ai-badge"><Icon name={icon} style={{ width: 9, height: 9 }} /> {label}</span>
    );
  }

  // ----------------- TimeFilter -----------------
  const TF_OPTIONS = [
    { id: "day",    label: "Günlük" },
    { id: "week",   label: "Haftalık" },
    { id: "month",  label: "Aylık" },
    { id: "q",      label: "3 Aylık" },
    { id: "h",      label: "6 Aylık" },
    { id: "year",   label: "Yıllık" },
    { id: "all",    label: "Tüm Zamanlar" },
    { id: "custom", label: "Özel Aralık" },
  ];
  function TimeFilter({ value = "month", onChange = () => {}, options = TF_OPTIONS, dense }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
      const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, []);
    const cur = options.find(o => o.id === value) || options[2];
    return (
      <div className="time-pop" ref={ref}>
        <button className={"btn ghost " + (dense ? "sm" : "")} onClick={() => setOpen(o => !o)}>
          <Icon name="filter" />
          <span>{cur.label}</span>
          <Icon name="chevDown" style={{ width: 11, height: 11, opacity: 0.6 }} />
        </button>
        {open && (
          <div className="pop">
            {options.map(o => (
              <button key={o.id}
                className={o.id === value ? "active" : ""}
                onClick={() => { onChange(o.id); setOpen(false); }}>
                <span>{o.label}</span>
                {o.id === value && <span className="check"><Icon name="check" style={{ width: 12, height: 12 }} /></span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ----------------- PeriodSwitch (segmented) -----------------
  function PeriodSwitch({ value, onChange, options }) {
    return (
      <div className="seg">
        {options.map(o => (
          <button key={o.id}
            className={"seg-btn " + (o.id === value ? "active" : "")}
            onClick={() => onChange(o.id)}>{o.label}</button>
        ))}
      </div>
    );
  }

  // ----------------- Confidence -----------------
  function Confidence({ value = 0.9, label = true, dense = false }) {
    const pct = Math.round(value * 100);
    const t = value >= 0.92 ? "pos" : value >= 0.8 ? "ac" : "warn";
    const c = tone[t];
    return (
      <span className="confbar" title={`AI güven: ${pct}%`}>
        {label && !dense && <span>güven</span>}
        <span className="conf-track" style={{ width: dense ? 28 : 36 }}>
          <span className="conf-fill" style={{ width: pct + "%", background: c.fg }} />
        </span>
        <span className="mono" style={{ color: c.fg }}>{pct}%</span>
      </span>
    );
  }

  // ----------------- SourceBadge -----------------
  function SourceBadge({ source }) {
    const map = {
      whatsapp: { label: "WhatsApp", icon: "whatsapp", tone: "pos" },
      sheets:   { label: "Sheets",   icon: "sheet",    tone: "ac" },
      manual:   { label: "Manuel",   icon: "edit",     tone: "neutral" },
      bank:     { label: "Banka",    icon: "card",     tone: "inv" },
    };
    const m = map[source] || map.manual;
    const c = tone[m.tone];
    return (
      <span className="chip" style={{ color: c.fg, background: c.bg, borderColor: "transparent", letterSpacing: 0 }}>
        <Icon name={m.icon} style={{ width: 11, height: 11 }} />
        {m.label}
      </span>
    );
  }

  // ----------------- KbdHint -----------------
  function Kbd({ k }) {
    return <span className="kbd">{k}</span>;
  }

  // ----------------- EmptyState -----------------
  function EmptyState({ icon = "info", title, body, action }) {
    return (
      <div className="card" style={{ alignItems: "center", textAlign: "center", padding: "44px 28px", gap: 10 }}>
        <span style={{ width: 38, height: 38, borderRadius: 12, background: "var(--bg-3)", color: "var(--tx-2)", display: "grid", placeItems: "center" }}>
          <Icon name={icon} />
        </span>
        <b style={{ fontSize: 14, color: "var(--tx-0)" }}>{title}</b>
        <span style={{ fontSize: 12.5, color: "var(--tx-2)", maxWidth: 360 }}>{body}</span>
        {action && <div style={{ marginTop: 10 }}>{action}</div>}
      </div>
    );
  }

  // ----------------- ProgressRing (used by goals) -----------------
  function ProgressRing({ value = 0, size = 56, stroke = 5, color = "var(--ac)" }) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const off = c - (value / 100) * c;
    return (
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--bg-3)" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
                strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
                transform={`rotate(-90 ${size/2} ${size/2})`} />
        <text x={size/2} y={size/2 + 4} textAnchor="middle"
              fontFamily="var(--mono)" fontSize={size > 56 ? 13 : 11}
              fill="var(--tx-0)" fontWeight="500">
          {Math.round(value)}%
        </text>
      </svg>
    );
  }

  // ----------------- RiskPill -----------------
  function RiskPill({ level = "safe" }) {
    const map = { safe: ["Güvenli", "tone-pos"], watch: ["İzlemede", "tone-warn"], critical: ["Kritik", "tone-neg"] };
    const [label, cls] = map[level] || map.safe;
    return <span className={"chip " + cls}>{label}</span>;
  }

  // ----------------- Greeting helper -----------------
  function greeting(name) {
    const h = new Date().getHours();
    const base = h < 5 ? "İyi geceler"
              : h < 12 ? "Günaydın"
              : h < 18 ? "Tünaydın"
              : "İyi akşamlar";
    return name ? `${base}, ${name}.` : `${base}.`;
  }

  Object.assign(window, {
    AIRow, AINote, AIBadge, TimeFilter, PeriodSwitch, Confidence,
    SourceBadge, Kbd, EmptyState, ProgressRing, RiskPill, greeting,
    TF_OPTIONS,
  });
})();
