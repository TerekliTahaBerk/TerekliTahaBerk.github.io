/* ============================================================
   Private Finance OS — mock data (TR, ₺) — Apple-vari edition
   ------------------------------------------------------------
   All numbers are local demo data. No real PII.
   In production: replace with API/DB-backed sources, normalize
   currencies, and persist via a real auth-bound user_id.
============================================================ */
window.DATA = (function () {
  const fmt  = (n) => "₺" + Math.round(n).toLocaleString("tr-TR");
  const fmtK = (n) => {
    if (Math.abs(n) >= 1_000_000) return "₺" + (n / 1_000_000).toFixed(1).replace(".", ",") + "M";
    if (Math.abs(n) >= 1_000)     return "₺" + (n / 1_000).toFixed(1).replace(".", ",") + "K";
    return fmt(n);
  };
  const fmtPct = (n) => (n > 0 ? "+" : "") + n.toFixed(1).replace(".", ",") + "%";

  // ----------- KPIs (8) -----------
  const kpis = [
    { id: "networth", label: "Net Değer",       value: 1_847_320, unit: "₺", delta: 4.2, spark: [1.62,1.66,1.69,1.72,1.74,1.76,1.79,1.82,1.84,1.85].map(x=>x*1e6),
      ai: "Bu ay net değer +%4.2 büyüdü; itici güç yatırım pozitif değerlemesi." },
    { id: "income",   label: "Aylık Gelir",     value: 92_500,    unit: "₺", delta: 0.0, spark: [88500,89000,90500,91000,92500,92500,92500,92500,92500,92500],
      ai: "Maaş yatırıldı; yan gelir bandın içinde sabit." },
    { id: "expense",  label: "Aylık Gider",     value: 38_640,    unit: "₺", delta: 12.4, badDelta: true, spark: [29800,31200,30900,33200,34100,35900,37200,37800,38200,38640],
      ai: "Restoran kategorisi gider artışının %38'ini açıklıyor." },
    { id: "savings",  label: "Tasarruf Oranı",  value: 58.2,      unit: "%", delta: -3.1, spark: [62.1,62.0,61.4,61.0,60.5,60.2,59.8,59.0,58.6,58.2],
      ai: "Hala hedef bandının üstünde, ama momentum aşağı." },
    { id: "invest",   label: "Yatırım Değeri",  value: 1_212_400, unit: "₺", delta: 2.8, spark: [1.16,1.17,1.18,1.18,1.19,1.20,1.20,1.21,1.21,1.21].map(x=>x*1e6),
      ai: "Hisse + fon tarafı +%3.4; nakit pozisyonun stabil." },
    { id: "ccdebt",   label: "Kart Borcu",      value: 64_280,    unit: "₺", delta: 8.6, badDelta: true, spark: [52000,54200,55800,57100,58400,60000,61500,62700,63500,64280],
      ai: "Akbank kartı toplam borcun %62'sini taşıyor." },
    { id: "cash",     label: "Kullanılabilir Nakit", value: 184_700, unit: "₺", delta: 1.2, spark: [178000,179500,180800,181500,182600,183400,183900,184200,184400,184700],
      ai: "1.6 aylık gideri karşılayacak tampon; bandının ortasında." },
    { id: "goals",    label: "Hedef İlerlemesi", value: 64.5,     unit: "%", delta: 1.8, spark: [55,57,58.5,60,61.2,62.4,63,63.8,64.2,64.5],
      ai: "Japonya hedefi en hızlı; Acil Fon yavaş ilerliyor." },
  ];

  // ----------- Cash flow (12 month) -----------
  const monthLabels = ["Tem","Ağu","Eyl","Eki","Kas","Ara","Oca","Şub","Mar","Nis","May","Haz"];
  const cashflow = {
    labels: monthLabels,
    income:  [88_500, 89_000, 90_500, 91_000, 92_500, 92_500, 92_500, 92_500, 92_500, 92_500, 92_500, 92_500],
    expense: [29_800, 31_200, 30_900, 33_200, 34_100, 35_900, 37_200, 37_800, 38_200, 38_400, 38_600, 38_640],
  };

  // ----------- Categories (donut) -----------
  const categories = [
    { name: "Sabit Giderler", value: 12_400, color: "var(--tx-1)",  pct: 32.1 },
    { name: "Restoran",       value:  7_250, color: "var(--neg)",   pct: 18.8 },
    { name: "Market",         value:  6_120, color: "var(--pos)",   pct: 15.8 },
    { name: "Ulaşım",         value:  3_640, color: "var(--inv)",   pct:  9.4 },
    { name: "Online Alışveriş", value: 3_120, color: "var(--warn)", pct:  8.1 },
    { name: "Eğlence",        value:  2_410, color: "var(--ac)",    pct:  6.2 },
    { name: "Diğer",          value:  3_700, color: "var(--tx-3)",  pct:  9.6 },
  ];

  // ----------- Upcoming -----------
  const upcoming = [
    { name: "Akbank kart son ödeme", amount: 39_850, date: "2026-06-19", days: 6, kind: "card", risk: "watch" },
    { name: "Kira",                  amount: 22_500, date: "2026-06-27", days: 14, kind: "rent", risk: "safe" },
    { name: "Spotify Family",        amount:    119, date: "2026-06-22", days: 9, kind: "sub", risk: "safe" },
    { name: "Garanti kart son ödeme",amount: 11_240, date: "2026-06-30", days: 17, kind: "card", risk: "safe" },
    { name: "İnternet (Türk Telekom)", amount: 459, date: "2026-06-25", days: 12, kind: "sub", risk: "safe" },
  ];

  // ----------- Credit cards -----------
  const cards = [
    { id: "c1", bank: "Akbank",      name: "Axess Premium", brand: "akbank",  num: "•••• 4831", limit: 60_000, used: 39_850, debt: 39_850, min: 4_980, due: "2026-06-19", cut: "2026-06-09", risk: "watch",
      ai: "Bu kartı bu ay kullanmayı durdurmak iyi olur. Kart oranı limit eşiğinin yakınında.", instal: 4 },
    { id: "c2", bank: "Garanti BBVA",name: "Bonus Platinum", brand: "garanti",num: "•••• 2207", limit: 45_000, used: 11_240, debt: 11_240, min: 1_124, due: "2026-06-30", cut: "2026-06-15", risk: "safe",
      ai: "En sağlıklı kartın; %25 kullanım oranıyla rahat bandında.", instal: 1 },
    { id: "c3", bank: "Yapı Kredi",  name: "World Gold",     brand: "ykb",    num: "•••• 7129", limit: 30_000, used: 13_190, debt: 13_190, min: 1_650, due: "2026-07-04", cut: "2026-06-19", risk: "safe",
      ai: "Market harcamalarının ana kartı; bandında.", instal: 0 },
    { id: "c4", bank: "QNB",         name: "CardFinans",     brand: "qnb",    num: "•••• 9042", limit: 25_000, used:      0, debt:      0, min:     0, due: "—",         cut: "—",         risk: "safe",
      ai: "Yedek kart. Şu anda kullanılmıyor.", instal: 0 },
  ];

  // ----------- Investments -----------
  const investments = {
    total: 1_212_400, costBase: 1_092_000, dailyChange: 12_240,
    perf: { labels: monthLabels, values: [980,995,1010,1025,1040,1062,1080,1106,1140,1175,1198,1212].map(x=>x*1000) },
    assets: [
      { name: "Hisse Senedi (TR)", value: 312_400, pct: 25.8, color: "var(--inv)", change: 4.2 },
      { name: "Yatırım Fonu",      value: 188_000, pct: 15.5, color: "var(--ac)",  change: 2.1 },
      { name: "Altın",             value: 224_000, pct: 18.5, color: "var(--warn)",change: 6.8 },
      { name: "USD Mevduat",       value: 168_000, pct: 13.9, color: "var(--pos)", change: 0.9 },
      { name: "Eurobond",          value: 142_000, pct: 11.7, color: "var(--tx-1)",change: 1.4 },
      { name: "BES",               value:  98_000, pct:  8.1, color: "var(--tx-2)",change: 0.7 },
      { name: "Kripto",            value:  46_000, pct:  3.8, color: "var(--neg)", change: -3.4 },
      { name: "Nakit",             value:  34_000, pct:  2.8, color: "var(--tx-3)",change: 0.0 },
    ],
    risk: [
      { name: "Düşük",  pct: 38, color: "var(--pos)" },
      { name: "Orta",   pct: 41, color: "var(--warn)" },
      { name: "Yüksek", pct: 21, color: "var(--neg)" },
    ],
  };

  // ----------- Goals -----------
  const goals = [
    { id: "g1", name: "Acil Durum Fonu",    target: 240_000, current:  76_500, monthly: 8_000,  due: "2027-01", priority: "Yüksek",
      ai: "1.6 aylık gider tamponun var; 6 aylık hedefe gitmek için aylık katkıyı +₺2.500 artır." },
    { id: "g2", name: "Japonya Tatili",     target: 180_000, current: 132_000, monthly: 12_000, due: "2026-10", priority: "Orta",
      ai: "Bu tempoda Eylül sonu hazır; uçak biletlerini Temmuz'da kilitle." },
    { id: "g3", name: "Yatırım Sermayesi",  target: 500_000, current: 312_400, monthly: 18_000, due: "2027-06", priority: "Yüksek",
      ai: "Plan dahilinde. Aylık otomatik aktarımı sürdür." },
    { id: "g4", name: "Macbook Pro",        target:  85_000, current:  51_200, monthly:  6_000, due: "2026-09", priority: "Düşük",
      ai: "Eylül başında hazır olur; mevcut Macbook satışı +₺18.000 katkı sağlayabilir." },
  ];

  // ----------- Debts -----------
  const debts = [
    { id: "d1", name: "Akbank Kart",     type: "Kredi Kartı", amount: 39_850, monthly: 4_980, rate: 4.42, due: "2026-06-19", priority: 1,
      ai: "En yüksek faizli borç; öncelikle bunu kapatmak en yüksek getiriyi sağlar." },
    { id: "d2", name: "Yapı Kredi Kart", type: "Kredi Kartı", amount: 13_190, monthly: 1_650, rate: 4.42, due: "2026-07-04", priority: 2 },
    { id: "d3", name: "Garanti Kart",    type: "Kredi Kartı", amount: 11_240, monthly: 1_124, rate: 4.42, due: "2026-06-30", priority: 3 },
    { id: "d4", name: "Kişisel — Mert",  type: "Kişisel",     amount:  6_500, monthly: 2_000, rate: 0.0,  due: "2026-08-15", priority: 4 },
    { id: "d5", name: "Macbook Taksit",  type: "Taksit",      amount: 18_400, monthly: 4_600, rate: 0.0,  due: "2026-10-01", priority: 5 },
  ];

  // ----------- Income (sources) -----------
  const incomeBreakdown = [
    { source: "Maaş — Getir",        amount: 92_500, type: "Maaş",      freq: "Aylık", date: "Her ayın 1'i", color: "var(--pos)" },
    { source: "Freelance (data)",    amount:  6_400, type: "Freelance", freq: "Değişken", date: "—",          color: "var(--inv)" },
    { source: "Yatırım Geliri",      amount:  3_120, type: "Pasif",     freq: "Aylık ort.", date: "—",        color: "var(--ac)" },
    { source: "Kira (oda)",          amount:  4_500, type: "Pasif",     freq: "Aylık", date: "Her ayın 5'i",  color: "var(--warn)" },
    { source: "Geri Ödemeler",       amount:    850, type: "Diğer",     freq: "Değişken", date: "—",          color: "var(--tx-2)" },
  ];

  // ----------- Budgets -----------
  const budgets = [
    { id: "b1", name: "Restoran",         limit: 6_000, spent: 7_250, kind: "Keyfi",     icon: "food" },
    { id: "b2", name: "Market",           limit: 7_500, spent: 6_120, kind: "Zorunlu",   icon: "cart" },
    { id: "b3", name: "Ulaşım",           limit: 4_000, spent: 3_640, kind: "Zorunlu",   icon: "car" },
    { id: "b4", name: "Online Alışveriş", limit: 2_500, spent: 3_120, kind: "Keyfi",     icon: "bag" },
    { id: "b5", name: "Eğlence",          limit: 3_000, spent: 2_410, kind: "Keyfi",     icon: "play" },
    { id: "b6", name: "Sağlık",           limit: 2_000, spent:   480, kind: "Zorunlu",   icon: "heart" },
    { id: "b7", name: "Faturalar",        limit: 6_500, spent: 6_280, kind: "Sabit",     icon: "bolt" },
    { id: "b8", name: "Kira",             limit: 22_500,spent: 22_500,kind: "Sabit",     icon: "home" },
  ];

  // ----------- Transactions (more diverse, 30 rows) -----------
  const tx = [
    { id: "t1",  name: "Starbucks Reserve",   amount: 180,   kind: "keyfi",  category: "Kahve",      card: "Garanti BBVA", location: "Bağdat Cd, Kadıköy", date: "13 Haz", time: "08:42", source: "whatsapp", confidence: 0.97, recurring: false, tags: ["sabah","ofis-yolu"] },
    { id: "t2",  name: "Migros 5M",           amount: 920,   kind: "zorunlu",category: "Market",     card: "Yapı Kredi",   location: "Acıbadem",            date: "13 Haz", time: "19:11", source: "whatsapp", confidence: 0.98, recurring: false, tags: ["haftalık"] },
    { id: "t3",  name: "Maaş — Getir",        amount: 92_500,kind: "gelir",  category: "Maaş",       card: "Akbank Hesap", location: "—",                   date: "01 Haz", time: "09:00", source: "manual",   confidence: 1.00, recurring: true,  tags: ["maaş"] },
    { id: "t4",  name: "Akbank Kart Borcu",   amount: 39_850,kind: "zorunlu",category: "Kart Borcu", card: "Akbank",       location: "—",                   date: "—",     time: "—",     source: "manual",   confidence: 1.00, recurring: false, tags: ["kart"] },
    { id: "t5",  name: "Sushiko",             amount: 1_240, kind: "keyfi",  category: "Restoran",   card: "Akbank",       location: "Karaköy",             date: "12 Haz", time: "20:34", source: "whatsapp", confidence: 0.93, recurring: false, tags: ["arkadaş"] },
    { id: "t6",  name: "Spotify Family",      amount: 119,   kind: "zorunlu",category: "Abonelik",   card: "Garanti BBVA", location: "—",                   date: "12 Haz", time: "—",     source: "sheets",   confidence: 1.00, recurring: true,  tags: ["aile"] },
    { id: "t7",  name: "Trendyol",            amount: 1_840, kind: "keyfi",  category: "Online Alışveriş", card: "Akbank",  location: "—",                  date: "11 Haz", time: "23:08", source: "manual",   confidence: 0.86, recurring: false, tags: ["giyim"] },
    { id: "t8",  name: "Marmaray",            amount:    47, kind: "zorunlu",category: "Ulaşım",     card: "İstanbulkart", location: "Söğütlüçeşme",        date: "11 Haz", time: "08:15", source: "manual",   confidence: 1.00, recurring: false, tags: ["ofis"] },
    { id: "t9",  name: "Kahve Dünyası",       amount:    65, kind: "keyfi",  category: "Kahve",      card: "Akbank",       location: "Levent",              date: "11 Haz", time: "14:21", source: "whatsapp", confidence: 0.95, recurring: false, tags: ["öğle-arası"] },
    { id: "t10", name: "Cinemaximum",         amount:   320, kind: "keyfi",  category: "Eğlence",    card: "Garanti BBVA", location: "Kadıköy",             date: "10 Haz", time: "21:30", source: "manual",   confidence: 0.91, recurring: false, tags: ["dışarı"] },
    { id: "t11", name: "Apple App Store",     amount:    89, kind: "keyfi",  category: "Online Alışveriş", card: "Akbank",  location: "—",                  date: "10 Haz", time: "11:08", source: "sheets",   confidence: 1.00, recurring: false, tags: ["iCloud"] },
    { id: "t12", name: "BiTaksi",             amount:   195, kind: "zorunlu",category: "Ulaşım",     card: "Yapı Kredi",   location: "Bostancı",            date: "09 Haz", time: "23:50", source: "manual",   confidence: 0.92, recurring: false, tags: ["gece"] },
    { id: "t13", name: "Mavi Jeans",          amount: 1_340, kind: "keyfi",  category: "Online Alışveriş", card: "Garanti BBVA", location: "—",             date: "09 Haz", time: "16:42", source: "whatsapp", confidence: 0.89, recurring: false, tags: ["yaz-koleksiyon"] },
    { id: "t14", name: "Migros Sanal",        amount:   420, kind: "zorunlu",category: "Market",     card: "Yapı Kredi",   location: "—",                   date: "08 Haz", time: "20:10", source: "sheets",   confidence: 1.00, recurring: false, tags: ["online"] },
    { id: "t15", name: "Boyner",              amount: 2_280, kind: "keyfi",  category: "Online Alışveriş", card: "Akbank",  location: "Akmerkez",           date: "07 Haz", time: "15:30", source: "manual",   confidence: 0.88, recurring: false, tags: ["yaz"] },
    { id: "t16", name: "Türk Telekom",        amount:   459, kind: "zorunlu",category: "Faturalar",  card: "Yapı Kredi",   location: "—",                   date: "06 Haz", time: "—",     source: "sheets",   confidence: 1.00, recurring: true,  tags: ["internet"] },
    { id: "t17", name: "İGDAŞ",               amount:   320, kind: "zorunlu",category: "Faturalar",  card: "Garanti BBVA", location: "—",                   date: "06 Haz", time: "—",     source: "sheets",   confidence: 1.00, recurring: true,  tags: ["doğalgaz"] },
    { id: "t18", name: "Restoran 'Coya'",     amount: 2_640, kind: "keyfi",  category: "Restoran",   card: "Akbank",       location: "Maslak",              date: "05 Haz", time: "21:14", source: "whatsapp", confidence: 0.94, recurring: false, tags: ["arkadaş"] },
    { id: "t19", name: "ÇarşıExtra",          amount: 1_180, kind: "zorunlu",category: "Market",     card: "Yapı Kredi",   location: "Acıbadem",            date: "05 Haz", time: "11:24", source: "whatsapp", confidence: 0.97, recurring: false, tags: [] },
    { id: "t20", name: "Freelance Ödeme",     amount: 6_400, kind: "gelir",  category: "Freelance",  card: "Akbank Hesap", location: "—",                   date: "04 Haz", time: "—",     source: "manual",   confidence: 1.00, recurring: false, tags: ["data-projesi"] },
    { id: "t21", name: "Hedef → Japonya",     amount: 5_000, kind: "zorunlu",category: "Hedef",      card: "Akbank Hesap", location: "—",                   date: "03 Haz", time: "—",     source: "whatsapp", confidence: 1.00, recurring: true,  tags: ["transfer"] },
    { id: "t22", name: "Garanti Kart Borcu",  amount: 11_240,kind: "zorunlu",category: "Kart Borcu", card: "Garanti BBVA", location: "—",                   date: "02 Haz", time: "—",     source: "manual",   confidence: 1.00, recurring: false, tags: ["kart"] },
    { id: "t23", name: "Kira — Acıbadem",     amount: 22_500,kind: "zorunlu",category: "Kira",       card: "Akbank Hesap", location: "—",                   date: "02 Haz", time: "—",     source: "sheets",   confidence: 1.00, recurring: true,  tags: ["sabit"] },
    { id: "t24", name: "Hardrock Cafe",       amount:   780, kind: "keyfi",  category: "Restoran",   card: "Garanti BBVA", location: "Bebek",               date: "01 Haz", time: "20:45", source: "whatsapp", confidence: 0.92, recurring: false, tags: [] },
    { id: "t25", name: "Akakce — Kulaklık",   amount: 3_280, kind: "keyfi",  category: "Online Alışveriş", card: "Akbank", location: "—",                   date: "30 May", time: "—",     source: "manual",   confidence: 0.84, recurring: false, tags: ["audio"] },
    { id: "t26", name: "Geri Ödeme — Ali",    amount:   850, kind: "gelir",  category: "Geri Ödeme", card: "Akbank Hesap", location: "—",                   date: "29 May", time: "—",     source: "whatsapp", confidence: 0.99, recurring: false, tags: [] },
    { id: "t27", name: "Mado Dondurma",       amount:   180, kind: "keyfi",  category: "Restoran",   card: "Yapı Kredi",   location: "Caddebostan",         date: "28 May", time: "22:10", source: "manual",   confidence: 0.90, recurring: false, tags: [] },
    { id: "t28", name: "Saturn Elektronik",   amount: 1_640, kind: "keyfi",  category: "Online Alışveriş", card: "Akbank", location: "—",                   date: "27 May", time: "—",     source: "sheets",   confidence: 1.00, recurring: false, tags: ["aksesuar"] },
    { id: "t29", name: "Marmaray",            amount:    47, kind: "zorunlu",category: "Ulaşım",     card: "İstanbulkart", location: "Söğütlüçeşme",        date: "26 May", time: "08:14", source: "manual",   confidence: 1.00, recurring: false, tags: ["ofis"] },
    { id: "t30", name: "Migros 5M",           amount:   860, kind: "zorunlu",category: "Market",     card: "Yapı Kredi",   location: "Acıbadem",            date: "25 May", time: "19:30", source: "whatsapp", confidence: 0.97, recurring: false, tags: ["haftalık"] },
  ];

  // ----------- WhatsApp inbox (mock parse) -----------
  const waInbox = [
    { id: "w1", time: "08:42",   raw: "Starbucks 180 TL kahve Garanti", parsed: { name: "Starbucks Reserve", amount: 180, category: "Kahve", card: "Garanti BBVA", location: "Bağdat Cd", confidence: 0.97 }, status: "pending",
      hint: "Konum eklemek ister misin?" },
    { id: "w2", time: "19:11",   raw: "Migros 920 TL market Yapı Kredi", parsed: { name: "Migros 5M", amount: 920, category: "Market", card: "Yapı Kredi", location: "Acıbadem", confidence: 0.98 }, status: "pending" },
    { id: "w3", time: "Dün 20:34", raw: "Sushiko 1240 akşam yemeği Akbank", parsed: { name: "Sushiko", amount: 1_240, category: "Restoran", card: "Akbank", location: "Karaköy", confidence: 0.93 }, status: "approved" },
    { id: "w4", time: "Dün 14:21", raw: "Kahve dünyası 65 levent", parsed: { name: "Kahve Dünyası", amount: 65, category: "Kahve", card: "Akbank", location: "Levent", confidence: 0.95 }, status: "approved",
      hint: "Bu işlem yemek mi kahve mi?" },
    { id: "w5", time: "01 Haz",  raw: "Maaş yattı 92500 TL", parsed: { name: "Maaş — Getir", amount: 92_500, category: "Gelir", card: "Akbank Hesap", location: "—", confidence: 1.00 }, status: "approved" },
    { id: "w6", time: "30 May",  raw: "Akbank kart borcu 39850 TL", parsed: { name: "Akbank Kart Borcu", amount: 39_850, category: "Kart Borcu", card: "Akbank", location: "—", confidence: 1.00 }, status: "approved" },
    { id: "w7", time: "29 May",  raw: "Japonya hedefime 5000 TL ekle", parsed: { name: "Hedef → Japonya", amount: 5_000, category: "Hedef", card: "Akbank Hesap", location: "—", confidence: 1.00 }, status: "approved" },
    { id: "w8", time: "28 May",  raw: "Bugün dışarıda yemek 450 TL Kadıköy", parsed: { name: "Restoran (Kadıköy)", amount: 450, category: "Restoran", card: "—", location: "Kadıköy", confidence: 0.78 }, status: "pending",
      hint: "Bu harcama hangi karttan yapıldı?" },
  ];

  // ----------- AI insights timeline -----------
  const aiTimeline = [
    { date: "13 Haz · 09:12", tone: "warn", title: "Restoran harcaman normal bandın üzerinde",
      body: "Son 30 günde restoran harcaman ₺7.250 oldu; geçen aya göre +%34. Kalan günlerde günlük ₺310 limiti yeterli olur.",
      rationale: "Tx t5,t18,t24 + 30 günlük rolling ortalama" },
    { date: "11 Haz · 18:40", tone: "ac", title: "Maaş sonrası ilk 3 günde fazla harcama",
      body: "Haziran 1–3 arasında toplam harcaman ₺3.420 oldu; bu 30 günlük ortalamanın %62 üzerinde.",
      rationale: "Maaş sonrası 72 saatlik harcama analizi" },
    { date: "10 Haz · 21:08", tone: "neg", title: "Akbank kartı risk bandında",
      body: "Limit kullanım oranı %66; iki ay üst üste artan trend. Bu kartı bu ay kullanmayı durdurmak iyi olur.",
      rationale: "60 günlük kullanım grafiği" },
    { date: "08 Haz · 11:30", tone: "pos", title: "Yatırım portföyü güçlü ay",
      body: "Toplam getirin +%2.8 oldu; en büyük katkı altın ve hisse tarafından. Bu bir yatırım tavsiyesi değildir.",
      rationale: "Aylık getiri kartları + varlık ağırlıkları" },
    { date: "05 Haz · 09:45", tone: "ac", title: "Japonya hedefin önde gidiyor",
      body: "Mevcut tempoda hedef Eylül sonu hazır olur; uçak biletlerini Temmuz'da kilitleyebilirsin.",
      rationale: "Hedef katkı + tarih tahmini" },
    { date: "01 Haz · 10:00", tone: "ac", title: "Sabit gider oranı %42",
      body: "Net gelirinin %42'si sabit giderlere gidiyor. 5 yıllık hedef bandın %38–%45.",
      rationale: "Kira + faturalar + abonelik analizi" },
  ];

  // ----------- Reports -----------
  const monthlyReport = {
    period: "Mayıs 2026",
    income: 92_500, expense: 38_400, savings: 54_100, savingsRate: 58.5,
    biggest: [
      { name: "Kira",        amount: 22_500, category: "Sabit"     },
      { name: "Akbank Kart", amount:  6_980, category: "Kart Borcu"},
      { name: "Restoran",    amount:  6_120, category: "Restoran"  },
      { name: "Market",      amount:  4_840, category: "Market"    },
      { name: "Trendyol",    amount:  3_120, category: "Online"    },
    ],
    deltas: [
      { cat: "Restoran", delta:  +34 },
      { cat: "Market",   delta:  -8  },
      { cat: "Online",   delta: +18  },
      { cat: "Ulaşım",   delta:   +2 },
      { cat: "Eğlence",  delta:  -12 },
    ],
    cardDebtChange:  +6_400,
    investmentChange:+24_800,
    fixedRatio: 41.8,
    summary: "Net tasarruf hedefin üstünde kaldı; kart borcu kontrol altında ama trend yukarı. Restoran + online alışveriş 'keyfi' sınıfta yoğun.",
    nextMonth: "Önümüzdeki ay 'keyfi' bütçeyi -%15 düşürmeyi öner; maaş sonrası ilk 3 güne otomatik bir 'cool-down' uyarısı kur.",
  };
  const yearlyReport = {
    period: "Son 12 ay",
    income: 1_092_000, expense: 432_000, savings: 660_000, savingsRate: 60.4,
    investment: { start: 850_000, end: 1_212_400, change: 42.6 },
    cardDebt:   { start:  21_000, end:    64_280, change: 206 },
    summary: "Yıl genelinde tasarruf oranın %60'ın üzerinde; yatırım büyüme +%42.6. Kart borcunda son çeyrek dikkat ister.",
  };
  const allTimeReport = {
    period: "Tüm zamanlar (32 ay)",
    income: 2_640_000, expense: 1_184_000, savings: 1_456_000, savingsRate: 55.2,
    networth: { start: 240_000, end: 1_847_320, change: 670 },
    summary: "32 aylık tarihçende net değer 7.7×'lik artış. En istikrarlı tasarruf bandı %52–%62.",
  };

  // ----------- Sheet connections -----------
  const sheets = [
    { name: "transactions",    rows: 1_842, lastSync: "13 Haz 09:42", status: "synced" },
    { name: "income",          rows:    87, lastSync: "13 Haz 09:42", status: "synced" },
    { name: "fixed_expenses",  rows:    32, lastSync: "13 Haz 09:42", status: "synced" },
    { name: "credit_cards",    rows:     4, lastSync: "13 Haz 09:42", status: "synced" },
    { name: "investments",     rows:    28, lastSync: "12 Haz 22:11", status: "synced" },
    { name: "goals",           rows:     4, lastSync: "13 Haz 09:42", status: "synced" },
    { name: "debts",           rows:     5, lastSync: "13 Haz 09:42", status: "synced" },
    { name: "budgets",         rows:     8, lastSync: "13 Haz 09:42", status: "synced" },
  ];

  // ----------- Notifications -----------
  const notifications = [
    { id: "n1", title: "Akbank kart son ödeme yaklaşıyor", body: "6 gün kaldı · ₺39.850", tone: "warn",  time: "Bugün 09:00" },
    { id: "n2", title: "WhatsApp'ta 2 onay bekliyor",      body: "Starbucks · Migros",   tone: "ac",    time: "Bugün 19:11" },
    { id: "n3", title: "Yatırım +%2.8 (haftalık)",         body: "Altın + hisse",         tone: "pos",   time: "Dün" },
  ];

  // ----------- Categories master -----------
  const categoryList = [
    "Kira","Faturalar","Market","Restoran","Kahve","Ulaşım","Sağlık","Eğlence",
    "Online Alışveriş","Abonelik","Kart Borcu","Hedef","Maaş","Freelance","Pasif Gelir","Geri Ödeme","Diğer"
  ];

  return {
    fmt, fmtK, fmtPct,
    today: "13 Haziran 2026, Cumartesi",
    user: { name: "Taha", initials: "TB", email: "terekli@tahaberk.com", currency: "TRY", timezone: "Europe/Istanbul" },
    kpis, cashflow, categories, upcoming, cards, investments, goals, debts,
    incomeBreakdown, budgets, tx, waInbox, aiTimeline, sheets, notifications, categoryList,
    monthlyReport, yearlyReport, allTimeReport,
    monthLabels,
  };
})();
