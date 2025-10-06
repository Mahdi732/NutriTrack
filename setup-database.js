import mysql from "mysql2/promise";

async function setupDatabase() {
    try {
        console.log('Setting up database...');
        
        // Connect without specifying database first
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456', // Your MySQL password
        });
        
        console.log('✅ Connected to MySQL');
        
        // Create database
        await connection.execute('CREATE DATABASE IF NOT EXISTS nutrition_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        console.log('✅ Database nutrition_app created');
        
        // Use the database
        await connection.execute('USE nutrition_app');
        
        // Create users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
        `);
        console.log('✅ Users table created');
        
        // Create profiles table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS profiles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL UNIQUE,
                sexe ENUM('male', 'female') NOT NULL,
                taille_cm DECIMAL(5,2) NOT NULL,
                poids_actuel_kg DECIMAL(5,2) NOT NULL,
                poids_cible_kg DECIMAL(5,2) DEFAULT NULL,
                niveau_activite ENUM('low', 'moderate', 'high') DEFAULT NULL,
                sport_discipline VARCHAR(100) DEFAULT NULL,
                duree_moyenne_min INT DEFAULT NULL,
                depense_energetique DECIMAL(8,2) DEFAULT NULL,
                objectif ENUM('weight_loss', 'muscle_gain', 'maintenance', 'performance') DEFAULT NULL,
                type_pathologie ENUM('none', 'diabetes', 'hypertension', 'obesity') DEFAULT 'none',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
        console.log('✅ Profiles table created');
        
        // Create meal_analysis table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS meal_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                analysis_data JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_meal_analysis_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
        console.log('✅ Meal analysis table created');
        
        // Create recommendations table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS recommendations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                recommendation_data JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_recommendations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
        console.log('✅ Recommendations table created');
        
        // Create weekly_reports table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS weekly_reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                report_data JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_weekly_reports_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
        console.log('✅ Weekly reports table created');
        
        await connection.end();
        console.log('✅ Database setup completed successfully!');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.error('Error code:', error.code);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n💡 Try running: mysql -u root -p');
            console.log('Then run: ALTER USER \'root\'@\'localhost\' IDENTIFIED WITH mysql_native_password BY \'\';');
            console.log('Or set a password in your .env file');
        }
    }
}

setupDatabase();
