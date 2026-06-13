/* ============================================================
   Money pages — Budget · Cards · Goals · Debts · Income
============================================================ */
(function () {
  const { useState } = React;
  const D = window.DATA;

  /* =========================================================
     BUDGET
  ========================================================= */
  function Budget() {
    const [period, setPeriod] = useState("month");

    if (!D.budgets || D.budgets.length === 0) {
      return (
        <div className="page">
          <div className="page-head">
            <div>
              <div className="page-eyebrow">Bu Ay</div>
              <h1 className="page-title">Budget</h1>
              <p className="page-sub">Bu ay paran nereye gidiyor?</p>
            </div>
          </div>
          <div className="empty-hero">
            <div className="empty-hero-mark"><Icon name="pie" /></div>
            <h2>Henüz bütçe yok.</h2>
            <p>
              İlk bütçeni oluştur. Bir kategori için aylık limit belirle —
              gerçekçi tut, ay içinde kendiliğinden hizalanır.
            </p>
            <div className="empty-hero-actions">
              <button className="btn solid"><Icon name="plus" /> İlk bütçeyi oluştur</button>
              <button className="btn ghost" onClick={() => window.TBOpenQuickAdd?.()}>
                <Icon name="receipt" /> Önce işlem ekle
              </button>
            </div>
          </div>
        </div>
      );
    }

    const totalSpent = D.budgets.reduce((s, b) => s + b.spent, 0);
    const totalLimit = D.budgets.reduce((s, b) => s + b.limit, 0);
    const pct        = totalLimit ? Math.round((totalSpent / totalLimit) * 100) : 0;
    const dayOfMonth = 13, daysInMonth = 30;
    const projected  = Math.round((totalSpent / dayOfMonth) * daysInMonth);
    const overBy     = projected - totalLimit;
    const dailyLeft  = Math.round((totalLimit - totalSpent) / Math.max(1, daysInMonth - dayOfMonth));

    return (
      <div className="page">
        <div className="page-head">
          <div>
            <div className="page-eyebrow">Bu Ay · Haziran 2026</div>
            <h1 className="page-title">Budget</h1>
            <p className="page-sub">Bu ay paran nereye gidiyor?</p>
          </div>
          <TimeFilter value={period} onChange={setPeriod} />
        </div>

        <div className="grid-12">
          <div className="card span-8">
            <div className="card-head">
              <div>
                <div className="card-eyebrow">Bütçe kullanımı</div>
                <div className="serif" style={{ fontSize: 30, fontStyle: "italic", color: "var(--tx-0)", fontWeight: 380, letterSpacing: "-0.02em" }}>
                  {D.fmt(totalSpent)} <span style={{ color: "var(--tx-2)" }}>/ {D.fmt(totalLimit)}</span>
                </div>
              </div>
              <span className={"chip " + (pct < 80 ? "tone-pos" : pct < 100 ? "tone-warn" : "tone-neg")}>
                %{pct} kullanıldı
              </span>
            </div>
            <div className="meter lg" style={{ height: 12 }}>
              <div className="meter-fill" style={{ width: Math.min(100, pct) + "%", background: pct > 100 ? "var(--neg)" : pct > 85 ? "var(--warn)" : "var(--pos)" }} />
            </div>
            <div className="grid-3" style={{ marginTop: 6 }}>
              <Mini label="Ay sonu tahmini" value={D.fmt(projected)} tone={projected > totalLimit ? "neg" : "pos"} />
              <Mini label="Aşım"            value={overBy > 0 ? "+" + D.fmt(overBy) : "—"} tone={overBy > 0 ? "neg" : "pos"} />
              <Mini label="Günlük kalan"    value={D.fmt(dailyLeft)} tone="ac" />
            </div>
            <AIRow tone="warn" icon="info" rationale="trend: 13/30 gün, mevcut tempo">
              Bu hızla gidersen ay sonunda bütçeyi <b>{D.fmt(overBy)}</b> aşacaksın. En kolay kısılacak 3 kategori: <b>kahve, restoran, online alışveriş</b>.
            </AIRow>
          </div>

          <div className="card span-4">
            <div className="card-title">En çok sapma</div>
            {D.budgets
              .map(b => ({ ...b, delta: b.spent - b.limit }))
              .sort((a, b) => b.delta - a.delta)
              .slice(0, 4)
              .map((b, i) => (
                <div className="lrow" key={b.id}>
                  <span className="l-ic"><Icon name={b.icon} /></span>
                  <div className="l-main">
                    <b>{b.name}</b>
                    <span>{D.fmt(b.spent)} / {D.fmt(b.limit)}</span>
                  </div>
                  <span className={"chip " + (b.delta > 0 ? "tone-neg" : "tone-pos")}>
                    {b.delta > 0 ? "+" : ""}{D.fmtK(b.delta)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* category limits */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Kategori limitleri</div>
            <button className="btn ghost sm"><Icon name="plus" /> Kategori ekle</button>
          </div>
          <div className="grid-2">
            {D.budgets.map(b => {
              const pct = Math.round((b.spent / b.limit) * 100);
              const tone = pct > 100 ? "neg" : pct > 85 ? "warn" : "pos";
              return (
                <div key={b.id} style={{
                  padding: 16, background: "var(--bg-1)",
                  borderRadius: 14, border: "1px solid var(--line-soft)",
                  display: "flex", flexDirection: "column", gap: 10,
                }}>
                  <div className="flex between">
                    <div className="flex gap8">
                      <span className="l-ic"><Icon name={b.icon} /></span>
                      <div>
                        <b style={{ fontSize: 13 }}>{b.name}</b>
                        <span className="muted" style={{ fontSize: 11, display: "block", marginTop: 1 }}>{b.kind}</span>
                      </div>
                    </div>
                    <span className={"chip tone-" + tone}>%{pct}</span>
                  </div>
                  <div>
                    <div className={"meter tone-" + tone}>
                      <div className="meter-fill" style={{ width: Math.min(100, pct) + "%" }} />
                    </div>
                    <div className="flex between" style={{ marginTop: 6 }}>
                      <span className="muted mono" style={{ fontSize: 11 }}>{D.fmt(b.spent)} kullanıldı</span>
                      <span className="muted mono" style={{ fontSize: 11 }}>{D.fmt(b.limit)} limit</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function Mini({ label, value, tone = "ac" }) {
    return (
      <div className="card flat tight">
        <span className="card-eyebrow">{label}</span>
        <span className="mono" style={{ fontSize: 18, color: "var(--" + tone + ")" }}>{value}</span>
      </div>
    );
  }

  /* =========================================================
     CARDS
  ========================================================= */
  function Cards() {
    if (!D.cards || D.cards.length === 0) {
      return (
        <div className="page">
          <div className="page-head">
            <div>
              <div className="page-eyebrow">Kredi Kartları</div>
              <h1 className="page-title">Cards</h1>
              <p className="page-sub">Limit, kullanım, son ödeme tarihi — hepsi tek ekranda.</p>
            </div>
          </div>
          <div className="empty-hero">
            <div className="empty-hero-mark"><Icon name="card" /></div>
            <h2>Henüz kart yok.</h2>
            <p>
              Bir kart ekle — limit, kullanım oranı ve son ödeme tarihleri
              senin yerine takip edilsin.
            </p>
            <div className="empty-hero-actions">
              <button className="btn solid"><Icon name="plus" /> Kart ekle</button>
            </div>
          </div>
        </div>
      );
    }

    const totalLimit = D.cards.reduce((s, c) => s + c.limit, 0);
    const totalUsed  = D.cards.reduce((s, c) => s + c.used, 0);
    const totalDebt  = D.cards.reduce((s, c) => s + c.debt, 0);
    const totalMin   = D.cards.reduce((s, c) => s + c.min, 0);
    const utilization = totalLimit ? Math.round((totalUsed / totalLimit) * 100) : 0;

    return (
      <div className="page">
        <div className="page-head">
          <div>
            <div className="page-eyebrow">Kredi Kartları · {D.cards.length} kart</div>
            <h1 className="page-title">Cards</h1>
            <p className="page-sub">Apple Wallet hissi · risk, limit, taksit ve son ödeme aynı yerde.</p>
          </div>
          <button className="btn"><Icon name="plus" /> Kart ekle</button>
        </div>

        <div className="grid-4">
          <Mini label="Toplam Limit"    value={D.fmtK(totalLimit)}  tone="ac" />
          <Mini label="Kullanılan"      value={D.fmtK(totalUsed)}   tone="warn" />
          <Mini label="Toplam Borç"     value={D.fmtK(totalDebt)}   tone="neg" />
          <Mini label="Asgari Toplam"   value={D.fmtK(totalMin)}    tone="ac" />
        </div>

        <AIRow tone="warn" icon="info" rationale="60g kullanım trendi">
          Genel limit kullanım oranın <b>%{utilization}</b>. En çok kullanılan kart yakından izleniyor.
        </AIRow>

        <div className="grid-2">
          {D.cards.map(c => {
            const usagePct = Math.round((c.used / c.limit) * 100) || 0;
            return (
              <div className="card" key={c.id} style={{ padding: 0, overflow: "hidden" }}>
                <div className={"cc " + c.brand} style={{ height: 220, borderRadius: 0, border: 0 }}>
                  <div>
                    <div className="cc-bank">{c.bank}</div>
                    <div className="cc-name">{c.name}</div>
                  </div>
                  <div>
                    <div className="cc-debt-label">Güncel borç</div>
                    <div className="cc-debt">{D.fmt(c.debt)}</div>
                  </div>
                  <div className="cc-foot">
                    <div>
                      <div className="cc-num">{c.num}</div>
                      <div className="cc-due">son ödeme · {c.due === "—" ? "—" : (c.due.slice(8,10) + "." + c.due.slice(5,7))}</div>
                    </div>
                    <RiskPill level={c.risk} />
                  </div>
                </div>
                <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div className="flex between">
                    <span className="dim" style={{ fontSize: 12 }}>Limit kullanımı</span>
                    <span className="mono" style={{ fontSize: 12 }}>{D.fmtK(c.used)} / {D.fmtK(c.limit)} · %{usagePct}</span>
                  </div>
                  <div className={"meter tone-" + (usagePct > 70 ? "neg" : usagePct > 40 ? "warn" : "pos")}>
                    <div className="meter-fill" style={{ width: Math.min(100, usagePct) + "%" }} />
                  </div>
                  <div className="grid-3" style={{ gap: 8 }}>
                    <KvSm k="Asgari" v={D.fmt(c.min)} />
                    <KvSm k="Hesap kesim" v={c.cut === "—" ? "—" : c.cut.slice(8,10) + "." + c.cut.slice(5,7)} />
                    <KvSm k="Taksit" v={c.instal + " adet"} />
                  </div>
                  {c.ai && (
                    <AIRow tone={c.risk === "watch" ? "warn" : c.risk === "critical" ? "neg" : "ac"}
                           icon="spark" rationale="kart kullanım + ödeme geçmişi">
                      {c.ai}
                    </AIRow>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function KvSm({ k, v }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span className="muted mono" style={{ fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase" }}>{k}</span>
        <span className="mono" style={{ fontSize: 12, color: "var(--tx-0)" }}>{v}</span>
      </div>
    );
  }

  /* =========================================================
     GOALS
  ========================================================= */
  function Goals() {
    if (!D.goals || D.goals.length === 0) {
      return (
        <div className="page">
          <div className="page-head">
            <div>
              <div className="page-eyebrow">Hedefler</div>
              <h1 className="page-title">Goals</h1>
              <p className="page-sub">Acil fon, tatil, yatırım, donanım — her hedef için aylık katkı ve tahmini bitiş.</p>
            </div>
          </div>
          <div className="empty-hero">
            <div className="empty-hero-mark"><Icon name="flag" /></div>
            <h2>Henüz hedef koyulmamış.</h2>
            <p>
              Birikim ya da bir tatil — küçük bir hedef bile zihnini sakinleştirir.
              İlk hedefini koy, sistem aylık katkıyı senin için planlasın.
            </p>
            <div className="empty-hero-actions">
              <button className="btn solid"><Icon name="plus" /> İlk hedefi ekle</button>
            </div>
          </div>
        </div>
      );
    }

    const totalSaved = D.goals.reduce((s, g) => s + g.current, 0);
    const totalTarget= D.goals.reduce((s, g) => s + g.target, 0);
    const overall    = totalTarget ? Math.round((totalSaved / totalTarget) * 100) : 0;

    return (
      <div className="page">
        <div className="page-head">
          <div>
            <div className="page-eyebrow">{D.goals.length} hedef · genel %{overall}</div>
            <h1 className="page-title">Goals</h1>
            <p className="page-sub">Acil fon, tatil, yatırım, donanım — her biri için aylık katkı ve tahmini bitiş.</p>
          </div>
          <button className="btn"><Icon name="plus" /> Hedef ekle</button>
        </div>

        <div className="grid-3">
          <Mini label="Toplam Hedef"     value={D.fmtK(totalTarget)} tone="ac" />
          <Mini label="Birikim"          value={D.fmtK(totalSaved)}  tone="pos" />
          <Mini label="Genel İlerleme"   value={"%" + overall}        tone="ac" />
        </div>

        <div className="grid-2">
          {D.goals.map(g => {
            const pct = Math.round((g.current / g.target) * 100);
            const remaining = g.target - g.current;
            const months = Math.ceil(remaining / g.monthly);
            return (
              <div className="card" key={g.id}>
                <div className="card-head">
                  <div>
                    <div className="card-eyebrow">{g.priority} öncelik</div>
                    <div className="card-title" style={{ fontSize: 18, marginTop: 2 }}>{g.name}</div>
                  </div>
                  <ProgressRing value={pct} size={64} stroke={5} color={pct > 70 ? "var(--pos)" : "var(--ac)"} />
                </div>
                <div className="grid-3" style={{ gap: 8 }}>
                  <KvSm k="Hedef"   v={D.fmtK(g.target)} />
                  <KvSm k="Birikim" v={D.fmtK(g.current)} />
                  <KvSm k="Aylık"   v={D.fmtK(g.monthly)} />
                </div>
                <div className={"meter tone-" + (pct > 70 ? "pos" : "ac")}>
                  <div className="meter-fill" style={{ width: pct + "%" }} />
                </div>
                <div className="flex between" style={{ marginTop: -4 }}>
                  <span className="muted mono" style={{ fontSize: 11 }}>{months} ay kaldı · hedef {g.due}</span>
                  <span className="muted mono" style={{ fontSize: 11 }}>kalan {D.fmtK(remaining)}</span>
                </div>
                {g.ai && (
                  <AIRow tone="ac" icon="spark" rationale="aylık katkı + tarih projeksiyonu">{g.ai}</AIRow>
                )}
                <div className="flex gap8">
                  <button className="btn ghost sm"><Icon name="plus" /> Katkı yap</button>
                  <button className="btn ghost sm"><Icon name="edit" /> Düzenle</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* =========================================================
     DEBTS
  ========================================================= */
  function Debts() {
    if (!D.debts || D.debts.length === 0) {
      return (
        <div className="page">
          <div className="page-head">
            <div>
              <div className="page-eyebrow">Borçlar</div>
              <h1 className="page-title">Debts</h1>
              <p className="page-sub">Geri ödeme planı · faiz baskısı · borçsuz olma tarihi.</p>
            </div>
          </div>
          <div className="empty-hero">
            <div className="empty-hero-mark"><Icon name="check" /></div>
            <h2>Borç görünmüyor.</h2>
            <p>
              Sessiz bir liste. Kredi, taksit ya da arkadaş borcu olduğunda
              buradan toplam yükü ve aylık tempoyu görürsün.
            </p>
            <div className="empty-hero-actions">
              <button className="btn solid"><Icon name="plus" /> Borç ekle</button>
            </div>
          </div>
        </div>
      );
    }

    const total = D.debts.reduce((s, d) => s + d.amount, 0);
    const totalMonthly = D.debts.reduce((s, d) => s + d.monthly, 0);

    return (
      <div className="page">
        <div className="page-head">
          <div>
            <div className="page-eyebrow">{D.debts.length} borç · aylık {D.fmtK(totalMonthly)}</div>
            <h1 className="page-title">Debts</h1>
            <p className="page-sub">Geri ödeme planı · faiz baskısı · borçsuz olma tarihi.</p>
          </div>
          <button className="btn"><Icon name="plus" /> Borç ekle</button>
        </div>

        <div className="grid-3">
          <Mini label="Toplam Borç"     value={D.fmtK(total)}        tone="neg" />
          <Mini label="Aylık Ödeme"     value={D.fmtK(totalMonthly)} tone="warn" />
          <Mini label="Borçsuz Tarih"   value="—"                    tone="ac" />
        </div>

        <AIRow tone="ac" icon="spark" rationale="aylık net tasarruf + faiz oranları">
          Önce en yüksek faizli borcu kapatmak genelde en hızlı yol. Sistem mevcut tempona göre bunu hesaplar.
        </AIRow>

        <div className="card flat" style={{ padding: 0, borderRadius: 18, overflow: "hidden" }}>
          <table className="t">
            <thead>
              <tr>
                <th style={{ paddingLeft: 18 }}>Borç</th>
                <th>Tür</th>
                <th>Aylık ödeme</th>
                <th>Faiz</th>
                <th>Vade</th>
                <th>Öncelik</th>
                <th className="right" style={{ paddingRight: 18 }}>Tutar</th>
              </tr>
            </thead>
            <tbody>
              {D.debts.map(d => (
                <tr key={d.id}>
                  <td style={{ paddingLeft: 18 }}>
                    <div className="flex gap8">
                      <span className="l-ic"><Icon name={d.type === "Kredi Kartı" ? "card" : d.type === "Taksit" ? "layers" : "user"} /></span>
                      <b>{d.name}</b>
                    </div>
                  </td>
                  <td><span className="chip">{d.type}</span></td>
                  <td className="num">{D.fmt(d.monthly)}</td>
                  <td className="num">{d.rate.toString().replace(".", ",")}%</td>
                  <td className="dim mono">{d.due.slice(8,10)}.{d.due.slice(5,7)}.{d.due.slice(2,4)}</td>
                  <td>
                    <span className={"chip tone-" + (d.priority === 1 ? "neg" : d.priority === 2 ? "warn" : "pos")}>
                      P{d.priority}
                    </span>
                  </td>
                  <td className="num right" style={{ paddingRight: 18, color: "var(--tx-0)" }}>{D.fmt(d.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* =========================================================
     INCOME
  ========================================================= */
  function Income() {
    if (!D.incomeBreakdown || D.incomeBreakdown.length === 0) {
      return (
        <div className="page">
          <div className="page-head">
            <div>
              <div className="page-eyebrow">Gelir</div>
              <h1 className="page-title">Income</h1>
              <p className="page-sub">Maaş, freelance, pasif gelir — hepsi tek akışta.</p>
            </div>
          </div>
          <div className="empty-hero">
            <div className="empty-hero-mark"><Icon name="income" /></div>
            <h2>Henüz gelir kaydı yok.</h2>
            <p>
              Maaş, freelance, kira, pasif gelir — ne girersen burada
              dağılımı ve aylık ortalaması netleşir.
            </p>
            <div className="empty-hero-actions">
              <button className="btn solid"><Icon name="plus" /> Gelir ekle</button>
              <button className="btn ghost"><Icon name="upload" /> Bordro yükle</button>
            </div>
          </div>
        </div>
      );
    }

    const total = D.incomeBreakdown.reduce((s, i) => s + i.amount, 0);
    return (
      <div className="page">
        <div className="page-head">
          <div>
            <div className="page-eyebrow">Aylık · Haziran 2026</div>
            <h1 className="page-title">Income</h1>
            <p className="page-sub">Maaş, freelance, pasif gelir — hepsi tek akışta.</p>
          </div>
          <div className="flex gap8">
            <button className="btn ghost"><Icon name="upload" /> Bordro yükle</button>
            <button className="btn"><Icon name="plus" /> Gelir ekle</button>
          </div>
        </div>

        <div className="grid-12">
          <div className="card span-7">
            <div className="card-head">
              <div>
                <div className="card-eyebrow">Toplam aylık gelir</div>
                <div className="serif" style={{ fontSize: 38, fontStyle: "italic", color: "var(--pos)", fontWeight: 380, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  {D.fmt(total)}
                </div>
                <div className="flex gap8" style={{ marginTop: 6 }}>
                  <span className="delta flat mono">— 0%</span>
                  <span className="dim" style={{ fontSize: 12 }}>geçen aya göre sabit</span>
                </div>
              </div>
            </div>
            <Donut data={D.incomeBreakdown.map(s => ({ name: s.source, value: s.amount, color: s.color }))}
              size={180} thickness={16}
              center={<><b>{D.fmtK(total)}</b><span>aylık</span></>} />
          </div>

          <div className="card span-5">
            <div className="card-title">Gelir kaynakları</div>
            {D.incomeBreakdown.map((i, idx) => (
              <div className="lrow" key={idx}>
                <span className="l-ic" style={{ background: "var(--bg-3)" }}>
                  <Icon name={i.type === "Maaş" ? "income" : i.type === "Freelance" ? "edit" : i.type === "Pasif" ? "home" : "tag"} />
                </span>
                <div className="l-main">
                  <b>{i.source}</b>
                  <span>{i.type} · {i.freq} {i.date !== "—" && "· " + i.date}</span>
                </div>
                <span className="l-amt mono" style={{ color: "var(--pos)" }}>+{D.fmt(i.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Bordro yükleme</div>
            <span className="muted mono" style={{ fontSize: 11 }}>PDF, JPG, PNG · max 10MB</span>
          </div>
          <div style={{
            border: "1.5px dashed var(--line)", borderRadius: 14,
            padding: 36, textAlign: "center", color: "var(--tx-2)",
            background: "var(--bg-1)", cursor: "pointer",
          }}>
            <Icon name="upload" style={{ width: 22, height: 22, opacity: 0.6 }} />
            <div style={{ fontSize: 13, color: "var(--tx-1)", marginTop: 8 }}>Bordro dosyasını sürükle bırak</div>
            <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>
              Brüt, net, vergi, SGK ve yan haklar otomatik çıkarılır.
            </div>
          </div>
          <AIRow tone="ac" icon="spark" rationale="bordro çıkarımı · OCR + LLM">
            Bordro yüklendiğinde net maaş, brüt maaş, kesintiler ve yan haklar tablosu otomatik oluşur.
          </AIRow>
        </div>
      </div>
    );
  }

  Object.assign(window, { Budget, Cards, Goals, Debts, Income });
})();
