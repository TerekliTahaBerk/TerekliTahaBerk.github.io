# 🚀 Deploy — Vercel + Prisma Postgres

> Tek tenantlı **Private Finance OS**. Public site (`/`, `/blog`, `/posts/*`)
> dokunulmadı; Prisma + API rotaları sadece `/finance/` ve `/api/*` üzerinde.

---

## 📋 Önkoşullar

- Vercel hesabı (`vercel.com`) — repo bağlı
- Node 20+ lokal
- Prisma Postgres bağlantı dizesi (`DATABASE_URL`)
- `vercel` CLI: `npm i -g vercel`

---

## 🔐 Adım 1 — Credential rotation (KRİTİK)

Sohbette paylaştığın connection string artık sohbet geçmişinde yazılı.
**Yeni bir tane oluştur, eskisini sil.**

1. https://console.prisma.io → projen → **Database** → **Connection Strings**
2. **Rotate / Regenerate** → yeni şifre üretilir
3. Eski stringi **Revoke** et
4. `.env.local`'i yeni stringle güncelle

---

## 🌍 Adım 2 — Vercel'e environment variables ekle

### A) CLI ile (önerilen)

```bash
# 1) Repo dizininden ilk kez login + link
vercel login
vercel link

# 2) Production env'leri tek tek ekle (her komut interaktif şekilde değer ister)
vercel env add DATABASE_URL production
vercel env add POSTGRES_URL production
vercel env add PRISMA_DATABASE_URL production

# 3) Preview ortamı için de eklemek istersen:
vercel env add DATABASE_URL preview
vercel env add POSTGRES_URL preview
vercel env add PRISMA_DATABASE_URL preview

# 4) Listeyi doğrula
vercel env ls
```

### B) Dashboard ile

1. https://vercel.com/<your-team>/<your-project> → **Settings** → **Environment Variables**
2. Aşağıdaki 3 değişkeni **Production** + **Preview** için ekle:
   - `DATABASE_URL`
   - `POSTGRES_URL`
   - `PRISMA_DATABASE_URL`
3. Her birinin değeri Prisma Console'dan kopyalanmış connection string olmalı.
4. ✅ Encrypted (default) seçili kalsın.

---

## 🔧 Adım 3 — Build & deploy

```bash
git add -A
git commit -m "feat: prisma postgres backend + api routes"
git push origin main
```

Vercel otomatik tetiklenir:
1. `npm install` → `@prisma/client` + `prisma` yüklenir
2. `postinstall: prisma generate` → Prisma Client üretilir
3. `vercel-build: prisma generate` → tekrar üretilir (Vercel cache kasırgasına karşı)
4. `/api/*.js` dosyaları otomatik **serverless function** olur
5. Deploy `~40s` içinde canlıda

---

## 🩺 Adım 4 — Health check

Deploy sonrası canlı URL'i:

```bash
# JSON döner — { ok, dbConnected, dbVersion, region, ... }
curl -s https://www.tahaberk.com/api/health | jq .

# Veya tarayıcıdan:
open https://www.tahaberk.com/api/health
```

Beklenen yanıt:

```json
{
  "ok": true,
  "now": "2026-06-13T15:03:42.356Z",
  "env": "production",
  "region": "fra1",
  "dbConnected": true,
  "dbVersion": "PostgreSQL 17.2 on x86_64-pc-linux-musl, ..."
}
```

503 dönerse: Vercel Dashboard → Functions → Logs → `dbConnected: false` ve hata mesajını incele.

---

## 🛠 Adım 5 — Migration / şema değişikliği

Lokal:

```bash
# Schema'yı düzenle: prisma/schema.prisma
npm run db:format        # otomatik biçimlendir
npm run db:push          # değişikliği DB'ye uygula (dev)
```

Production migration için (ileride, `db:push` yerine):

```bash
npx prisma migrate dev --name add_xyz       # lokal
npx prisma migrate deploy                   # production (Vercel build içinde)
```

---

## 🔍 Adım 6 — Prisma Studio (DB explorer)

```bash
npm run db:studio
```

`http://localhost:5555` → tüm tabloları gez/düzenle.

---

## 🎯 API endpoint'leri (mevcut)

| Endpoint | Method | Açıklama |
|---|---|---|
| `/api/health`       | GET    | DB bağlantısı + Vercel info |
| `/api/transactions` | GET    | Son N işlem (default 50) |
| `/api/transactions` | POST   | Yeni işlem oluştur |
| `/api/transactions` | DELETE | `?id=…` ile sil |

---

## ⚠️ Production'a geçmeden önce yapılacaklar

Şu an **Auth YOK** — `/api/transactions` herkese açık.

1. **Auth katmanı**: Vercel Edge Middleware veya Clerk/Supabase
   - `middleware.js` dosyası ekle, `/api/*` ve `/finance/*`'a oturum kontrolü
2. **Rate limit**: Upstash Redis + `@upstash/ratelimit` 
3. **Encryption at rest**: Hassas alanlar (IBAN, kart no son 4) için `pgcrypto`
4. **Audit log**: ayrı `audit_log` tablosu, her CRUD'da satır
5. **Real categories seed**: `prisma/seed.js` ekle, `npx prisma db seed` çalıştır
6. **WhatsApp webhook**: `/api/wa/webhook.js` + Meta verification

---

## 🆘 Sorun giderme

**`Error: P1001: Can't reach database`**
- `DATABASE_URL` doğru mu? `?sslmode=require` var mı?
- Prisma Console'da bağlantı dizesi rotate edildi mi?

**`npm error notarget No matching version found for @vercel/node@X.Y.Z`**
- `vercel.json` → `functions.runtime` field'ı kaldırılmalı.
- Vercel `/api/*.js` dosyalarını otomatik Node fonksiyonu olarak yakalar.
- Node sürümü `package.json` → `engines.node: ">=20.0.0"` ile belirleniyor.
- Sadece `maxDuration` ve `memory` belirtmek yeterli.

**`prisma generate` Vercel build'de düşüyor**
- `package.json` → `engines.node >= 20` ✅ (zaten ayarlı)
- `vercel.json` → `buildCommand: "prisma generate"` ✅ (zaten ayarlı)
- `binaryTargets: ["native", "rhel-openssl-3.0.x"]` schema'da ✅

**Cold start çok yavaş (>2s)**
- Prisma Client serverless'ta ilk çağrıda yavaştır
- Çözüm: Prisma Accelerate'e geç (`PRISMA_DATABASE_URL` zaten Accelerate-ready format)
  - Console'da Accelerate'i aktif et → URL'i `prisma://...` formatına dönecek
  - `lib/prisma.js`'te `import { PrismaClient } from "@prisma/client/edge"` yap
  - `runtime: "edge"` ayarla function'da

**`.env.local` Vercel'de görünmüyor**
- `.env.local` sadece **lokal**. Production env'leri `vercel env add` ile yüklenmeli.

---

## 📁 Dizin haritası

```
.
├── api/
│   ├── health.js              ← DB health check
│   └── transactions.js        ← CRUD
├── lib/
│   └── prisma.js              ← Prisma client singleton
├── prisma/
│   └── schema.prisma          ← 8 model: User, Card, Category, Transaction,
│                                Goal, Debt, Asset, WhatsAppMessage
├── finance/                   ← static React app (CDN, no build)
├── assets/finance-launcher.js ← bottom-right login icon
├── .env.local                 ← LOCAL ONLY — gitignored
├── .env.example               ← template — committed
├── .gitignore
├── package.json               ← Prisma + scripts
└── vercel.json                ← rewrites + headers + functions config
```

---

## ✅ Kontrol listesi

- [x] `.gitignore` `.env*` koruyor
- [x] `.env.local` lokal'de mevcut (gitignored)
- [x] `.env.example` repo'da (template)
- [x] Prisma schema → DB push edildi (8 tablo)
- [x] Lokal smoke test: `prisma.$queryRaw` çalışıyor
- [x] `package.json` → `prisma generate` build script'inde
- [x] `vercel.json` → API routes config + headers
- [ ] **Vercel Dashboard'a 3 env var eklendi** (yapacaksın)
- [ ] **Credential rotate edildi** (yapacaksın)
- [ ] `git push` → Vercel build → `/api/health` 200 OK

