/* ============================================================
   Reports — Apple Health / Screen Time hissi
   Hub + Monthly · Yearly · All-time + Export bar
============================================================ */
(function () {
  const { useState } = React;
  const D = window.DATA;

  // ---------- Real export bar ----------
  function ExportBar({ payload }) {
    const safe = payload || { name: "rapor", rows: [], summary: "" };
    const stamp = new Date().toISOString().slice(0, 10);
    const base  = (safe.name || "rapor").toLowerCase().replace(/\s+/g, "-");

    function onCSV() {
      if (!safe.rows || !safe.rows.length) {
        window.TBToast?.push("CSV için satır yok", "warn");
        return;
      }
      window.TBExport.csv(safe.rows, base + "-" + stamp + ".csv");
    }

    function onPDF() {
      const summary = safe.summary || "";
      const stats = (safe.stats || []).map(s => (
        '<span class="stat"><div class="muted">' + s.label + '</div><div class="v">' + s.value + '</div></span>'
      )).join("");
      const head = (safe.rows && safe.rows.length) ? Object.keys(safe.rows[0]) : [];
      const tableHead = head.map(h => "<th>" + h + "</th>").join("");
      const tableBody = (safe.rows || []).map(r =>
        "<tr>" + head.map(h => "<td>" + (r[h] == null ? "" : String(r[h])) + "</td>").join("") + "</tr>"
      ).join("");
      const html =
        '<h1>' + (safe.title || "Rapor") + '</h1>' +
        '<div class="muted">' + (safe.period || "") + ' · indirildi ' + stamp + '</div>' +
        (stats ? '<h2>Özet</h2><div>' + stats + '</div>' : "") +
        (summary ? '<h2>AI Notu</h2><p>' + summary + '</p>' : "") +
        ((safe.rows && safe.rows.length) ? '<h2>Detay</h2><table><thead><tr>' + tableHead + '</tr></thead><tbody>' + tableBody + '</tbody></table>' : "");
      window.TBExport.print(html, safe.title || "Rapor");
    }

    function onSheets() {
      window.TBToast?.push("Google Sheets bağlantısı yok · Settings → Data Sources", "warn");
    }

    return (
      <div className="flex gap8 wrap">
        <button className="btn ghost" onClick={onPDF}><Icon name="download" /> PDF</button>
        <button className="btn ghost" onClick={onCSV}><Icon name="file" /> CSV</button>
        <button className="btn ghost" onClick={onSheets}><Icon name="grid" /> Google Sheets</button>
      </div>
    );
  }

  function SummaryStat({ label, value, tone, sub }) {
    return (
      <div className="card flat tight" style={{ minWidth: 140 }}>
        <span className="card-eyebrow">{label}</span>
        <span className="serif" style={{ fontSize: 28, fontStyle: "italic", color: "var(--" + (tone || "tx-0") + ")", fontWeight: 380, letterSpacing: "-0.02em" }}>{value}</span>
        {sub && <span className="muted" style={{ fontSize: 11.5 }}>{sub}</span>}
      </div>
    );
  }

  function MonthlyDetail({ back }) {
    const r = D.monthlyReport;
    const payload = {
      name: "aylik-rapor",
      title: "Aylık Rapor",
      period: r.period,
      stats: [
        { label: "Gelir",    value: D.fmt(r.income) },
        { label: "Gider",    value: D.fmt(r.expense) },
        { label: "Tasarruf", value: D.fmt(r.savings) },
        { label: "Tasarruf oranı", value: "%" + r.savingsRate },
      ],
      summary: r.summary + " · " + r.nextMonth,
      rows: (r.biggest || []).map((b, i) => ({
        sira: i + 1,
        baslik: b.name,
        kategori: b.category,
        tutar: b.amount,
      })),
    };
    return (
      <div className="page">
        <div className="page-head">
          <div>
            <button className="btn ghost sm" onClick={back}><Icon name="chevLeft" /> Reports</button>
            <div className="page-eyebrow" style={{ marginTop: 12 }}>{r.period}</div>
            <h1 className="page-title">Monthly Report</h1>
          </div>
          <ExportBar payload={payload} />
        </div>

        <div className="grid-4">
          <SummaryStat label="Toplam Gelir"   value={D.fmtK(r.income)}     tone="pos" />
          <SummaryStat label="Toplam Gider"   value={D.fmtK(r.expense)}    tone="neg" />
          <SummaryStat label="Net Tasarruf"   value={D.fmtK(r.savings)}    tone="ac"  sub={"oran %" + r.savingsRate.toString().replace(".", ",")} />
          <SummaryStat label="Sabit Gider"    value={"%" + r.fixedRatio.toString().replace(".", ",")} tone="warn" sub="net gelirden" />
        </div>

        <div className="grid-12">
          <div className="card span-7">
            <div className="card-title">En büyük 5 harcama</div>
            {r.biggest.map((b, i) => (
              <div className="lrow" key={i}>
                <span style={{ width: 22, height: 22, borderRadius: 7, background: "var(--bg-3)", color: "var(--tx-1)", display: "grid", placeItems: "center", fontFamily: "var(--mono)", fontSize: 11 }}>{i + 1}</span>
                <div className="l-main">
                  <b>{b.name}</b>
                  <span>{b.category}</span>
                </div>
                <span className="l-amt mono">{D.fmt(b.amount)}</span>
              </div>
            ))}
          </div>
          <div className="card span-5">
            <div className="card-title">Kategori değişimi</div>
            {r.deltas.map((d, i) => (
              <div className="lrow" key={i}>
                <span className="l-main">
                  <b>{d.cat}</b>
                  <span>geçen aya göre</span>
                </span>
                <span className={"chip " + (d.delta > 0 ? "tone-neg" : "tone-pos")}>
                  {d.delta > 0 ? "+" : ""}{d.delta}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-3">
          <SummaryStat label="Kart Borcu Δ"   value={(r.cardDebtChange > 0 ? "+" : "") + D.fmtK(r.cardDebtChange)} tone={r.cardDebtChange > 0 ? "neg" : "pos"} />
          <SummaryStat label="Yatırım Δ"       value={(r.investmentChange > 0 ? "+" : "") + D.fmtK(r.investmentChange)} tone={r.investmentChange > 0 ? "pos" : "neg"} />
          <SummaryStat label="Hedef İlerleme"  value="+%4.1" tone="ac" />
        </div>

        <div className="card" style={{ background: "linear-gradient(180deg, var(--ac-soft), transparent 60%), var(--bg-2)" }}>
          <div className="card-eyebrow">AI · ay özeti</div>
          <p style={{ fontSize: 16, fontFamily: "var(--serif)", color: "var(--tx-0)", lineHeight: 1.55 }}>
            {r.summary}
          </p>
          <div className="ai-rationale">— {r.nextMonth}</div>
        </div>
      </div>
    );
  }

  function YearlyDetail({ back }) {
    const r = D.yearlyReport;
    const payload = {
      name: "yillik-rapor",
      title: "Yıllık Rapor",
      period: r.period,
      stats: [
        { label: "Yıllık Gelir",    value: D.fmt(r.income) },
        { label: "Yıllık Gider",    value: D.fmt(r.expense) },
        { label: "Yıllık Tasarruf", value: D.fmt(r.savings) },
        { label: "Yatırım Δ",       value: "+%" + r.investment.change },
      ],
      summary: r.summary,
      rows: [
        { metrik: "Yatırım başlangıç", deger: r.investment.start },
        { metrik: "Yatırım son",       deger: r.investment.end },
        { metrik: "Kart borcu son",    deger: r.cardDebt.end },
      ],
    };
    return (
      <div className="page">
        <div className="page-head">
          <div>
            <button className="btn ghost sm" onClick={back}><Icon name="chevLeft" /> Reports</button>
            <div className="page-eyebrow" style={{ marginTop: 12 }}>{r.period}</div>
            <h1 className="page-title">Yearly Report</h1>
          </div>
          <ExportBar payload={payload} />
        </div>

        <div className="grid-4">
          <SummaryStat label="Yıllık Gelir"     value={D.fmtK(r.income)}  tone="pos" />
          <SummaryStat label="Yıllık Gider"     value={D.fmtK(r.expense)} tone="neg" />
          <SummaryStat label="Yıllık Tasarruf"  value={D.fmtK(r.savings)} tone="ac" sub={"oran %" + r.savingsRate.toString().replace(".", ",")} />
          <SummaryStat label="Yatırım Δ"        value={"+%" + r.investment.change.toString().replace(".", ",")} tone="inv" />
        </div>

        <div className="card">
          <div className="card-title">Yatırım büyümesi</div>
          <div className="flex gap14 wrap">
            <SummaryStat label="Başlangıç" value={D.fmtK(r.investment.start)} />
            <SummaryStat label="Bugün"     value={D.fmtK(r.investment.end)} tone="pos" />
            <SummaryStat label="Kart Borcu" value={D.fmtK(r.cardDebt.end)} tone="neg" sub={"+%" + r.cardDebt.change} />
          </div>
        </div>

        <div className="card" style={{ background: "linear-gradient(180deg, var(--ac-soft), transparent 60%), var(--bg-2)" }}>
          <div className="card-eyebrow">AI · yıl özeti</div>
          <p style={{ fontSize: 16, fontFamily: "var(--serif)", color: "var(--tx-0)", lineHeight: 1.55 }}>{r.summary}</p>
        </div>
      </div>
    );
  }

  function AllTimeDetail({ back }) {
    const r = D.allTimeReport;
    const payload = {
      name: "tum-zamanlar",
      title: "All-time Overview",
      period: r.period,
      stats: [
        { label: "Toplam Gelir",    value: D.fmt(r.income) },
        { label: "Toplam Gider",    value: D.fmt(r.expense) },
        { label: "Toplam Tasarruf", value: D.fmt(r.savings) },
        { label: "Net Değer",       value: D.fmt(r.networth.end) },
      ],
      summary: r.summary,
      rows: [
        { metrik: "Net değer başlangıç", deger: r.networth.start },
        { metrik: "Net değer son",       deger: r.networth.end },
        { metrik: "Tasarruf oranı",      deger: "%" + r.savingsRate },
      ],
    };
    return (
      <div className="page">
        <div className="page-head">
          <div>
            <button className="btn ghost sm" onClick={back}><Icon name="chevLeft" /> Reports</button>
            <div className="page-eyebrow" style={{ marginTop: 12 }}>{r.period}</div>
            <h1 className="page-title">All-time Overview</h1>
          </div>
          <ExportBar payload={payload} />
        </div>
        <div className="grid-4">
          <SummaryStat label="Toplam Gelir"     value={D.fmtK(r.income)}  tone="pos" />
          <SummaryStat label="Toplam Gider"     value={D.fmtK(r.expense)} tone="neg" />
          <SummaryStat label="Toplam Tasarruf"  value={D.fmtK(r.savings)} tone="ac"  sub={"ort. oran %" + r.savingsRate.toString().replace(".", ",")} />
          <SummaryStat label="Net Değer"        value={D.fmtK(r.networth.end)} tone="inv" sub={"× " + (r.networth.end / r.networth.start).toFixed(1).replace(".", ",")} />
        </div>
        <div className="card" style={{ background: "linear-gradient(180deg, var(--ac-soft), transparent 60%), var(--bg-2)" }}>
          <div className="card-eyebrow">AI · uzun dönem özet</div>
          <p style={{ fontSize: 16, fontFamily: "var(--serif)", color: "var(--tx-0)", lineHeight: 1.55 }}>{r.summary}</p>
        </div>
      </div>
    );
  }

  function ReportsHub({ go }) {
    const tiles = [
      { id: "monthly", label: "Aylık", icon: "reports", body: "Mayıs 2026 · ana odak", tone: "ac" },
      { id: "yearly",  label: "Yıllık", icon: "trending", body: "Son 12 ay · yatırım odaklı", tone: "inv" },
      { id: "all",     label: "Tüm Zamanlar", icon: "layers", body: "32 ay · net değer eğrisi", tone: "pos" },
      { id: "weekly",  label: "Haftalık", icon: "book", body: "Bu hafta · hızlı özet", tone: "neutral" },
      { id: "daily",   label: "Günlük", icon: "spark", body: "Bugün · küçük gözlemler", tone: "warn" },
      { id: "custom",  label: "Özel Aralık", icon: "filter", body: "Kendin seç", tone: "neutral" },
    ];
    return (
      <div className="page">
        <div className="page-head">
          <div>
            <div className="page-eyebrow">Raporlar</div>
            <h1 className="page-title">Reports</h1>
            <p className="page-sub">Apple Health / Screen Time hissi · sakin, ölçülebilir, dışa aktarılabilir.</p>
          </div>
          <ExportBar />
        </div>

        <div className="grid-3">
          {tiles.map(t => (
            <div key={t.id} className="card" style={{ cursor: "pointer", transition: "transform 220ms var(--ease)" }}
                 onClick={() => go(t.id)}>
              <div className="flex gap8">
                <span className="l-ic" style={{ background: "var(--" + t.tone + "-soft, var(--bg-3))", color: "var(--" + t.tone + ", var(--tx-1))" }}>
                  <Icon name={t.icon} />
                </span>
                <div>
                  <b style={{ fontSize: 14 }}>{t.label}</b>
                  <span className="muted" style={{ fontSize: 11.5, display: "block", marginTop: 2 }}>{t.body}</span>
                </div>
              </div>
              <div className="flex between" style={{ alignItems: "center" }}>
                <span className="muted mono" style={{ fontSize: 10.5, letterSpacing: "0.06em" }}>aç</span>
                <Icon name="arrowRight" style={{ width: 13, height: 13, color: "var(--tx-2)" }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ background: "linear-gradient(180deg, var(--ac-soft), transparent 60%), var(--bg-2)" }}>
          <div className="card-eyebrow">AI · genel rapor önerisi</div>
          <p style={{ fontSize: 15, fontFamily: "var(--serif)", color: "var(--tx-0)", lineHeight: 1.5 }}>
            Bu ay için en faydalı rapor <b>Aylık Rapor</b>. Tasarruf trendi ve restoran kategorisi sapmasını birlikte gösterir.
          </p>
        </div>
      </div>
    );
  }

  function Reports() {
    const [view, setView] = useState("hub");
    if (view === "monthly") return <MonthlyDetail back={() => setView("hub")} />;
    if (view === "yearly")  return <YearlyDetail  back={() => setView("hub")} />;
    if (view === "all")     return <AllTimeDetail back={() => setView("hub")} />;
    return <ReportsHub go={setView} />;
  }

  window.Reports = Reports;
})();
