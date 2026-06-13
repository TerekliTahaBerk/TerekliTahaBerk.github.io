/* ============================================================
   App root — auth gate + page router
   ------------------------------------------------------------
   - Renders <Login/> when no active session
   - Otherwise renders Sidebar + Topbar + active page
   - Persists last visited page in sessionStorage
============================================================ */
(function () {
  const { useState, useEffect, useCallback } = React;

  const PAGES = {
    dashboard:    "Dashboard",
    transactions: "Transactions",
    budget:       "Budget",
    income:       "Income",
    cards:        "Cards",
    debts:        "Debts",
    investments:  "Investments",
    goals:        "Goals",
    reports:      "Reports",
    ai:           "AICoach",
    whatsapp:     "WhatsApp",
    mobile:       "Mobile",
    settings:     "Settings",
  };

  function readPage() {
    // Allow #hash routing for direct URL deep-linking.
    const h = (window.location.hash || "").replace(/^#\/?/, "");
    if (h && PAGES[h]) return h;
    try {
      const s = sessionStorage.getItem("tbt_finance_last_page");
      if (s && PAGES[s]) return s;
    } catch (_) {}
    return "dashboard";
  }

  function App() {
    const [authed, setAuthed]       = useState(window.TBTAuth?.isAuthed?.() || false);
    const [page, setPage]           = useState(readPage());
    const [collapsed, setCollapsed] = useState(false);
    const [mobileNav, setMobileNav] = useState(false);
    const [paletteOpen, setPaletteOpen]   = useState(false);
    const [quickAddOpen, setQuickAddOpen] = useState(false);
    const [helpOpen, setHelpOpen]         = useState(false);

    // Persist page selection (so refresh / hash both work)
    useEffect(() => {
      try { sessionStorage.setItem("tbt_finance_last_page", page); } catch (_) {}
      // Update hash silently for shareable URLs
      if (("#/" + page) !== window.location.hash) {
        try { history.replaceState(null, "", "#/" + page); } catch (_) {}
      }
      // Scroll to top on page change
      const sc = document.querySelector(".scroll");
      if (sc) sc.scrollTo({ top: 0, behavior: "instant" });
    }, [page]);

    // Listen for hash changes (back / forward)
    useEffect(() => {
      const onHash = () => {
        const h = (window.location.hash || "").replace(/^#\/?/, "");
        if (h && PAGES[h]) setPage(h);
      };
      window.addEventListener("hashchange", onHash);
      return () => window.removeEventListener("hashchange", onHash);
    }, []);

    // Re-check auth on storage events (multi-tab logout)
    useEffect(() => {
      const onStorage = () => setAuthed(window.TBTAuth.isAuthed());
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }, []);

    // Cmd/Ctrl+B → toggle sidebar
    useEffect(() => {
      const onKey = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
          e.preventDefault();
          setCollapsed(c => !c);
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Cmd/Ctrl+K → open command palette  (and "/" when not typing)
    useEffect(() => {
      const onKey = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          setPaletteOpen(o => !o);
        } else if (e.key === "/" && !paletteOpen) {
          const t = e.target;
          const tag = t && t.tagName;
          if (tag === "INPUT" || tag === "TEXTAREA" || (t && t.isContentEditable)) return;
          e.preventDefault();
          setPaletteOpen(true);
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [paletteOpen]);

    // Cmd/Ctrl+N → Quick Add ; "?" → shortcuts overlay
    useEffect(() => {
      const onKey = (e) => {
        const tgt = e.target;
        const isInput = tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA" || tgt.isContentEditable);
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
          // browsers steal Cmd+N for new window; we still try, otherwise
          // user can use the topbar button. preventDefault may be ignored.
          e.preventDefault();
          setQuickAddOpen(true);
          return;
        }
        if (!isInput && (e.key === "?" || (e.shiftKey && e.key === "/"))) {
          e.preventDefault();
          setHelpOpen(o => !o);
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, []);

    // "g" + letter → page jump (Linear / GitHub style)
    useEffect(() => {
      let pending = false;
      let timeout = null;
      const map = { d: "dashboard", t: "transactions", b: "budget", i: "income",
                    c: "cards",     e: "debts",        v: "investments", o: "goals",
                    r: "reports",   a: "ai",           w: "whatsapp",    m: "mobile",
                    s: "settings" };
      const onKey = (e) => {
        const tgt = e.target;
        if (tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA" || tgt.isContentEditable)) return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (!pending && e.key === "g") {
          pending = true;
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => { pending = false; }, 1200);
          return;
        }
        if (pending) {
          const k = e.key.toLowerCase();
          if (map[k]) {
            e.preventDefault();
            setPage(map[k]);
            window.TBToast?.push("→ " + (window.TITLES?.[map[k]] || map[k]), "info");
          }
          pending = false;
          if (timeout) clearTimeout(timeout);
        }
      };
      window.addEventListener("keydown", onKey);
      return () => { window.removeEventListener("keydown", onKey); if (timeout) clearTimeout(timeout); };
    }, []);

    const onSignedIn = useCallback(() => setAuthed(true), []);
    const onSignOut  = useCallback(() => {
      window.TBTAuth.signOut();
      setAuthed(false);
      // Clear last page so next sign-in lands on dashboard fresh
      try { sessionStorage.removeItem("tbt_finance_last_page"); } catch (_) {}
    }, []);

    // Expose modal openers globally so any deep child / vanilla button can call them
    useEffect(() => {
      window.TBOpenQuickAdd = () => setQuickAddOpen(true);
      window.TBOpenHelp     = () => setHelpOpen(true);
      window.TBOpenPalette  = () => setPaletteOpen(true);
      return () => {
        delete window.TBOpenQuickAdd;
        delete window.TBOpenHelp;
        delete window.TBOpenPalette;
      };
    }, []);

    if (!authed) {
      return <Login onSignedIn={onSignedIn} />;
    }

    let CurrentPage = window.Dashboard;
    switch (page) {
      case "transactions": CurrentPage = window.Transactions; break;
      case "budget":       CurrentPage = window.Budget;       break;
      case "income":       CurrentPage = window.Income;       break;
      case "cards":        CurrentPage = window.Cards;        break;
      case "debts":        CurrentPage = window.Debts;        break;
      case "investments":  CurrentPage = window.Investments;  break;
      case "goals":        CurrentPage = window.Goals;        break;
      case "reports":      CurrentPage = window.Reports;      break;
      case "ai":           CurrentPage = window.AICoach;      break;
      case "whatsapp":     CurrentPage = window.WhatsApp;     break;
      case "mobile":       CurrentPage = window.Mobile;       break;
      case "settings":     CurrentPage = window.Settings;     break;
      default:             CurrentPage = window.Dashboard;
    }

    return (
      <div className="app">
        {mobileNav && (
          <div className="sb-backdrop" onClick={() => setMobileNav(false)} aria-hidden="true" />
        )}
        <Sidebar
          page={page}
          setPage={setPage}
          collapsed={collapsed}
          onSignOut={onSignOut}
          mobileOpen={mobileNav}
          onClose={() => setMobileNav(false)}
        />
        <main className="main">
          <Topbar
            page={page}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            setPage={setPage}
            onMobileToggle={() => setMobileNav(true)}
            onOpenPalette={() => setPaletteOpen(true)}
          />
          <div className="scroll">
            <CurrentPage setPage={setPage} />
          </div>
        </main>
        {window.Palette && (
          <Palette
            open={paletteOpen}
            onClose={() => setPaletteOpen(false)}
            setPage={setPage}
            setCollapsed={setCollapsed}
            signOut={onSignOut}
            currentPage={page}
          />
        )}
        {window.QuickAdd && (
          <QuickAdd
            open={quickAddOpen}
            onClose={() => setQuickAddOpen(false)}
          />
        )}
        {window.ShortcutsOverlay && (
          <ShortcutsOverlay
            open={helpOpen}
            onClose={() => setHelpOpen(false)}
          />
        )}
      </div>
    );
  }

  // ---- mount ----
  const mount = document.getElementById("root");
  // Clear the boot screen
  if (mount) mount.innerHTML = "";
  ReactDOM.createRoot(mount).render(<App />);
})();
