/* ============================================================
   Dashboard — the heart of the OS.
   Apple Health / Wallet vibe. Calm, premium, time-aware.
============================================================ */
(function () {
  const { useState } = React;
  const D = window.DATA;

  // -------- Delta chip --------
  function Delta({ v, bad }) {
    if (v == null || isNaN(v)) return null;
    if (v === 0) return <span className="delta flat">— 0%</span>;
    const up = v > 0;
    const cls = bad ? (up ? "down" : "up") : (up ? "up" : "down");
    return (
      <span className={"delta " + cls}>
        <Icon name={up ? "arrowUp" : "arrowDown"} />
        {Math.abs(v).toFixed(1).replace(".", ",")}%
      </span>
    );
  }

  // -------- KPI card --------
  function KpiCard({ k }) {
    const val = k.unit === "%"
      ? k.value.toFixed(1).replace(".", ",") + "%"
      : D.fmtK(k.value);
    return (
      <div className="kpi">
        <span className="kpi-label">{k.label}</span>
        <div className="kpi-row" style={{ alignItems: "baseline" }}>
          <span className="kpi-value">{val}</span>
          <Delta v={k.delta} bad={k.badDelta} />
        </div>
        <div className="kpi-row">
          <span className="kpi-spark">
            <Sparkline data={k.spark} color={k.badDelta ? "var(--neg)" : (k.delta > 0 ? "var(--pos)" : "var(--tx-2)")} w={120} h={28} />
          </span>
        </div>
        <div className="kpi-ai">
          <b>AI</b>{k.ai}
        </div>
      </div>
    );
  }

  // -------- Today's Brief --------
  function TodaysBrief() {
    return (
      <div className="card" style={{ background: "linear-gradient(180deg, var(--ac-soft), transparent 60%), var(--bg-2)" }}>
        <div className="card-head">
          <div className="card-eyebrow">Today's Brief</div>
          <AIBadge label="AI · sakin" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="serif" style={{ fontSize: 24, color: "var(--tx-0)", lineHeight: 1.25, fontStyle: "italic", fontWeight: 380, letterSpacing: "-0.01em" }}>
            {greeting(D.user.name)}
          </div>
          <p style={{ fontSize: 15, color: "var(--tx-1)", lineHeight: 1.45, maxWidth: "62ch", fontFamily: "var(--serif)" }}>
            Bu ay tasarruf hedefinin önündesin, ama restoran harcamaların normal bandının üzerinde.
          </p>
          <div className="ai-rationale" style={{ marginTop: 4 }}>
            — Son 30 günde restoran harcamaların ₺7.250 (geçen aya göre +%34). Tasarruf oranın %58.2.
          </div>
        </div>
        <div className="flex gap8 wrap" style={{ marginTop: 4 }}>
          <span className="chip tone-pos">Plan: önde</span>
          <span className="chip tone-warn">Restoran: dikkat</span>
          <span className="chip tone-ac">2 onay bekliyor</span>
          <span className="chip">3 yaklaşan ödeme</span>
        </div>
      </div>
    );
  }

  // -------- Health score --------
  function HealthScore() {
    const score = 82;
    const items = [
      { label: "Tasarruf oranı", val: 58.2, max: 60, tone: "pos" },
      { label: "Sabit gider oranı", val: 41.8, max: 45, tone: "warn", invert: true },
      { label: "Kart kullanım oranı", val: 53, max: 35, tone: "warn", invert: true },
      { label: "Acil fon (ay)", val: 1.6, max: 6, tone: "ac" },
      { label: "Yatırım çeşitliliği", val: 8, max: 10, tone: "inv" },
    ];
    return (
      <div className="card">
        <div className="card-head">
          <div className="card-title">Financial Health</div>
          <AIBadge label="Skor" />
        </div>
        <div className="flex gap14" style={{ alignItems: "center" }}>
          <ProgressRing value={score} size={86} stroke={7} color="var(--pos)" />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span className="serif" style={{ fontSize: 26, fontStyle: "italic", color: "var(--tx-0)", fontWeight: 380 }}>İyi</span>
            <span className="dim" style={{ fontSize: 12 }}>Genel finansal sağlık skoru</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
          {items.map((it, i) => {
            const pct = Math.min(100, (it.val / it.max) * 100);
            return (
              <div key={i}>
                <div className="flex between" style={{ marginBottom: 4 }}>
                  <span className="dim" style={{ fontSize: 12 }}>{it.label}</span>
                  <span className="mono" style={{ fontSize: 11.5, color: "var(--tx-0)" }}>
                    {typeof it.val === "number" ? it.val.toString().replace(".", ",") : it.val}
                    {it.label.includes("oran") || it.label.includes("kullanım") ? "%" : ""}
                  </span>
                </div>
                <div className={"meter sm tone-" + it.tone}>
                  <div className="meter-fill" style={{ width: pct + "%" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------- Cash Flow --------
  function CashFlow() {
    const [period, setPeriod] = useState("month");
    return (
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-eyebrow">Cash Flow</div>
            <div className="card-title" style={{ fontSize: 16, marginTop: 2 }}>Gelir vs gider</div>
          </div>
          <TimeFilter value={period} onChange={setPeriod} dense />
        </div>
        <AreaChart labels={D.cashflow.labels} income={D.cashflow.income} expense={D.cashflow.expense} height={220} />
        <div className="flex gap14 wrap" style={{ marginTop: 6 }}>
          <span className="legend" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <span className="sw" style={{ width: 9, height: 9, borderRadius: 3, background: "var(--pos)" }}></span>
            <span className="dim" style={{ fontSize: 12 }}>Gelir</span>
            <span className="mono" style={{ fontSize: 11.5 }}>{D.fmtK(D.cashflow.income[D.cashflow.income.length-1])}</span>
          </span>
          <span className="legend" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <span className="sw" style={{ width: 9, height: 9, borderRadius: 3, background: "var(--neg)" }}></span>
            <span className="dim" style={{ fontSize: 12 }}>Gider</span>
            <span className="mono" style={{ fontSize: 11.5 }}>{D.fmtK(D.cashflow.expense[D.cashflow.expense.length-1])}</span>
          </span>
          <span className="legend" style={{ flexDirection: "row", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <span className="dim" style={{ fontSize: 12 }}>Net tasarruf (Haz)</span>
            <span className="mono" style={{ color: "var(--pos)", fontSize: 13 }}>{D.fmtK(D.cashflow.income[D.cashflow.income.length-1] - D.cashflow.expense[D.cashflow.expense.length-1])}</span>
          </span>
        </div>
      </div>
    );
  }

  // -------- Spending donut --------
  function SpendingAnalysis() {
    const total = D.categories.reduce((s, c) => s + c.value, 0);
    return (
      <div className="card">
        <div className="card-head">
          <div className="card-title">Spending Analysis</div>
          <AIBadge label="Bu Ay" />
        </div>
        <div className="flex gap22 wrap" style={{ alignItems: "center" }}>
          <Donut data={D.categories} size={170} thickness={16}
            center={<><b>{D.fmtK(total)}</b><span>Bu ay</span></>} />
          <div className="legend" style={{ flex: 1, minWidth: 200 }}>
            {D.categories.map((c, i) => (
              <div className="lg-row" key={i}>
                <span className="sw" style={{ background: c.color }} />
                <span className="lg-name">{c.name}</span>
                <span className="lg-val">{D.fmtK(c.value)}</span>
                <span className="muted mono" style={{ fontSize: 10.5, minWidth: 36, textAlign: "right" }}>{c.pct.toString().replace(".", ",")}%</span>
              </div>
            ))}
          </div>
        </div>
        <AIRow tone="warn" icon="info" rationale="restoran rolling 30g vs prev 30g">
          Restoran harcaman normalin <b>%34</b> üzerinde. Kalan günlerde günlük <b>₺310</b> limit yeterli olur.
        </AIRow>
      </div>
    );
  }

  // -------- Credit Card Center --------
  function CreditCenter({ setPage }) {
    const cards = D.cards.slice(0, 2);
    const totalDebt = D.cards.reduce((s, c) => s + c.debt, 0);
    return (
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-eyebrow">Credit Cards</div>
            <div className="card-title" style={{ fontSize: 16, marginTop: 2 }}>{D.fmtK(totalDebt)} toplam borç</div>
          </div>
          <button className="btn ghost sm" onClick={() => setPage("cards")}>
            Tümü <Icon name="arrowRight" />
          </button>
        </div>
        <div className="grid-2" style={{ gap: 12 }}>
          {cards.map(c => (
            <div className={"cc " + c.brand} key={c.id}>
              <div>
                <div className="cc-bank">{c.bank}</div>
                <div className="cc-name">{c.name}</div>
              </div>
              <div>
                <div className="cc-debt-label">Güncel borç</div>
                <div className="cc-debt">{D.fmtK(c.debt)}</div>
              </div>
              <div className="cc-foot">
                <div>
                  <div className="cc-num">{c.num}</div>
                  <div className="cc-due">son ödeme · {c.due.slice(8,10)}.{c.due.slice(5,7)}</div>
                </div>
                <RiskPill level={c.risk} />
              </div>
            </div>
          ))}
        </div>
        <AIRow tone="neg" icon="info" rationale="limit kullanımı %66, 60g trend yukarı">
          Akbank kartı <b>limit eşiğine yaklaşıyor</b>. Bu ay yeni harcamayı durdurmak iyi olur.
        </AIRow>
      </div>
    );
  }

  // -------- Upcoming payments --------
  function Upcoming() {
    return (
      <div className="card">
        <div className="card-head">
          <div className="card-title">Upcoming</div>
          <span className="muted mono" style={{ fontSize: 11 }}>{D.upcoming.length} ödeme</span>
        </div>
        <div>
          {D.upcoming.map((u, i) => (
            <div className="lrow" key={i}>
              <span className="l-ic">
                <Icon name={u.kind === "card" ? "card" : u.kind === "rent" ? "home" : "bolt"} />
              </span>
              <div className="l-main">
                <b>{u.name}</b>
                <span>
                  {u.days} gün · {u.date.slice(8,10)}.{u.date.slice(5,7)}
                  {u.risk === "watch" && <> · <span style={{ color: "var(--warn)" }}>İzlemede</span></>}
                </span>
              </div>
              <span className="l-amt mono">{D.fmt(u.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -------- AI Coach mini --------
  function AICoachCard({ setPage }) {
    const insights = D.aiTimeline.slice(0, 3);
    return (
      <div className="card" style={{ background: "linear-gradient(180deg, var(--ac-soft), transparent 60%), var(--bg-2)" }}>
        <div className="card-head">
          <div>
            <div className="card-eyebrow">AI Coach</div>
            <div className="card-title" style={{ fontSize: 16, marginTop: 2 }}>3 yeni gözlem</div>
          </div>
          <button className="btn ai sm" onClick={() => setPage("ai")}>Aç <Icon name="arrowRight" /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {insights.map((it, i) => (
            <AIRow key={i} tone={it.tone} icon={it.tone === "warn" ? "info" : it.tone === "neg" ? "info" : "spark"} title={it.title}>
              {it.body}
            </AIRow>
          ))}
        </div>
      </div>
    );
  }

  // -------- WhatsApp recent --------
  function WhatsAppRecent({ setPage }) {
    const items = D.waInbox.slice(0, 3);
    const todayTotal = D.waInbox.reduce((s, m) =>
      m.parsed.category !== "Gelir" && m.parsed.category !== "Kart Borcu" && m.parsed.category !== "Hedef"
        ? s + m.parsed.amount : s, 0);
    return (
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-eyebrow flex gap8" style={{ alignItems: "center" }}>
              <span style={{ color: "var(--pos)" }}>● </span>
              WhatsApp Inbox
            </div>
            <div className="card-title" style={{ fontSize: 16, marginTop: 2 }}>Bugün {D.fmtK(todayTotal)} parse edildi</div>
          </div>
          <button className="btn ghost sm" onClick={() => setPage("whatsapp")}>Aç <Icon name="arrowRight" /></button>
        </div>
        <div>
          {items.map((m, i) => (
            <div className="lrow" key={i}>
              <span className="l-ic"><Icon name="whatsapp" /></span>
              <div className="l-main">
                <b>{m.parsed.name}</b>
                <span>{m.parsed.category} · {m.parsed.card} · {m.time}</span>
              </div>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                <span className="l-amt mono">{D.fmt(m.parsed.amount)}</span>
                <Confidence value={m.parsed.confidence} dense label={false} />
              </span>
            </div>
          ))}
        </div>
        <span className="muted" style={{ fontSize: 11.5, fontFamily: "var(--mono)", letterSpacing: "0.04em" }}>
          Yalnızca Taha'nın numarasından gelen mesajlar parse edilir.
        </span>
      </div>
    );
  }

  // -------- Investments mini --------
  function InvestMini({ setPage }) {
    const inv = D.investments;
    const ret = ((inv.total - inv.costBase) / inv.costBase) * 100;
    return (
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-eyebrow">Investments</div>
            <div className="card-title" style={{ fontSize: 16, marginTop: 2 }}>{D.fmtK(inv.total)}</div>
          </div>
          <button className="btn ghost sm" onClick={() => setPage("investments")}>Aç <Icon name="arrowRight" /></button>
        </div>
        <div className="flex gap14" style={{ alignItems: "baseline" }}>
          <span className="delta up mono">+{ret.toFixed(1).replace(".", ",")}%</span>
          <span className="dim" style={{ fontSize: 12 }}>maliyet baz · {D.fmtK(inv.costBase)}</span>
          <span className="muted mono" style={{ fontSize: 11, marginLeft: "auto" }}>günlük {D.fmt(inv.dailyChange)}</span>
        </div>
        <LineChart data={inv.perf.values} labels={inv.perf.labels} height={140} color="var(--inv)" />
        <span className="muted" style={{ fontSize: 11 }}>
          Bu bir yatırım tavsiyesi değildir; yalnızca kişisel takip analizi.
        </span>
      </div>
    );
  }

  // -------- Goals row --------
  function GoalsRow({ setPage }) {
    return (
      <div className="card">
        <div className="card-head">
          <div className="card-title">Goals</div>
          <button className="btn ghost sm" onClick={() => setPage("goals")}>Tümü <Icon name="arrowRight" /></button>
        </div>
        <div className="grid-2" style={{ gap: 12 }}>
          {D.goals.slice(0, 4).map(g => {
            const pct = Math.round((g.current / g.target) * 100);
            return (
              <div key={g.id} style={{
                padding: 14, background: "var(--bg-1)", borderRadius: 14,
                border: "1px solid var(--line-soft)",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <ProgressRing value={pct} size={48} stroke={4} color={pct > 70 ? "var(--pos)" : "var(--ac)"} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ fontSize: 13, color: "var(--tx-0)" }}>{g.name}</b>
                  <div className="dim" style={{ fontSize: 11.5, marginTop: 2 }}>
                    {D.fmtK(g.current)} / {D.fmtK(g.target)} · {g.due}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------- Page composition --------
  function Dashboard({ setPage }) {
    return (
      <div className="page">
        <div className="page-head">
          <div>
            <div className="page-eyebrow">Bu Ay · Haziran 2026</div>
            <h1 className="page-title">{greeting(D.user.name)}</h1>
            <p className="page-sub">
              Bu ay tasarruf hedefinin önündesin, ama restoran harcamaların normal bandının üzerinde.
            </p>
          </div>
          <div className="flex gap8">
            <TimeFilter value="month" onChange={() => {}} />
            <button className="btn ai" onClick={() => setPage("ai")}>
              <Icon name="ai" /> AI Coach
            </button>
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid-4">
          {D.kpis.map(k => <KpiCard key={k.id} k={k} />)}
        </div>

        {/* Cash flow + Health */}
        <div className="grid-12">
          <div className="span-8"><CashFlow /></div>
          <div className="span-4"><HealthScore /></div>
        </div>

        {/* Spending + Credit + Upcoming */}
        <div className="grid-12">
          <div className="span-7"><SpendingAnalysis /></div>
          <div className="span-5"><Upcoming /></div>
        </div>

        {/* Credit + AI Coach */}
        <div className="grid-12">
          <div className="span-7"><CreditCenter setPage={setPage} /></div>
          <div className="span-5"><AICoachCard setPage={setPage} /></div>
        </div>

        {/* WhatsApp + Investments */}
        <div className="grid-12">
          <div className="span-6"><WhatsAppRecent setPage={setPage} /></div>
          <div className="span-6"><InvestMini setPage={setPage} /></div>
        </div>

        {/* Goals */}
        <GoalsRow setPage={setPage} />
      </div>
    );
  }

  window.Dashboard = Dashboard;
})();
