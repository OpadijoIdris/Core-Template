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
