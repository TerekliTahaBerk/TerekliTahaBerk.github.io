/* ============================================================
   Charts — calm SVG primitives.
   Sparkline · AreaChart (dual) · Donut · LineChart · StackBar
   ------------------------------------------------------------
   Apple-vari rules:
     - Thin strokes, soft fills
     - No gridlines unless they help
     - Tabular numerals on hover labels
============================================================ */
(function () {
  const { useState, useRef, useId } = React;

  // smooth path through points (catmull-rom → bezier)
  function smooth(pts) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
    }
    return d;
  }

  // ----------------- Sparkline -----------------
  function Sparkline({ data, color = "currentColor", fill = true, w = 120, h = 30, strokeWidth = 1.4 }) {
    const id = useRef("sg" + Math.random().toString(36).slice(2, 8)).current;
    if (!data || data.length < 2) return <svg width={w} height={h} aria-hidden="true" />;
    const min = Math.min(...data), max = Math.max(...data), rng = max - min || 1;
    const pad = 2;
    const pts = data.map((v, i) => [
      pad + (i * (w - pad * 2)) / (data.length - 1),
      h - pad - ((v - min) / rng) * (h - pad * 2),
    ]);
    const d = smooth(pts);
    const area = `${d} L ${pts[pts.length - 1][0]},${h} L ${pts[0][0]},${h} Z`;
    return (
      <svg width={w} height={h} aria-hidden="true" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.20" />
            <stop offset="100%" stopColor={color} stopOpacity="0.00" />
          </linearGradient>
        </defs>
        {fill && <path d={area} fill={`url(#${id})`} />}
        <path d={d} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // ----------------- AreaChart (dual series) -----------------
  function AreaChart({ labels, income, expense, height = 240 }) {
    const id1 = useRef("ag1" + Math.random().toString(36).slice(2, 8)).current;
    const id2 = useRef("ag2" + Math.random().toString(36).slice(2, 8)).current;
    const wrapRef = useRef(null);
    const [w, setW] = useState(720);
    const [hover, setHover] = useState(null);

    React.useEffect(() => {
      if (!wrapRef.current) return;
      const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
      ro.observe(wrapRef.current);
      return () => ro.disconnect();
    }, []);

    const padL = 36, padR = 14, padT = 14, padB = 24;
    const innerW = Math.max(50, w - padL - padR);
    const innerH = height - padT - padB;
    const all = [...income, ...expense];
    const max = Math.max(...all) * 1.08;
    const min = 0;
    const xs = (i) => padL + (i * innerW) / (labels.length - 1);
    const ys = (v) => padT + innerH - ((v - min) / (max - min)) * innerH;

    const ptsI = income.map((v, i) => [xs(i), ys(v)]);
    const ptsE = expense.map((v, i) => [xs(i), ys(v)]);
    const dI = smooth(ptsI);
    const dE = smooth(ptsE);
    const aI = `${dI} L ${ptsI[ptsI.length - 1][0]},${padT + innerH} L ${ptsI[0][0]},${padT + innerH} Z`;
    const aE = `${dE} L ${ptsE[ptsE.length - 1][0]},${padT + innerH} L ${ptsE[0][0]},${padT + innerH} Z`;

    // y ticks
    const ticks = 4;
    const tickArr = [];
    for (let t = 0; t <= ticks; t++) {
      const v = (max / ticks) * t;
      tickArr.push({ v, y: ys(v) });
    }

    function onMove(e) {
      const r = wrapRef.current.getBoundingClientRect();
      const x = e.clientX - r.left;
      const ratio = Math.max(0, Math.min(1, (x - padL) / innerW));
      const idx = Math.round(ratio * (labels.length - 1));
      setHover(idx);
    }

    return (
      <div ref={wrapRef} style={{ position: "relative", width: "100%" }}
           onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={id1} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="var(--pos)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--pos)" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id={id2} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="var(--neg)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--neg)" stopOpacity="0.00" />
            </linearGradient>
          </defs>
          {/* y grid (very faint) */}
          {tickArr.map((t, i) => (
            <g key={i}>
              <line x1={padL} x2={w - padR} y1={t.y} y2={t.y} stroke="var(--line-soft)" strokeWidth="1" />
              <text x={padL - 8} y={t.y + 3} fontSize="9.5" textAnchor="end" fill="var(--tx-3)"
                    style={{ fontFamily: "var(--mono)", letterSpacing: "0.04em" }}>
                {t.v >= 1000 ? Math.round(t.v / 1000) + "K" : Math.round(t.v)}
              </text>
            </g>
          ))}
          {/* x labels */}
          {labels.map((l, i) => (
            <text key={i} x={xs(i)} y={height - 6} fontSize="9.5" textAnchor="middle" fill="var(--tx-3)"
                  style={{ fontFamily: "var(--mono)" }}>{l}</text>
          ))}
          {/* areas */}
          <path d={aI} fill={`url(#${id1})`} />
          <path d={aE} fill={`url(#${id2})`} />
          <path d={dI} stroke="var(--pos)" strokeWidth="1.6" fill="none" />
          <path d={dE} stroke="var(--neg)" strokeWidth="1.6" fill="none" />

          {/* hover line */}
          {hover != null && (
            <g>
              <line x1={xs(hover)} x2={xs(hover)} y1={padT} y2={padT + innerH}
                    stroke="var(--line-strong)" strokeDasharray="2 3" />
              <circle cx={xs(hover)} cy={ys(income[hover])} r="3.5"  fill="var(--pos)" stroke="var(--bg-2)" strokeWidth="1.5"/>
              <circle cx={xs(hover)} cy={ys(expense[hover])} r="3.5" fill="var(--neg)" stroke="var(--bg-2)" strokeWidth="1.5"/>
            </g>
          )}
        </svg>

        {/* tooltip */}
        {hover != null && (
          <div style={{
            position: "absolute",
            left: Math.min(w - 180, Math.max(0, xs(hover) - 90)),
            top: 8,
            background: "var(--bg-1)",
            border: "1px solid var(--line)",
            borderRadius: "10px",
            padding: "8px 12px",
            fontSize: "11.5px",
            pointerEvents: "none",
            display: "flex", flexDirection: "column", gap: 4,
            backdropFilter: "blur(10px)",
            boxShadow: "var(--sh-2)",
          }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "var(--tx-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {labels[hover]} · 2026
            </div>
            <div className="flex gap8" style={{ alignItems: "center" }}>
              <span style={{ width: 8, height: 8, borderRadius: 50, background: "var(--pos)" }} />
              <span style={{ color: "var(--tx-1)", flex: 1 }}>Gelir</span>
              <span className="mono" style={{ color: "var(--tx-0)" }}>₺{income[hover].toLocaleString("tr-TR")}</span>
            </div>
            <div className="flex gap8" style={{ alignItems: "center" }}>
              <span style={{ width: 8, height: 8, borderRadius: 50, background: "var(--neg)" }} />
              <span style={{ color: "var(--tx-1)", flex: 1 }}>Gider</span>
              <span className="mono" style={{ color: "var(--tx-0)" }}>₺{expense[hover].toLocaleString("tr-TR")}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------- Donut -----------------
  function Donut({ data, size = 180, thickness = 18, gap = 0.018, center }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    const r = (size - thickness) / 2;
    const c = size / 2;

    let acc = 0;
    const arcs = data.map((d, i) => {
      const frac = d.value / total;
      const a0 = acc * Math.PI * 2 - Math.PI / 2 + gap;
      const a1 = (acc + frac) * Math.PI * 2 - Math.PI / 2 - gap;
      acc += frac;
      const large = a1 - a0 > Math.PI ? 1 : 0;
      const x0 = c + r * Math.cos(a0), y0 = c + r * Math.sin(a0);
      const x1 = c + r * Math.cos(a1), y1 = c + r * Math.sin(a1);
      return { d: `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`, color: d.color, key: i };
    });

    return (
      <div className="donut-wrap" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {arcs.map(a => (
            <path key={a.key} d={a.d} stroke={a.color} strokeWidth={thickness}
                  strokeLinecap="round" fill="none" />
          ))}
        </svg>
        {center && <div className="donut-center">{center}</div>}
      </div>
    );
  }

  // ----------------- Line chart (portfolio perf) -----------------
  function LineChart({ data, color = "var(--inv)", height = 220, labels }) {
    const wrapRef = useRef(null);
    const id = useRef("ln" + Math.random().toString(36).slice(2, 8)).current;
    const [w, setW] = useState(720);
    const [hover, setHover] = useState(null);

    React.useEffect(() => {
      if (!wrapRef.current) return;
      const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
      ro.observe(wrapRef.current);
      return () => ro.disconnect();
    }, []);

    const padL = 36, padR = 14, padT = 14, padB = 24;
    const innerW = Math.max(50, w - padL - padR);
    const innerH = height - padT - padB;
    const min = Math.min(...data) * 0.97;
    const max = Math.max(...data) * 1.03;
    const xs = (i) => padL + (i * innerW) / (data.length - 1);
    const ys = (v) => padT + innerH - ((v - min) / (max - min)) * innerH;
    const pts = data.map((v, i) => [xs(i), ys(v)]);
    const d = smooth(pts);
    const area = `${d} L ${pts[pts.length - 1][0]},${padT + innerH} L ${pts[0][0]},${padT + innerH} Z`;

    function onMove(e) {
      const r = wrapRef.current.getBoundingClientRect();
      const x = e.clientX - r.left;
      const ratio = Math.max(0, Math.min(1, (x - padL) / innerW));
      const idx = Math.round(ratio * (data.length - 1));
      setHover(idx);
    }

    return (
      <div ref={wrapRef} style={{ position: "relative", width: "100%" }}
           onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={color} stopOpacity="0.00" />
            </linearGradient>
          </defs>
          <line x1={padL} x2={w - padR} y1={padT + innerH} y2={padT + innerH} stroke="var(--line-soft)" />
          {labels && labels.map((l, i) => (
            <text key={i} x={xs(i)} y={height - 6} fontSize="9.5" textAnchor="middle" fill="var(--tx-3)"
                  style={{ fontFamily: "var(--mono)" }}>{l}</text>
          ))}
          <path d={area} fill={`url(#${id})`} />
          <path d={d} stroke={color} strokeWidth="1.8" fill="none" />
          {hover != null && (
            <>
              <line x1={xs(hover)} x2={xs(hover)} y1={padT} y2={padT + innerH}
                    stroke="var(--line-strong)" strokeDasharray="2 3" />
              <circle cx={xs(hover)} cy={ys(data[hover])} r="3.5" fill={color} stroke="var(--bg-2)" strokeWidth="1.5"/>
            </>
          )}
        </svg>
        {hover != null && (
          <div style={{
            position: "absolute", left: Math.min(w - 160, Math.max(0, xs(hover) - 80)),
            top: 8, background: "var(--bg-1)", border: "1px solid var(--line)",
            borderRadius: 10, padding: "6px 10px", fontSize: 11.5, pointerEvents: "none",
          }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "var(--tx-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {labels ? labels[hover] : "Period " + hover}
            </div>
            <div className="mono" style={{ color: "var(--tx-0)" }}>₺{Math.round(data[hover]).toLocaleString("tr-TR")}</div>
          </div>
        )}
      </div>
    );
  }

  // ----------------- StackBar -----------------
  function StackBar({ data, height = 8 }) {
    const total = data.reduce((s, d) => s + d.pct, 0) || 1;
    return (
      <div className="stack" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} title={`${d.name}: ${d.pct}%`}
               style={{ width: `${(d.pct / total) * 100}%`, background: d.color }} />
        ))}
      </div>
    );
  }

  // ----------------- BarChart (vertical, simple) -----------------
  function BarChart({ data, height = 160, color = "var(--ac)", labels }) {
    const max = Math.max(...data) || 1;
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height, paddingBottom: 18, position: "relative" }}>
        {data.map((v, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
            <div style={{
              width: "100%",
              height: `${(v / max) * 100}%`,
              background: `linear-gradient(180deg, ${color}, ${color}30)`,
              borderRadius: "5px 5px 1px 1px",
              minHeight: 2,
            }} />
            {labels && (
              <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "var(--tx-3)" }}>
                {labels[i]}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  Object.assign(window, { Sparkline, AreaChart, Donut, LineChart, StackBar, BarChart, smoothPath: smooth });
})();
