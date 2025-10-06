import mysql from "mysql2/promise";

async function addSampleWeightData() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'nutrition_app'
        });
        
        console.log('Adding sample weight data...');
        
        // Sample weight data for user ID 1 (adjust as needed)
        const weightData = [
            ['2024-09-01', 75.0, 18.5, 57.5, 24.5, 'Starting weight'],
            ['2024-09-08', 74.5, 18.2, 57.6, 24.3, 'First week progress'],
            ['2024-09-15', 74.2, 18.0, 57.8, 24.2, 'Steady progress'],
            ['2024-09-22', 73.8, 17.8, 58.0, 24.0, 'Good week'],
            ['2024-09-29', 73.5, 17.5, 58.1, 23.9, 'Consistent loss'],
            ['2024-10-06', 72.5, 17.2, 58.2, 23.4, 'Great progress!']
        ];
        
        for (const data of weightData) {
            await connection.execute(
                'INSERT INTO weight_tracking (user_id, measurement_date, weight_kg, body_fat_percentage, muscle_mass_kg, bmi, notes) VALUES (1, ?, ?, ?, ?, ?, ?)',
                data
            );
        }
        
        console.log('✅ Sample weight data added');
        
        // Sample body measurements
        const bodyMeasurements = [
            ['2024-09-01', 85.0, 98.0, 95.0, 32.0, 58.0],
            ['2024-09-15', 84.2, 97.5, 94.5, 31.8, 57.5],
            ['2024-10-01', 83.5, 97.0, 94.0, 31.5, 57.2],
            ['2024-10-06', 83.0, 96.5, 93.5, 31.2, 57.0]
        ];
        
        for (const data of bodyMeasurements) {
            await connection.execute(
                'INSERT INTO body_measurements (user_id, measurement_date, waist_cm, chest_cm, hip_cm, arm_cm, thigh_cm) VALUES (1, ?, ?, ?, ?, ?, ?)',
                data
            );
        }
        
        console.log('✅ Sample body measurements added');
        
        await connection.end();
        console.log('✅ Weight sample data setup completed!');
        
    } catch (error) {
        console.error('❌ Error adding weight sample data:', error);
    }
}

addSampleWeightData();
