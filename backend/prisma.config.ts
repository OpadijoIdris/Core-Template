import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});


// ==> Cloning from https://github.com/OpadijoIdris/Core-Template
// ==> Checking out commit a7e48f1bb06be5c38748c57be2987604d2176326 in branch main
// ==> Using Node.js version 22.22.0 (default)
// ==> Docs on specifying a Node.js version: https://render.com/docs/node-version
// ==> Running build command 'npm install && npx prisma generate && npx prisma db seed'...
// > templatestore-backend@1.0.0 postinstall
// > prisma generate
// Loaded Prisma config from prisma.config.ts.
// Prisma schema loaded from prisma/schema.prisma.
// ✔ Generated Prisma Client (v7.2.0) to ./node_modules/@prisma/client in 104ms
// Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
// Tip: Interested in query caching in just a few lines of code? Try Accelerate today! https://pris.ly/tip-3-accelerate
// added 311 packages, and audited 312 packages in 8s
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
// ┌─────────────────────────────────────────────────────────┐
// │  Update available 7.2.0 -> 7.8.0                        │
// │  Run the following to update                            │
// │    npm i --save-dev prisma@latest                       │
// │    npm i @prisma/client@latest                          │
// └─────────────────────────────────────────────────────────┘
// ✔ Generated Prisma Client (v7.2.0) to ./node_modules/@prisma/client in 195ms
// Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)
// Tip: Need your database queries to be 1000x faster? Accelerate offers you that and more: https://pris.ly/tip-2-accelerate
// Loaded Prisma config from prisma.config.ts.
// Running seed command `node prisma/seed.js` ...
// --- [DEBUG] Seed Script Started ---
// --- [DEBUG] DATABASE_URL exists: true
// --- [DEBUG] Cleaning Message... ---
// (node:223) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
// --- [DEBUG] Error clearing tables:
// In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.
// Invalid `prisma.message.deleteMany()` invocation:
// Can't reach database server at base
// To prepare for this change:
// - If you want the current behavior, explicitly use 'sslmode=verify-full'
// --- [DEBUG] Creating Users... ---
// - If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'
// See https://www.postgresql.org/docs/current/libpq-ssl.html for libpq SSL mode definitions.
// (Use `node --trace-warnings ...` to show where the warning was created)
// --- [CRITICAL ERROR DURING SEEDING] ---
// Message:
// Invalid `prisma.user.create()` invocation:
// Can't reach database server at base
// Stack: PrismaClientKnownRequestError:
// Invalid `prisma.user.create()` invocation:
// Can't reach database server at base
//     at qr.handleRequestError (/opt/render/project/src/backend/node_modules/@prisma/client/runtime/client.js:65:8172)
//     at qr.handleAndLogRequestError (/opt/render/project/src/backend/node_modules/@prisma/client/runtime/client.js:65:7467)
//     at qr.request (/opt/render/project/src/backend/node_modules/@prisma/client/runtime/client.js:65:7174)
//     at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
//     at async a (/opt/render/project/src/backend/node_modules/@prisma/client/runtime/client.js:75:5816)
//     at async main (file:///opt/render/project/src/backend/prisma/seed.js:44:17)
// An error occurred while running the seed command:
// Error: Command failed with exit code 1: node prisma/seed.js
// ==> Build failed 😞
// ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys