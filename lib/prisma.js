/* ============================================================
   lib/prisma.js — Prisma client singleton
   ------------------------------------------------------------
   On Vercel serverless, each invocation can spawn a new client
   if you're not careful. This singleton + global cache pattern
   keeps things sane in dev (HMR) and prod (warm lambdas).
============================================================ */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__tbtPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__tbtPrisma = prisma;
}

export default prisma;
