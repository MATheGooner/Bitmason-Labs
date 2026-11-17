import { loadEnvConfig } from "@next/env";
import { sql, eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { localProjects } from "../src/server/portfolio/local-projects";
import { projects } from "../src/server/db/schema";
import { databaseUrl } from "../src/server/env";
import { writeProject } from "../src/server/portfolio/writer";
import * as schema from "../src/server/db/schema";

async function main() {
  loadEnvConfig(process.cwd());
  const command = process.argv[2];
  if (!["check", "migrate", "seed"].includes(command ?? "")) throw new Error("Use check, migrate or seed.");
  neonConfig.webSocketConstructor = WebSocket;
  const pool = new Pool({ connectionString: databaseUrl(command === "migrate" ? "DATABASE_URL_UNPOOLED" : "DATABASE_URL"), connectionTimeoutMillis: 10000 });
  const db = drizzle({ client: pool, schema });
  try {
    if (command === "check") { await db.execute(sql`select 1`); console.log("PASS: Neon database connection."); }
    if (command === "migrate") { await migrate(db, { migrationsFolder: "./drizzle" }); console.log("PASS: Versioned migrations applied."); }
    if (command === "seed") {
      let inserted = 0, skipped = 0;
      for (const project of localProjects) {
        // Repeatable import: never overwrite publication decisions or edited data.
        const [existing] = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, project.slug));
        if (existing) { skipped++; continue; }
        await writeProject(db, project); inserted++;
      }
      console.log(`PASS: Seed import; ${inserted} inserted, ${skipped} existing records preserved.`);
    }
  } finally { await pool.end(); }
}

main().catch(() => { console.error("FAIL: Database command could not complete. Check environment configuration, connectivity and migrations; no credentials are logged."); process.exitCode = 1; });
