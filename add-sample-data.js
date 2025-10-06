import mysql from "mysql2/promise";

async function addSampleData() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'nutrition_app'
        });
        
        console.log('Adding sample performance data...');
        
        // Sample performance data for user ID 1 (adjust as needed)
        const performanceData = [
            ['2024-09-25', 75, 'strength', 60, 'high', 'Good strength session'],
            ['2024-09-27', 78, 'endurance', 90, 'moderate', 'Long run, felt good'],
            ['2024-09-29', 82, 'mixed', 75, 'high', 'CrossFit workout'],
            ['2024-10-01', 85, 'strength', 65, 'high', 'Personal best on deadlift'],
            ['2024-10-03', 88, 'endurance', 120, 'moderate', 'Bike ride'],
            ['2024-10-05', 90, 'mixed', 80, 'high', 'Great overall performance']
        ];
        
        for (const data of performanceData) {
            await connection.execute(
                'INSERT INTO athlete_performance (user_id, performance_date, performance_score, training_type, duration_minutes, intensity_level, notes) VALUES (1, ?, ?, ?, ?, ?, ?)',
                data
            );
        }
        
        console.log('✅ Sample performance data added');
        
        // Sample nutrition scores
        const nutritionData = [
            ['2024-09-25', 70, 75, 65, 70, 2800, 2650],
            ['2024-09-27', 75, 80, 70, 75, 2800, 2750],
            ['2024-09-29', 80, 85, 75, 80, 2800, 2820],
            ['2024-10-01', 82, 87, 78, 82, 2800, 2850],
            ['2024-10-03', 85, 90, 80, 85, 2800, 2900],
            ['2024-10-05', 87, 92, 82, 87, 2800, 2920]
        ];
        
        for (const data of nutritionData) {
            await connection.execute(
                'INSERT INTO nutrition_scores (user_id, score_date, protein_score, carb_score, fat_score, overall_score, calories_target, calories_actual) VALUES (1, ?, ?, ?, ?, ?, ?, ?)',
                data
            );
        }
        
        console.log('✅ Sample nutrition scores added');
        
        await connection.end();
        console.log('✅ Sample data setup completed!');
        
    } catch (error) {
        console.error('❌ Error adding sample data:', error);
    }
}

addSampleData();
