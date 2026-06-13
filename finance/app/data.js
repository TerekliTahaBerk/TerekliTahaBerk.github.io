/* ============================================================
   Private Finance OS — empty-state data
   ------------------------------------------------------------
   No mock numbers, no name. Everything starts blank.
   When a real backend lands, this module just gets thinner.
============================================================ */
window.DATA = (function () {
  const fmt = (n) => "\u20BA" + Math.round(Number(n) || 0).toLocaleString("tr-TR");
  const fmtK = (n) => {
    const v = Number(n) || 0;
    if (Math.abs(v) >= 1000000) return "\u20BA" + (v / 1000000).toFixed(1).replace(".", ",") + "M";
    if (Math.abs(v) >= 1000)    return "\u20BA" + (v / 1000).toFixed(1).replace(".", ",") + "K";
    return fmt(v);
  };
  const fmtPct = (n) => ((n || 0) > 0 ? "+" : "") + Number(n || 0).toFixed(1).replace(".", ",") + "%";

  const monthLabels = ["Tem","A\u011Fu","Eyl","Eki","Kas","Ara","Oca","\u015Eub","Mar","Nis","May","Haz"];
  const zero12 = [0,0,0,0,0,0,0,0,0,0,0,0];

  const kpis = [
    { id: "networth", label: "Net De\u011Fer",            value: 0, unit: "\u20BA", delta: 0, spark: [] },
    { id: "income",   label: "Ayl\u0131k Gelir",          value: 0, unit: "\u20BA", delta: 0, spark: [] },
    { id: "expense",  label: "Ayl\u0131k Gider",          value: 0, unit: "\u20BA", delta: 0, spark: [] },
    { id: "savings",  label: "Tasarruf Oran\u0131",       value: 0, unit: "%",      delta: 0, spark: [] },
    { id: "invest",   label: "Yat\u0131r\u0131m De\u011Feri", value: 0, unit: "\u20BA", delta: 0, spark: [] },
    { id: "ccdebt",   label: "Kart Borcu",                value: 0, unit: "\u20BA", delta: 0, spark: [] },
    { id: "cash",     label: "Kullan\u0131labilir Nakit", value: 0, unit: "\u20BA", delta: 0, spark: [] },
    { id: "goals",    label: "Hedef \u0130lerlemesi",     value: 0, unit: "%",      delta: 0, spark: [] },
  ];

  const cashflow = { labels: monthLabels, income: zero12.slice(), expense: zero12.slice() };

  const investments = {
    total: 0, costBase: 0, dailyChange: 0,
    perf: { labels: monthLabels, values: zero12.slice() },
    assets: [], risk: [],
  };

  const monthlyReport = {
    period: "\u2014",
    income: 0, expense: 0, savings: 0, savingsRate: 0,
    biggest: [], deltas: [],
    cardDebtChange: 0, investmentChange: 0, fixedRatio: 0,
    summary: "Hen\u00FCz bu ay i\u00E7in yeterli veri yok.",
    nextMonth: "\u0130lk i\u015Flemini ekledi\u011Finde \u00F6zet burada belirir.",
  };
  const yearlyReport = {
    period: "\u2014",
    income: 0, expense: 0, savings: 0, savingsRate: 0,
    investment: { start: 0, end: 0, change: 0 },
    cardDebt:   { start: 0, end: 0, change: 0 },
    summary: "Y\u0131l boyunca yeterli veri biriktiken \u00F6zet burada haz\u0131r olur.",
  };
  const allTimeReport = {
    period: "\u2014",
    income: 0, expense: 0, savings: 0, savingsRate: 0,
    networth: { start: 0, end: 0, change: 0 },
    summary: "Veri biriktik\u00E7e uzun d\u00F6nem \u00F6zetin burada a\u00E7\u0131l\u0131r.",
  };

  const categoryList = [
    "Kira", "Faturalar", "Market", "Restoran", "Kahve", "Ula\u015F\u0131m", "Sa\u011Fl\u0131k",
    "E\u011Flence", "Online Al\u0131\u015Fveri\u015F", "Abonelik", "Kart Borcu", "Hedef",
    "Maa\u015F", "Freelance", "Pasif Gelir", "Geri \u00D6deme", "Di\u011Fer",
  ];

  const tx = [];
  return {
    fmt, fmtK, fmtPct,
    monthLabels,
    kpis, cashflow,
    categories: [],
    upcoming: [],
    cards: [],
    investments,
    goals: [],
    debts: [],
    incomeBreakdown: [],
    budgets: [],
    tx,
    transactions: tx,
    waInbox: [],
    aiTimeline: [],
    sheets: [],
    notifications: [],
    categoryList,
    monthlyReport, yearlyReport, allTimeReport,
    isEmpty: true,
  };
})();
