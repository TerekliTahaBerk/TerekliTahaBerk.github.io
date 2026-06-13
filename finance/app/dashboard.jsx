/* ============================================================
   Dashboard — empty-first, Apple-vari minimal.
   ------------------------------------------------------------
   When DATA is empty (initial state), show a calm onboarding
   surface. When data exists, light KPI cards + cash flow.
============================================================ */
(function () {
  const { useState } = React;
  const D = window.DATA;

  // ---- KPI card (minimal, no AI footer) ----
  function KpiCard({ k }) {
    const isPct = k.unit === "%";
    const empty = !k.value;
    const val = empty
      ? "—"
      : isPct ? k.value.toFixed(1).replace(".", ",") + "%" : D.fmtK(k.value);
    return (
      <div className="kpi clean">
        <span className="kpi-label">{k.label}</span>
        <div className="kpi-row" style={{ alignItems: "baseline" }}>
          <span className="kpi-value">{val}</span>
        </div>
        <div className="kpi-row">
          <span className="kpi-spark">
            {empty
              ? <span className="kpi-spark-empty" />
              : <Sparkline data={k.spark} color="var(--tx-2)" w={120} h={28} />}
          </span>
        </div>
      </div>
    );
  }

  // ---- Empty state hero ----
  function EmptyHero({ setPage }) {
    return (
      <div className="empty-hero">
        <div className="empty-hero-mark"><Icon name="dollar" /></div>
        <h2>Buradan başlıyoruz.</h2>
        <p>
          Henüz işlem yok. İlk hareketini ekle, gerisi sessizce akıp gider.
        </p>
        <div className="empty-hero-actions">
          <button className="btn solid" onClick={() => window.TBOpenQuickAdd?.()}>
            <Icon name="plus" /> İlk işlemi ekle
          </button>
          <button className="btn ghost" onClick={() => setPage("settings")}>
            <Icon name="sheet" /> Veri kaynağı bağla
          </button>
        </div>
        <div className="empty-hero-hints">
          <span className="kbd">⌘</span><span className="kbd">N</span> hızlı ekle
          <span style={{ margin: "0 10px", opacity: 0.4 }}>·</span>
          <span className="kbd">⌘</span><span className="kbd">K</span> komut paleti
          <span style={{ margin: "0 10px", opacity: 0.4 }}>·</span>
          <span className="kbd">?</span> kısayollar
        </div>
      </div>
    );
  }

  // ---- Top of page (greeting + actions) ----
  function PageHead() {
    const h = new Date().getHours();
    const greet = h < 6  ? "İyi geceler"
                : h < 12 ? "Günaydın"
                : h < 18 ? "Tünaydın"
                :          "İyi akşamlar";
    return (
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Genel Bakış</div>
          <h1 className="page-title">{greet}.</h1>
          <p className="page-sub">Sessiz ve sade bir başlangıç. Veri girdikçe burada nefes alışın hissedilir.</p>
        </div>
        <div className="flex gap8">
          <button className="btn solid" onClick={() => window.TBOpenQuickAdd?.()}>
            <Icon name="plus" /> Hızlı ekle
          </button>
        </div>
      </div>
    );
  }

  // ---- Page ----
  function Dashboard({ setPage }) {
    const isEmpty = !D.tx.length && !D.cards.length;

    if (isEmpty) {
      return (
        <div className="page">
          <PageHead />
          <EmptyHero setPage={setPage} />
          <div className="grid-4">
            {D.kpis.slice(0, 4).map(k => <KpiCard key={k.id} k={k} />)}
          </div>
        </div>
      );
    }

    return (
      <div className="page">
        <PageHead />
        <div className="grid-4">
          {D.kpis.map(k => <KpiCard key={k.id} k={k} />)}
        </div>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-eyebrow">Akış</div>
              <div className="card-title" style={{ fontSize: 16, marginTop: 2 }}>Gelir vs gider</div>
            </div>
          </div>
          <AreaChart
            labels={D.cashflow.labels}
            income={D.cashflow.income}
            expense={D.cashflow.expense}
            height={220}
          />
        </div>
      </div>
    );
  }

  window.Dashboard = Dashboard;
})();
