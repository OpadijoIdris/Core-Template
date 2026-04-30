import 'dotenv/config'
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

let connectionString = process.env.DATABASE_URL;

if (connectionString) {
  // Clean quotes and whitespace
  connectionString = connectionString.trim().replace(/^["'](.+)["']$/, '$1');
  
  // Some environments/poolers prefer 'postgres://' over 'postgresql://'
  if (connectionString.startsWith('postgresql://')) {
    connectionString = connectionString.replace('postgresql://', 'postgres://');
  }

  // Ensure sslmode=require if not present (common for Neon/Render)
  if (!connectionString.includes('sslmode=')) {
    connectionString += connectionString.includes('?') ? '&sslmode=require' : '?sslmode=require';
  }
}

console.log('--- [DEBUG] Initializing Prisma with URL starting with:', connectionString ? connectionString.substring(0, 15) + '...' : 'NULL');

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)

const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
