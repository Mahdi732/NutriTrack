import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function testDatabase() {
    try {
        console.log('Testing database connection...');
        console.log('DB_HOST:', process.env.DB_HOST);
        console.log('DB_USER:', process.env.DB_USER);
        console.log('DB_NAME:', process.env.DB_NAME);
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        
        console.log('✅ Database connection successful!');
        
        // Test if users table exists
        const [tables] = await connection.execute("SHOW TABLES LIKE 'users'");
        console.log('Users table exists:', tables.length > 0);
        
        if (tables.length > 0) {
            // Check table structure
            const [columns] = await connection.execute("DESCRIBE users");
            console.log('Users table structure:');
            columns.forEach(col => {
                console.log(`  - ${col.Field}: ${col.Type}`);
            });
        }
        
        await connection.end();
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Error code:', error.code);
    }
}

testDatabase();
