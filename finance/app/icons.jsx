/* ============================================================
   Icons — Lucide-style stroke icons, 24x24, currentColor
   ------------------------------------------------------------
   Quiet, consistent stroke set. Sized via parent.
============================================================ */
(function () {
  const I = {
    // navigation
    dashboard:    <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    transactions: <><path d="M4 7h16M4 17h16"/><path d="M16 4l4 3-4 3M8 14l-4 3 4 3"/></>,
    budget:       <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    income:       <><path d="M3 13l4-4 4 4 7-7"/><path d="M14 6h4v4"/></>,
    card:         <><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/></>,
    debts:        <><path d="M4 6h16M4 12h12M4 18h8"/></>,
    trending:     <><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></>,
    goals:        <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></>,
    reports:      <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 13v4M12 9v8M16 14v3"/></>,
    ai:           <><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z"/><circle cx="18" cy="18" r="2"/></>,
    whatsapp:     <><path d="M21 12a9 9 0 1 1-3.95-7.42L21 4l-1.5 4.4A9 9 0 0 1 21 12z"/><path d="M8 11.5c.3 1.5 2 3.2 3.5 3.5"/></>,
    phone:        <><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M11 18h2"/></>,
    settings:     <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,

    // glyphs
    arrowUp:    <path d="M12 19V5M5 12l7-7 7 7"/>,
    arrowDown:  <path d="M12 5v14M19 12l-7 7-7-7"/>,
    arrowRight: <path d="M5 12h14M13 5l7 7-7 7"/>,
    arrowLeft:  <path d="M19 12H5M11 19l-7-7 7-7"/>,
    chevDown:   <path d="M6 9l6 6 6-6"/>,
    chevRight:  <path d="M9 6l6 6-6 6"/>,
    chevLeft:   <path d="M15 6l-6 6 6 6"/>,

    plus:       <path d="M12 5v14M5 12h14"/>,
    check:      <path d="M5 13l4 4L19 7"/>,
    x:          <path d="M6 6l12 12M18 6L6 18"/>,
    search:     <><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></>,
    filter:     <path d="M4 5h16M7 12h10M10 19h4"/>,
    bell:       <><path d="M6 9a6 6 0 1 1 12 0c0 4 2 5 2 7H4c0-2 2-3 2-7z"/><path d="M10 21h4"/></>,
    spark:      <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2"/><circle cx="12" cy="12" r="3"/></>,
    info:       <><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 12v5"/></>,
    download:   <><path d="M12 4v12M6 12l6 6 6-6"/><path d="M4 20h16"/></>,
    upload:     <><path d="M12 20V8M6 12l6-6 6 6"/><path d="M4 4h16"/></>,
    grid:       <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    file:       <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></>,

    // domain
    food:       <><path d="M5 3v8a3 3 0 0 0 6 0V3M8 3v8"/><path d="M16 3c-2 1-2 6 0 8 0 0 0 9 0 10"/></>,
    cart:       <><path d="M3 4h2l3 12h11l2-8H7"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></>,
    car:        <><path d="M3 13l2-5h14l2 5"/><rect x="3" y="13" width="18" height="6" rx="1"/><circle cx="7" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></>,
    bag:        <><path d="M5 7h14l-1 13H6z"/><path d="M9 7a3 3 0 0 1 6 0"/></>,
    play:       <path d="M7 4l13 8-13 8z"/>,
    heart:      <path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z"/>,
    bolt:       <path d="M13 2L3 14h7l-1 8 10-12h-7z"/>,
    home:       <><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></>,
    tag:        <><path d="M21 13l-8 8-9-9V4h8z"/><circle cx="8" cy="8" r="1.5"/></>,
    location:   <><path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></>,
    receipt:    <><path d="M5 3h14v18l-3-2-3 2-3-2-3 2-2-2z"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
    sheet:      <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></>,
    sync:       <><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></>,
    lock:       <><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
    user:       <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    eye:        <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    edit:       <><path d="M3 17l11-11 4 4-11 11H3z"/></>,
    trash:      <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></>,
    moon:       <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>,
    sun:        <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    sliders:    <><path d="M4 6h12M4 12h6M4 18h14"/><circle cx="18" cy="6" r="2"/><circle cx="14" cy="12" r="2"/><circle cx="20" cy="18" r="2"/></>,
    shield:     <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/>,
    wallet:     <><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M16 13h2"/></>,
    pie:        <><path d="M12 3v9h9"/><path d="M21 12a9 9 0 1 1-9-9"/></>,
    dollar:     <path d="M12 2v20M16 6h-5a3 3 0 0 0 0 6h2a3 3 0 0 1 0 6H7"/>,
    paperclip:  <path d="M21 11l-9.5 9.5a5 5 0 0 1-7-7L13 5a3 3 0 0 1 4 4L7.5 18.5"/>,
    flag:       <><path d="M5 21V4M5 4h13l-2 4 2 4H5"/></>,
    layers:     <><path d="M12 2l9 5-9 5-9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/></>,
    book:       <><path d="M4 4h12a2 2 0 0 1 2 2v15H6a2 2 0 0 1-2-2z"/><path d="M4 18h14"/></>,
    sparkles:   <><path d="M5 3v3M3.5 4.5h3M19 4v4M17 6h4M12 7l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></>,
    compass:    <><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5L13 14l-4.5 1.5L10 11z"/></>,
    printer:    <><path d="M6 8V3h12v5"/><rect x="3" y="8" width="18" height="9" rx="2"/><path d="M6 17v4h12v-4"/><circle cx="17" cy="11.5" r=".7" fill="currentColor"/></>,
  };

  function Icon({ name, ...rest }) {
    const c = I[name];
    if (!c) return null;
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...rest}>
        {c}
      </svg>
    );
  }
  window.Icon = Icon;
  window.IconNames = Object.keys(I);
})();
