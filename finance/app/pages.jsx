/* ============================================================
   Pages — Transactions · Investments · AI Coach
============================================================ */
(function () {
  const { useState, useRef, useEffect, useMemo } = React;
  const D = window.DATA;

  /* =========================================================
     TRANSACTIONS
  ========================================================= */
  function TxDrawer({ tx, onClose }) {
    if (!tx) return null;
    const meta = [
      ["Kategori", tx.category],
      ["Tür", tx.kind === "keyfi" ? "Keyfi" : tx.kind === "gelir" ? "Gelir" : "Zorunlu"],
      ["Kart / Yöntem", tx.card],
      ["Lokasyon", tx.location || "—"],
      ["Tarih & Saat", tx.date + (tx.time !== "—" ? " · " + tx.time : "")],
      ["Etiketler", (tx.tags || []).join(", ") || "—"],
      ["Tekrar eden", tx.recurring ? "Evet" : "Hayır"],
    ];
    return (
      <>
        <div className="drawer-scrim" onClick={onClose} />
        <aside className="drawer">
          <div className="dh">
            <div>
              <div className="card-eyebrow">İşlem detayı</div>
              <b style={{ fontSize: 14 }}>{tx.name}</b>
            </div>
            <button className="dh-close" onClick={onClose}><Icon name="x" /></button>
          </div>
          <div className="db">
            <div className="flex between" style={{ alignItems: "baseline" }}>
              <span className="serif" style={{ fontSize: 32, fontStyle: "italic", color: tx.kind === "gelir" ? "var(--pos)" : "var(--tx-0)", letterSpacing: "-0.02em", fontWeight: 380 }}>
                {tx.kind === "gelir" ? "+" : ""}{D.fmt(tx.amount)}
              </span>
              <SourceBadge source={tx.source} />
            </div>
            <dl className="kv-grid">
              {meta.map(([k, v], i) => (
                <React.Fragment key={i}><dt>{k}</dt><dd>{v}</dd></React.Fragment>
              ))}
            </dl>
            <div className="card flat tight">
              <div className="flex between">
                <span className="card-eyebrow">AI · kategori güveni</span>
                <Confidence value={tx.confidence} dense label={false} />
              </div>
              <span className="dim" style={{ fontSize: 12 }}>
                "{tx.name}" → {tx.category}. Lokasyon ve geçmiş işlemler kategoriyi destekliyor.
              </span>
            </div>
          </div>
          <div className="df">
            <button className="btn ghost"><Icon name="paperclip" /> Fiş ekle</button>
            <button className="btn ghost"><Icon name="edit" /> Düzenle</button>
            <button className="btn primary"><Icon name="check" /> Onayla</button>
          </div>
        </aside>
      </>
    );
  }

  function Transactions() {
    const [open, setOpen] = useState(null);
    const [filter, setFilter] = useState({ q: "", cat: "all", card: "all", kind: "all", source: "all", flagged: false });
    const [period, setPeriod] = useState("month");

    const cards = useMemo(() => Array.from(new Set(D.tx.map(t => t.card))), []);
    const cats  = useMemo(() => Array.from(new Set(D.tx.map(t => t.category))), []);

    const list = useMemo(() => D.tx.filter(t => {
      if (filter.q && !(`${t.name} ${t.category} ${t.location} ${(t.tags||[]).join(" ")}`.toLowerCase().includes(filter.q.toLowerCase()))) return false;
      if (filter.cat !== "all"  && t.category !== filter.cat) return false;
      if (filter.card !== "all" && t.card !== filter.card) return false;
      if (filter.kind !== "all" && t.kind !== filter.kind) return false;
      if (filter.source !== "all" && t.source !== filter.source) return false;
      if (filter.flagged && t.confidence >= 0.9) return false;
      return true;
    }), [filter]);

    const totalIn  = list.filter(t => t.kind === "gelir").reduce((s, t) => s + t.amount, 0);
    const totalOut = list.filter(t => t.kind !== "gelir").reduce((s, t) => s + t.amount, 0);

    return (
      <div className="page">
        <div className="page-head">
          <div>
            <div className="page-eyebrow">İşlemler · {list.length} kayıt</div>
            <h1 className="page-title">Transactions</h1>
            <p className="page-sub">Apple Wallet hissi · gelen mesaj, manuel giriş ve sheets birleşik akışta.</p>
          </div>
          <div className="flex gap8">
            <TimeFilter value={period} onChange={setPeriod} />
            <button className="btn" onClick={() => window.TBOpenQuickAdd?.()}><Icon name="plus" /> Ekle</button>
            <button
              className="btn ghost"
              onClick={() => {
                const rows = list.map(t => ({
                  tarih: t.date,
                  açıklama: t.merchant,
                  kategori: t.category,
                  tutar: t.amount,
                  kart: t.card,
                  etiket: t.tag || "",
                  not: t.note || "",
                }));
                if (!rows.length) return window.TBToast?.push("İndirilecek satır yok", "warn");
                window.TBExport.csv(rows, "islemler-" + new Date().toISOString().slice(0, 10) + ".csv");
              }}
            ><Icon name="download" /> CSV</button>
          </div>
        </div>

        {/* totals strip */}
        <div className="grid-3">
          <div className="card compact">
            <span className="card-eyebrow">Toplam Gelir</span>
            <span className="serif" style={{ fontSize: 24, color: "var(--pos)", fontStyle: "italic", fontWeight: 380 }}>{D.fmt(totalIn)}</span>
          </div>
          <div className="card compact">
            <span className="card-eyebrow">Toplam Gider</span>
            <span className="serif" style={{ fontSize: 24, color: "var(--neg)", fontStyle: "italic", fontWeight: 380 }}>{D.fmt(totalOut)}</span>
          </div>
          <div className="card compact">
            <span className="card-eyebrow">Net</span>
            <span className="serif" style={{ fontSize: 24, color: totalIn - totalOut >= 0 ? "var(--pos)" : "var(--neg)", fontStyle: "italic", fontWeight: 380 }}>
              {D.fmt(totalIn - totalOut)}
            </span>
          </div>
        </div>

        {/* filter bar */}
        <div className="filter-bar">
          <div className="tb-search" style={{ background: "var(--bg-1)", flex: 1, minWidth: 180 }}>
            <Icon name="search" />
            <input
              placeholder="işlem, kategori, lokasyon, etiket"
              value={filter.q}
              onChange={(e) => setFilter(f => ({ ...f, q: e.target.value }))}
              style={{ background: "transparent", border: 0, outline: 0, flex: 1, fontSize: 12.5 }}
            />
          </div>
          <Select label="Kategori" value={filter.cat}    options={[["all","Tümü"], ...cats.map(c=>[c,c])]}    onChange={v => setFilter(f => ({ ...f, cat: v }))} />
          <Select label="Kart"     value={filter.card}   options={[["all","Tümü"], ...cards.map(c=>[c,c])]}   onChange={v => setFilter(f => ({ ...f, card: v }))} />
          <Select label="Tür"      value={filter.kind}   options={[["all","Tümü"],["keyfi","Keyfi"],["zorunlu","Zorunlu"],["gelir","Gelir"]]} onChange={v => setFilter(f => ({ ...f, kind: v }))} />
          <Select label="Kaynak"   value={filter.source} options={[["all","Tümü"],["whatsapp","WhatsApp"],["sheets","Sheets"],["manual","Manuel"]]} onChange={v => setFilter(f => ({ ...f, source: v }))} />
          <button className={"btn ghost sm " + (filter.flagged ? "ai" : "")} onClick={() => setFilter(f => ({ ...f, flagged: !f.flagged }))}>
            <Icon name="info" /> AI flagged
          </button>
        </div>

        {/* table */}
        <div className="card flat" style={{ padding: 0, overflow: "hidden", borderRadius: 18 }}>
          <table className="t">
            <thead>
              <tr>
                <th style={{ paddingLeft: 18 }}>İşlem</th>
                <th>Kategori</th>
                <th>Kart</th>
                <th>Lokasyon</th>
                <th>Kaynak</th>
                <th>Tarih</th>
                <th className="right">Tutar</th>
                <th className="right">Güven</th>
              </tr>
            </thead>
            <tbody>
              {list.map(t => (
                <tr key={t.id} onClick={() => setOpen(t)}>
                  <td style={{ paddingLeft: 18 }}>
                    <div className="flex gap12">
                      <span style={{ width: 28, height: 28, borderRadius: 9, background: "var(--bg-3)", color: "var(--tx-1)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <Icon name={iconFor(t.category)} style={{ width: 13, height: 13 }} />
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                        <b style={{ color: "var(--tx-0)", fontSize: 13 }}>{t.name}</b>
                        <span className="muted" style={{ fontSize: 11 }}>
                          {t.kind === "keyfi" ? "Keyfi" : t.kind === "gelir" ? "Gelir" : "Zorunlu"}
                          {t.recurring ? " · tekrar eden" : ""}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td><span className="chip">{t.category}</span></td>
                  <td className="dim">{t.card}</td>
                  <td className="dim" style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.location}</td>
                  <td><SourceBadge source={t.source} /></td>
                  <td className="dim mono">{t.date}</td>
                  <td className="num right" style={{ color: t.kind === "gelir" ? "var(--pos)" : "var(--tx-0)" }}>
                    {t.kind === "gelir" ? "+" : ""}{D.fmt(t.amount)}
                  </td>
                  <td className="right" style={{ paddingRight: 18 }}><Confidence value={t.confidence} dense label={false} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI insight */}
        <AIRow tone="warn" icon="info" title="Restoran kategorisi normalin üzerinde"
          rationale="Son 30g rolling vs prev 30g · 18 işlem">
          Bu ay restoran harcaman <b>₺7.250</b>; geçen aya göre <b>+%34</b>. Kalan günlerde günlük <b>₺310</b> limit önerilir.
        </AIRow>

        <TxDrawer tx={open} onClose={() => setOpen(null)} />
      </div>
    );
  }

  function iconFor(category) {
    const m = {
      "Kahve": "play", "Restoran": "food", "Market": "cart", "Ulaşım": "car",
      "Online Alışveriş": "bag", "Eğlence": "play", "Sağlık": "heart",
      "Faturalar": "bolt", "Abonelik": "play", "Kart Borcu": "card",
      "Kira": "home", "Maaş": "income", "Freelance": "income", "Hedef": "flag",
      "Geri Ödeme": "income", "Pasif Gelir": "income", "Diğer": "tag",
    };
    return m[category] || "tag";
  }

  function Select({ label, value, onChange, options }) {
    return (
      <label style={{ display: "inline-flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "var(--tx-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
        <select value={value} onChange={(e) => onChange(e.target.value)}
          style={{
            background: "var(--bg-1)", color: "var(--tx-0)",
            border: "1px solid var(--line)", borderRadius: 999,
            padding: "5px 12px", fontSize: 12, outline: "none",
            fontFamily: "inherit", cursor: "pointer",
          }}>
          {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>
    );
  }

  /* =========================================================
     INVESTMENTS
  ========================================================= */
  function Investments() {
    const inv = D.investments;
    const ret = ((inv.total - inv.costBase) / inv.costBase) * 100;
    const profit = inv.total - inv.costBase;
    const [period, setPeriod] = useState("year");

    return (
      <div className="page">
        <div className="page-head">
          <div>
            <div className="page-eyebrow">Yatırımlar · 8 varlık</div>
            <h1 className="page-title">Investments</h1>
            <p className="page-sub">Portföy büyüklüğün, dağılımın ve risk eğilimi tek ekranda.</p>
          </div>
          <div className="flex gap8">
            <TimeFilter value={period} onChange={setPeriod} />
            <button className="btn"><Icon name="plus" /> Varlık ekle</button>
          </div>
        </div>

        {/* hero */}
        <div className="grid-12">
          <div className="card span-8">
            <div className="card-head">
              <div>
                <div className="card-eyebrow">Toplam portföy</div>
                <div className="serif" style={{ fontSize: 38, fontStyle: "italic", color: "var(--tx-0)", fontWeight: 380, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  {D.fmt(inv.total)}
                </div>
                <div className="flex gap8" style={{ marginTop: 6 }}>
                  <span className="delta up mono">+{ret.toFixed(1).replace(".", ",")}%</span>
                  <span className="dim mono" style={{ fontSize: 12 }}>kâr {D.fmtK(profit)}</span>
                  <span className="muted mono" style={{ fontSize: 11 }}>· günlük {D.fmt(inv.dailyChange)}</span>
                </div>
              </div>
              <button className="btn ai sm"><Icon name="ai" /> Analiz</button>
            </div>
            <LineChart data={inv.perf.values} labels={inv.perf.labels} color="var(--inv)" height={220} />
          </div>

          <div className="card span-4">
            <div className="card-head"><div className="card-title">Risk dağılımı</div></div>
            <StackBar data={inv.risk} height={10} />
            <div className="legend" style={{ marginTop: 6 }}>
              {inv.risk.map((r, i) => (
                <div className="lg-row" key={i}>
                  <span className="sw" style={{ background: r.color }} />
                  <span className="lg-name">{r.name}</span>
                  <span className="lg-val mono">{r.pct}%</span>
                </div>
              ))}
            </div>
            <AIRow tone="ac" icon="spark" rationale="hisse + fon + kripto birleşik">
              Portföyünün <b>%41</b>'i hisse/fon tarafında. Bu bir yatırım tavsiyesi değildir.
            </AIRow>
          </div>
        </div>

        {/* assets */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Varlık dağılımı</div>
            <span className="muted mono" style={{ fontSize: 11 }}>{inv.assets.length} kategori</span>
          </div>
          <div className="grid-2">
            <Donut data={inv.assets.map(a => ({ name: a.name, value: a.value, color: a.color }))}
              size={220} thickness={20}
              center={<><b>{D.fmtK(inv.total)}</b><span>Toplam</span></>} />
            <div className="legend" style={{ alignSelf: "center" }}>
              {inv.assets.map((a, i) => (
                <div className="lg-row" key={i}>
                  <span className="sw" style={{ background: a.color }} />
                  <span className="lg-name">{a.name}</span>
                  <span className="lg-val mono">{D.fmtK(a.value)}</span>
                  <span className="muted mono" style={{ fontSize: 10.5, minWidth: 36, textAlign: "right" }}>{a.pct.toString().replace(".", ",")}%</span>
                  <span className={"delta " + (a.change > 0 ? "up" : a.change < 0 ? "down" : "flat")} style={{ marginLeft: 8 }}>
                    {a.change > 0 ? "+" : ""}{a.change.toFixed(1).replace(".", ",")}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <AIRow tone="ac" icon="info" rationale="cash buffer / aylık gider">
            Nakit tamponun <b>1.6 aylık</b> gideri karşılıyor. 6 aylık hedef bandın altında.
          </AIRow>
        </div>
      </div>
    );
  }

  /* =========================================================
     AI COACH
  ========================================================= */
  function AICoach() {
    const [tab, setTab] = useState("brief");
    const [q, setQ] = useState("");
    const [thread, setThread] = useState([
      { role: "ai", text: "Selam Taha. Bu hafta net tasarrufun ₺13.200, geçen haftaya göre +%6. Restoran kategorin yine bandının üstünde.", time: "09:12" },
    ]);
    const inputRef = useRef(null);
    const threadRef = useRef(null);
    useEffect(() => { threadRef.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [thread]);

    const suggested = [
      "Bu ay nereden kısmalıyım?",
      "3 ayda ₺50.000 biriktirebilir miyim?",
      "Kart borcumu nasıl kapatmalıyım?",
      "Yatırım dağılımım riskli mi?",
      "Maaşımın yüzde kaçı sabit giderlere gidiyor?",
      "Hedeflerime yetişiyor muyum?",
    ];

    function send(text) {
      const t = (text || q).trim();
      if (!t) return;
      const stamp = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
      const reply = mockReply(t);
      setThread(arr => [...arr, { role: "me", text: t, time: stamp }, { role: "ai", text: reply, time: stamp, rationale: "veri: 30g rolling · kategori bütçeleri · kart kullanım oranları" }]);
      setQ("");
    }

    return (
      <div className="page">
        <div className="page-head">
          <div>
            <div className="page-eyebrow">Intelligence</div>
            <h1 className="page-title">AI Coach</h1>
            <p className="page-sub">Sessiz, kişisel bir finans koçu. Verilerinden konuşur — hiçbir şey tahmin değildir.</p>
          </div>
          <PeriodSwitch value={tab} onChange={setTab} options={[
            { id: "brief",     label: "Briefing" },
            { id: "timeline",  label: "Insights" },
            { id: "chat",      label: "Konuşma" },
          ]} />
        </div>

        {tab === "brief" && (
          <div className="grid-12">
            <div className="card span-8" style={{ background: "linear-gradient(180deg, var(--ac-soft), transparent 60%), var(--bg-2)" }}>
              <div className="card-eyebrow">Bugünün özeti</div>
              <div className="serif" style={{ fontSize: 28, fontStyle: "italic", color: "var(--tx-0)", lineHeight: 1.2, fontWeight: 380, letterSpacing: "-0.01em" }}>
                {greeting(D.user.name)}
              </div>
              <p style={{ fontSize: 16, color: "var(--tx-1)", lineHeight: 1.55, fontFamily: "var(--serif)" }}>
                Bu ay tasarruf hedefinin önündesin. Net tasarruf oranın %58.2; bandının üst sınırına yakın.
                Restoran harcamaların normal bandının üzerinde — kalan günlerde günlük ₺310 limiti yeterli olur.
              </p>
              <div className="ai-rationale">
                — 30 günlük rolling restoran ortalaman ₺7.250 (önceki 30 gün ₺5.420). Maaş sonrası ilk 3 günde harcama yoğunluğu var.
              </div>
              <div className="grid-3" style={{ marginTop: 8 }}>
                <div className="card flat tight">
                  <span className="card-eyebrow">Aylık tasarruf</span>
                  <span className="mono" style={{ fontSize: 20, color: "var(--pos)" }}>{D.fmtK(53860)}</span>
                </div>
                <div className="card flat tight">
                  <span className="card-eyebrow">Aşılan kategori</span>
                  <span className="mono" style={{ fontSize: 20, color: "var(--neg)" }}>2 / 8</span>
                </div>
                <div className="card flat tight">
                  <span className="card-eyebrow">Yatırım getirisi</span>
                  <span className="mono" style={{ fontSize: 20, color: "var(--inv)" }}>+10.0%</span>
                </div>
              </div>
            </div>

            <div className="card span-4">
              <div className="card-title">Önerilen aksiyonlar</div>
              {[
                ["Akbank kartını bu ay duraklat", "neg", "−₺8.4K kart borç riski"],
                ["Aylık otomatik hedef katkısı", "ac",  "Japonya · +₺1.200"],
                ["Restoran 'cool-down' uyarısı", "warn","maaş + 3g · push"],
              ].map(([title, t, hint], i) => (
                <div className="lrow" key={i}>
                  <span className="l-ic" style={{ background: t === "neg" ? "var(--neg-soft)" : t === "warn" ? "var(--warn-soft)" : "var(--ac-soft)", color: "var(--" + t + ")" }}>
                    <Icon name="spark" />
                  </span>
                  <div className="l-main">
                    <b>{title}</b>
                    <span>{hint}</span>
                  </div>
                  <button className="btn ghost sm">Uygula</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "timeline" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {D.aiTimeline.map((it, i) => (
              <div key={i} className="card">
                <div className="card-head">
                  <div className="card-eyebrow">{it.date}</div>
                  <span className={"chip tone-" + (it.tone === "neg" ? "neg" : it.tone)}>{it.tone}</span>
                </div>
                <b style={{ fontSize: 16, color: "var(--tx-0)" }}>{it.title}</b>
                <span className="dim" style={{ fontSize: 14, lineHeight: 1.55 }}>{it.body}</span>
                <div className="ai-rationale">— {it.rationale}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "chat" && (
          <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "calc(100vh - 240px)", minHeight: 480 }}>
            <div ref={threadRef} style={{ flex: 1, padding: 22, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              {thread.map((m, i) => (
                <div key={i} className={"bubble " + (m.role === "me" ? "me" : "them")}>
                  <span style={{ whiteSpace: "pre-wrap" }}>{m.text}</span>
                  <time>{m.time}</time>
                  {m.rationale && <div className="ai-rationale" style={{ marginTop: 6 }}>— {m.rationale}</div>}
                </div>
              ))}
            </div>
            <div style={{ padding: 14, borderTop: "1px solid var(--line-soft)", display: "flex", flexDirection: "column", gap: 10, background: "var(--bg-1)" }}>
              <div className="flex gap8 wrap">
                {suggested.map((s, i) => (
                  <button key={i} className="chip" style={{ cursor: "pointer", border: "1px solid var(--line)" }} onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap8">
                <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
                  placeholder="Bir şey sor… (örn. 'bu ay nereden kısmalıyım?')"
                  style={{
                    flex: 1, background: "var(--bg-2)", border: "1px solid var(--line)",
                    borderRadius: 999, padding: "10px 16px", fontSize: 13, outline: "none",
                    color: "var(--tx-0)",
                  }} />
                <button type="submit" className="btn primary"><Icon name="arrowRight" /></button>
              </form>
              <span className="muted" style={{ fontSize: 10.5, fontFamily: "var(--mono)", letterSpacing: "0.06em", textAlign: "center" }}>
                Yanıtlar verilerinden türetilir. Yatırım tavsiyesi değildir.
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  function mockReply(q) {
    const lower = q.toLowerCase();
    if (lower.includes("kıs") || lower.includes("nereden")) {
      return "Bu ay 'keyfi' sınıfta en yüksek üç sapma: restoran +%34 (₺7.250), online alışveriş +%18 (₺3.120), eğlence -%12 (₺2.410). " +
        "Restoranı kalan 17 günde günlük ₺310 ile tutarsan ay sonu hedef bandında kalırsın. Yaklaşık etki: -₺1.250 / +%2 tasarruf oranı.";
    }
    if (lower.includes("50") && lower.includes("biri")) {
      return "Mevcut tempoda 3 ayda ortalama ₺54.000 biriktiriyorsun. ₺50.000 hedefi rahatlıkla yakalanır. " +
        "Kart borcunu sabit tutarsan +₺2.400 ek kazanç olur.";
    }
    if (lower.includes("kart") && lower.includes("borc")) {
      return "Önce Akbank kartını kapat: ₺39.850, faiz baskısı en yüksek. Mevcut tempoda 5 ayda biter. " +
        "Aylık katkıyı +₺3.000 artırırsan 3 ayda biter, toplam tasarruf ~₺2.100 faiz.";
    }
    if (lower.includes("riskl") || lower.includes("yatırım")) {
      return "Portföy: %41 hisse/fon, %18.5 altın, %14 USD mevduat, %12 eurobond, %3.8 kripto. " +
        "Risk dağılımı: 38% düşük / 41% orta / 21% yüksek. Bu bandı son 6 ayda korumuşsun. " +
        "Bu bir yatırım tavsiyesi değildir; yalnızca kişisel takip analizi.";
    }
    if (lower.includes("sabit")) {
      return "Net gelirinin %41.8'i sabit giderlere gidiyor (kira ₺22.500 + faturalar ₺6.280 + abonelikler ₺578). " +
        "Bu oran sağlıklı bandın (%38–%45) ortasında.";
    }
    if (lower.includes("hedef")) {
      return "Japonya hedefi %73 ilerlemede, Eylül sonu hazır. Acil Fon %32 — aylık katkıyı +₺2.500 artırırsan 6 aylık tampon Ocak 2027'de tamam.";
    }
    return "Bu sorunun cevabı için son 30 günü inceledim. Kısa cevap: planın dahilindesin, " +
      "ama keyfi harcama bandının üstüne çıkıyor. Daha net bir yanıt için kategori veya kart belirtebilirsin.";
  }

  Object.assign(window, { Transactions, Investments, AICoach });
})();
