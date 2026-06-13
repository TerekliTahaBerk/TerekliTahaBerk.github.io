/* ============================================================
   Shell — Sidebar + Topbar
   Apple/macOS System Settings vibe.
============================================================ */
(function () {
  const { useState, useEffect } = React;

  // -------- nav model --------
  const NAV = [
    { group: "Overview", items: [
      { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    ]},
    { group: "Money", items: [
      { id: "transactions", label: "Transactions", icon: "transactions", badge: "24" },
      { id: "budget",       label: "Budget",       icon: "budget" },
      { id: "income",       label: "Income",       icon: "income" },
      { id: "cards",        label: "Cards",        icon: "card" },
      { id: "debts",        label: "Debts",        icon: "debts" },
    ]},
    { group: "Growth", items: [
      { id: "investments", label: "Investments", icon: "trending" },
      { id: "goals",       label: "Goals",       icon: "goals" },
      { id: "reports",     label: "Reports",     icon: "reports" },
    ]},
    { group: "Intelligence", items: [
      { id: "ai",       label: "AI Coach", icon: "ai", badge: "3" },
      { id: "whatsapp", label: "WhatsApp", icon: "whatsapp", badge: "2" },
    ]},
    { group: "System", items: [
      { id: "settings", label: "Settings", icon: "settings" },
      { id: "mobile",   label: "Mobile",   icon: "phone" },
    ]},
  ];

  const TITLES = {
    dashboard: "Dashboard",
    transactions: "Transactions",
    budget: "Budget",
    income: "Income",
    cards: "Cards",
    debts: "Debts",
    investments: "Investments",
    goals: "Goals",
    reports: "Reports",
    ai: "AI Coach",
    whatsapp: "WhatsApp Inbox",
    mobile: "Mobile",
    settings: "Settings",
  };

  const SUBTITLES = {
    dashboard: "Bu Ay · Haziran 2026",
    transactions: "Tüm hareketler",
    budget: "Aylık limitler",
    income: "Gelir kaynakları",
    cards: "Apple Wallet hissi · 4 kart",
    debts: "Geri ödeme planı",
    investments: "Portföy",
    goals: "Hedefler",
    reports: "Apple Health hissi",
    ai: "Kişisel finans koçun",
    whatsapp: "Veri giriş kapısı",
    mobile: "iOS önizleme",
    settings: "Tercihler",
  };

  // -------- Sidebar --------
  function Sidebar({ page, setPage, collapsed, onSignOut, mobileOpen, onClose }) {
    return (
      <aside
        className={"sidebar " + (collapsed ? "collapsed " : "") + (mobileOpen ? "open " : "")}
        onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
        <div className="sb-head">
          <div className="sb-mark">F</div>
          <div className="sb-word">
            <b>Finance OS</b>
            <span>Private · Taha</span>
          </div>
        </div>

        <div className="sb-nav">
          {NAV.map((g, i) => (
            <div className="sb-group" key={g.group + i}>
              {g.group && <div className="sb-group-label">{g.group}</div>}
              {g.items.map(it => (
                <div key={it.id}
                  className={"sb-item " + (page === it.id ? "active" : "")}
                  onClick={() => { setPage(it.id); onClose?.(); }}
                  title={collapsed ? it.label : undefined}>
                  <span className="sb-icon"><Icon name={it.icon} /></span>
                  <span className="sb-label">{it.label}</span>
                  {it.badge && <span className="sb-badge">{it.badge}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="sb-foot">
          <div className="avatar">TB</div>
          <div className="who">
            <b>Taha</b>
            <span>Owner · Private</span>
          </div>
          <button className="signout" title="Çıkış yap" onClick={onSignOut}>
            <Icon name="lock" />
          </button>
        </div>
      </aside>
    );
  }

  // -------- Topbar --------
  function Topbar({ page, collapsed, setCollapsed, setPage, onMobileToggle, onOpenPalette }) {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
      const t = setInterval(() => setNow(new Date()), 30_000);
      return () => clearInterval(t);
    }, []);
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    return (
      <header className="topbar">
        <button className="tb-toggle hide-sm" onClick={() => setCollapsed(c => !c)} title="Daralt/Genişlet">
          <Icon name="sliders" />
        </button>
        <button className="tb-toggle show-sm-only" onClick={onMobileToggle} title="Menüyü aç">
          <Icon name="grid" />
        </button>

        <div className="tb-crumb hide-sm">
          <span>Finance OS</span>
          <Icon name="chevRight" style={{ width: 11, height: 11, opacity: 0.5 }} />
          <b>{TITLES[page] || page}</b>
        </div>
        <h1 className="show-sm-only" style={{ flex: 1 }}>{TITLES[page]}</h1>

        <span className="tb-spacer" />

        <button className="tb-search hide-md" onClick={() => onOpenPalette?.()} aria-label="Search">
          <Icon name="search" />
          <span style={{ flex: 1, textAlign: "left" }}>Ara · işlem, kategori, kart</span>
          <span className="kbd">⌘K</span>
        </button>

        <div className="tb-status hide-sm">
          <span className="pulse" />
          Last sync · {hh}:{mm}
        </div>

        <button className="tb-icon-btn hide-md" onClick={() => onOpenPalette?.()} title="Hızlı ara · ⌘K" aria-label="Search">
          <Icon name="search" />
        </button>
        <button className="tb-icon-btn" onClick={() => window.TBOpenQuickAdd?.()} title="Yeni işlem · ⌘N" aria-label="Yeni işlem">
          <Icon name="plus" />
        </button>
        <button className="tb-icon-btn" onClick={() => setPage("ai")} title="AI Coach">
          <Icon name="ai" />
        </button>
        <button className="tb-icon-btn hide-sm" onClick={() => window.TBOpenHelp?.()} title="Klavye kısayolları · ?" aria-label="Yardım">
          <Icon name="info" />
        </button>
        <button className="tb-icon-btn" title="Bildirimler" onClick={() => window.TBToast?.push("3 bildirim · Daily Brief panelinde", "info")}>
          <Icon name="bell" />
          <span className="nb-dot" />
        </button>
      </header>
    );
  }

  Object.assign(window, { Sidebar, Topbar, NAV, TITLES, SUBTITLES });
})();
