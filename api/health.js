/* ============================================================
   api/health.js — DB + runtime health check
   ------------------------------------------------------------
   GET /api/health → { ok, now, env, dbConnected }
   Use for a quick "is everything wired?" sanity test.
   Returns 503 if DB is unreachable.
============================================================ */
import prisma from "../lib/prisma.js";

export default async function handler(req, res) {
  // CORS for browser checks
  res.setHeader("Cache-Control", "no-store");

  const out = {
    ok: false,
    now: new Date().toISOString(),
    env: process.env.NODE_ENV || "unknown",
    region: process.env.VERCEL_REGION || "local",
    deploymentUrl: process.env.VERCEL_URL || "local",
    dbConnected: false,
    dbVersion: null,
    error: null,
  };

  try {
    const rows = await prisma.$queryRaw`SELECT version() AS version, NOW() AS now`;
    out.ok = true;
    out.dbConnected = true;
    out.dbVersion = rows[0]?.version ?? null;
    out.dbNow = rows[0]?.now ?? null;
    return res.status(200).json(out);
  } catch (err) {
    out.error = String(err?.message || err);
    return res.status(503).json(out);
  }
}
