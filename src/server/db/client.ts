import "server-only";
import { neon, Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle as httpDrizzle } from "drizzle-orm/neon-http";
import { drizzle as socketDrizzle } from "drizzle-orm/neon-serverless";
import { databaseUrl } from "@/server/env";
import * as schema from "./schema";

/** Lazy HTTP reader. Never imported by client components. */
export function publicDatabase() {
  return httpDrizzle({ client: neon(databaseUrl(), { fetchOptions: {
    cache: "no-store",
    // A fresh deadline for every query, including when a reader is reused.
    get signal() { return AbortSignal.timeout(10_000); },
  } }), schema });
}

export type WriteDatabase = ReturnType<typeof socketDrizzle<typeof schema>>;

/** Request-scoped pool: interactive transactions and guaranteed socket cleanup. */
export async function withWriteDatabase<T>(run: (db: WriteDatabase) => Promise<T>): Promise<T> {
  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: databaseUrl(), max: 2, connectionTimeoutMillis: 10000, statement_timeout: 10000, query_timeout: 15000 });
  pool.on("error", () => console.error("Portfolio database connection interrupted."));
  try {
    return await run(socketDrizzle({ client: pool, schema }));
  } finally {
    await pool.end();
  }
}
