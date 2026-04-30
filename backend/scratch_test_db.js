import pg from 'pg';
import 'dotenv/config';

async function testConnection() {
    console.log("Testing connection to:", process.env.DATABASE_URL.replace(/:[^:@]+@/, ":****@"));
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        const client = await pool.connect();
        console.log("Successfully connected to the database!");
        const res = await client.query('SELECT NOW()');
        console.log("Current time from DB:", res.rows[0]);
        client.release();
    } catch (err) {
        console.error("Connection failed:", err.message);
        console.error("Full error:", err);
    } finally {
        await pool.end();
    }
}

testConnection();
