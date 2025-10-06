import mysql from "mysql2/promise";

async function tryConnection() {
    const connectionOptions = [
        { host: 'localhost', user: 'root', password: '' },
        { host: 'localhost', user: 'root', password: 'root' },
        { host: 'localhost', user: 'root', password: 'password' },
        { host: '127.0.0.1', user: 'root', password: '' },
    ];
    
    for (let i = 0; i < connectionOptions.length; i++) {
        const options = connectionOptions[i];
        console.log(`\nTrying connection ${i + 1}: ${options.user}@${options.host} with password: ${options.password ? '***' : '(empty)'}`);
        
        try {
            const connection = await mysql.createConnection(options);
            console.log('✅ Connection successful!');
            
            // Create database
            await connection.execute('CREATE DATABASE IF NOT EXISTS nutrition_app');
            console.log('✅ Database created');
            
            // Use database
            await connection.execute('USE nutrition_app');
            
            // Create users table
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    full_name VARCHAR(100) NOT NULL,
                    email VARCHAR(150) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ Users table created');
            
            await connection.end();
            
            console.log(`\n🎉 SUCCESS! Use these settings in your .env file:`);
            console.log(`DB_HOST=${options.host}`);
            console.log(`DB_USER=${options.user}`);
            console.log(`DB_PASSWORD=${options.password}`);
            console.log(`DB_NAME=nutrition_app`);
            
            return true;
            
        } catch (error) {
            console.log(`❌ Failed: ${error.message}`);
        }
    }
    
    console.log('\n❌ All connection attempts failed.');
    console.log('\n💡 Solutions:');
    console.log('1. Start MySQL: sudo systemctl start mysql');
    console.log('2. Reset root password: sudo mysql_secure_installation');
    console.log('3. Or create a new user: CREATE USER \'nutritrack\'@\'localhost\' IDENTIFIED BY \'password\';');
    
    return false;
}

tryConnection();
