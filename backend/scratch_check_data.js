import pg from 'pg';
import 'dotenv/config';

async function checkData() {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        const client = await pool.connect();
        console.log("Checking data...");

        const userCount = await client.query('SELECT COUNT(*) FROM "User"');
        console.log("Total Users:", userCount.rows[0].count);

        const productCount = await client.query('SELECT COUNT(*) FROM "Product"');
        console.log("Total Products:", productCount.rows[0].count);

        if (userCount.rows[0].count > 0) {
            const users = await client.query('SELECT email, "isVerified" FROM "User" LIMIT 5');
            console.log("Sample Users:", users.rows);
        }

        client.release();
    } catch (err) {
        console.error("Query failed:", err.message);
    } finally {
        await pool.end();
    }
}

checkData();
