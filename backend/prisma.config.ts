import "dotenv/config";
import { defineConfig } from "prisma/config";

let url = process.env.DATABASE_URL || "";
if (url) {
  url = url.trim().replace(/^["'](.+)["']$/, '$1');
  if (url.startsWith('postgresql://')) {
    url = url.replace('postgresql://', 'postgres://');
  }
  if (!url.includes('sslmode=')) {
    url += url.includes('?') ? '&sslmode=require' : '?sslmode=require';
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    url: url,
  },
});



// Loaded Prisma config from prisma.config.ts.
// Prisma schema loaded from prisma/schema.prisma.
// ✔ Generated Prisma Client (v7.2.0) to ./node_modules/@prisma/client in 223ms
// Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
// Tip: Need your database queries to be 1000x faster? Accelerate offers you that and more: https://pris.ly/tip-2-accelerate
// added 311 packages, and audited 312 packages in 11s
// 46 packages are looking for funding
//   run `npm fund` for details
// 18 vulnerabilities (8 moderate, 10 high)
// To address issues that do not require attention, run:
//   npm audit fix
// To address all issues (including breaking changes), run:
//   npm audit fix --force
// Run `npm audit` for details.
// Loaded Prisma config from prisma.config.ts.
// Prisma schema loaded from prisma/schema.prisma.
// ✔ Generated Prisma Client (v7.2.0) to ./node_modules/@prisma/client in 313ms
// Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
// Tip: Interested in query caching in just a few lines of code? Try Accelerate today! https://pris.ly/tip-3-accelerate
// Loaded Prisma config from prisma.config.ts.
// Running seed command `node prisma/seed.js` ...
// --- [DEBUG] Initializing Prisma with URL starting with: postgres://neon...
// --- [DEBUG] Seed Script Started ---
// --- [DEBUG] DATABASE_URL Length: 152
// --- [DEBUG] DB Hostname: ep-summer-union-alf2vkj4-pooler.c-3.eu-central-1.aws.neon.tech
// --- [DEBUG] Upserting Admin User... ---
// (node:210) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
// In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.
// To prepare for this change:
// - If you want the current behavior, explicitly use 'sslmode=verify-full'
// - If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'
// See https://www.postgresql.org/docs/current/libpq-ssl.html for libpq SSL mode definitions.
// (Use `node --trace-warnings ...` to show where the warning was created)
// Admin user upserted: admin@example.com
// --- [DEBUG] Cleaning Other Tables... ---
// Other data cleared.
// Menu
// Customers created.
// Categories created.
// Products created.
// --- Seeding Completed Successfully! ---
// 🌱  The seed command has been executed.
// ==> Uploading build...
// ==> Uploaded in 5.6s. Compression took 4.1s
// ==> Build successful 🎉
// ==> Deploying...
// ==> Setting WEB_CONCURRENCY=1 by default, based on available CPUs in the instance
// ==> Running 'node src/server.js'
// --- [DEBUG] Initializing Prisma with URL starting with: postgres://neon...
// --- [DEBUG] Redis URL is still not a valid URL format after cleaning
// [dotenv@17.3.1] injecting env (0) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Connected to MongoDB
// Server is running on PORT 10000
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// HEAD / 200 2.689 ms - 98
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// Redis connection error: connect ENOENT %20rediss://default:gQAAAAAAAbSBAAIgcDFiMTM4MjI1ZmRkYmI0YjFiYjIwMDQ5NjYzNjVmMmU%20%20%20%20%204YQ@tidy-gobbler-111745.upstash.io:6379
// ==> Your service is live 🎉
// ==>
// ==> ///////////////////////////////////////////////////////////
// ==>
// ==> Available at your primary URL https://core-template.onrender.com
// ==>
// ==> ///////////////////////////////////////////////////////////