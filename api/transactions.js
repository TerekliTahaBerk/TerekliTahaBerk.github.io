/* ============================================================
   api/transactions.js — CRUD entrypoint
   ------------------------------------------------------------
   GET    /api/transactions       → list (limit query, default 50)
   POST   /api/transactions       → create
   DELETE /api/transactions?id=…  → delete by id

   ⚠️ Auth: this endpoint is currently UNGUARDED.
   Before going live add:
     - Cookie/JWT session check
     - Single-user gate (only Taha's userId)
     - Rate limiting
   See lib/auth.js (to be implemented).
============================================================ */
import prisma from "../lib/prisma.js";

// TEMP — until real auth lands. Replace with session lookup.
const DEFAULT_USER_EMAIL = "terekli@tahaberk.com";

async function getOrCreateUser() {
  const u = await prisma.user.upsert({
    where:  { email: DEFAULT_USER_EMAIL },
    update: {},
    create: { email: DEFAULT_USER_EMAIL, name: "Taha" },
  });
  return u;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  try {
    const user = await getOrCreateUser();

    if (req.method === "GET") {
      const limit = Math.min(parseInt(req.query.limit, 10) || 50, 500);
      const rows = await prisma.transaction.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
        take: limit,
        include: { card: true, category: true },
      });
      return res.status(200).json({ ok: true, count: rows.length, rows });
    }

    if (req.method === "POST") {
      const b = req.body || {};
      const tx = await prisma.transaction.create({
        data: {
          userId:   user.id,
          date:     b.date ? new Date(b.date) : new Date(),
          merchant: String(b.merchant || "").slice(0, 200),
          amount:   Number(b.amount) || 0,
          note:     b.note ? String(b.note).slice(0, 500) : null,
          tag:      b.tag  ? String(b.tag).slice(0, 60)   : null,
          source:   b.source || "manual",
          externalId: b.externalId || null,
          rawPayload: b.rawPayload || null,
          // cardId / categoryId may be null — wire when UI sends them
          cardId:     b.cardId     || null,
          categoryId: b.categoryId || null,
        },
      });
      return res.status(201).json({ ok: true, tx });
    }

    if (req.method === "DELETE") {
      const id = req.query.id;
      if (!id) return res.status(400).json({ ok: false, error: "id required" });
      await prisma.transaction.delete({ where: { id: String(id) } });
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  } catch (err) {
    console.error("[api/transactions]", err);
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}
