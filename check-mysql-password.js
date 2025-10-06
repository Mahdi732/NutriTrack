import mysql from "mysql2/promise";

async function checkMySQLAccess() {
    console.log('🔍 Checking MySQL access methods...\n');
    
    // Common passwords to try
    const passwords = ['', 'root', 'password', 'mysql', '123456'];
    
    for (const pwd of passwords) {
        try {
            console.log(`Trying password: ${pwd === '' ? '(empty)' : pwd}`);
            
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: pwd
            });
            
            console.log('✅ SUCCESS! Connected to MySQL');
            console.log(`Your MySQL root password is: ${pwd === '' ? '(empty/no password)' : pwd}`);
            
            // Test creating database
            await connection.execute('CREATE DATABASE IF NOT EXISTS nutrition_app');
            console.log('✅ Can create databases');
            
            await connection.end();
            
            console.log('\n🎯 Update your .env file with:');
            console.log('DB_HOST=localhost');
            console.log('DB_USER=root');
            console.log(`DB_PASSWORD=${pwd}`);
            console.log('DB_NAME=nutrition_app');
            
            return pwd;
            
        } catch (error) {
            console.log(`❌ Failed with password "${pwd === '' ? '(empty)' : pwd}": ${error.code}`);
        }
    }
    
    console.log('\n❌ None of the common passwords worked.');
    console.log('\n💡 Try these solutions:');
    console.log('1. Reset MySQL root password:');
    console.log('   sudo mysql_secure_installation');
    console.log('\n2. Or connect as root and set a simple password:');
    console.log('   sudo mysql');
    console.log('   ALTER USER \'root\'@\'localhost\' IDENTIFIED BY \'root\';');
    console.log('   FLUSH PRIVILEGES;');
    
    return null;
}

checkMySQLAccess();
