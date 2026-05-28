import pkg from 'pg';
const { Client } = pkg;
import 'dotenv/config';

async function checkData() {
  let connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    connectionString = connectionString.trim().replace(/^["'](.+)["']$/, '$1');
    if (connectionString.startsWith('postgresql://')) {
      connectionString = connectionString.replace('postgresql://', 'postgres://');
    }
    if (!connectionString.includes('sslmode=')) {
      connectionString += connectionString.includes('?') ? '&sslmode=require' : '?sslmode=require';
    }
  }

  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to database.');

    const res = await client.query('SELECT id, email, role, "isVerified" FROM "User" WHERE email = $1', ['admin@example.com']);
    
    if (res.rows.length > 0) {
      console.log('Admin user found:', res.rows[0]);
    } else {
      console.log('Admin user NOT found.');
      const allUsers = await client.query('SELECT count(*) FROM "User"');
      console.log('Total user count:', allUsers.rows[0].count);
    }
  } catch (err) {
    console.error('Query failed:', err.message);
  } finally {
    await client.end();
  }
}

checkData();
