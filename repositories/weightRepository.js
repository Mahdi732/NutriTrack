import pool from '../db/db.js';

// Add weight entry
export const addWeightEntry = async (userId, weightData) => {
    try {
        const query = `
            INSERT INTO weight_tracking 
            (user_id, measurement_date, weight_kg, body_fat_percentage, muscle_mass_kg, bmi, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(query, [
            userId,
            weightData.date,
            weightData.weight,
            weightData.bodyFat || null,
            weightData.muscleMass || null,
            weightData.bmi,
            weightData.notes || null
        ]);
        
        return result.insertId;
    } catch (error) {
        console.error('Error adding weight entry:', error);
        throw error;
    }
};

// Get weight data for a period
export const getWeightData = async (userId, days = 90) => {
    try {
        const query = `
            SELECT * FROM weight_tracking 
            WHERE user_id = ? 
            AND measurement_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            ORDER BY measurement_date ASC
        `;
        
        const [rows] = await pool.execute(query, [userId, days]);
        return rows;
    } catch (error) {
        console.error('Error getting weight data:', error);
        throw error;
    }
};

// Get latest weight entry
export const getLatestWeight = async (userId) => {
    try {
        const query = `
            SELECT * FROM weight_tracking 
            WHERE user_id = ? 
            ORDER BY measurement_date DESC 
            LIMIT 1
        `;
        
        const [rows] = await pool.execute(query, [userId]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error getting latest weight:', error);
        throw error;
    }
};

// Add body measurements
export const addBodyMeasurements = async (userId, measurementData) => {
    try {
        const query = `
            INSERT INTO body_measurements 
            (user_id, measurement_date, waist_cm, chest_cm, hip_cm, arm_cm, thigh_cm) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(query, [
            userId,
            measurementData.date,
            measurementData.waist || null,
            measurementData.chest || null,
            measurementData.hip || null,
            measurementData.arm || null,
            measurementData.thigh || null
        ]);
        
        return result.insertId;
    } catch (error) {
        console.error('Error adding body measurements:', error);
        throw error;
    }
};

// Get body measurements for a period
export const getBodyMeasurements = async (userId, days = 90) => {
    try {
        const query = `
            SELECT * FROM body_measurements 
            WHERE user_id = ? 
            AND measurement_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            ORDER BY measurement_date ASC
        `;
        
        const [rows] = await pool.execute(query, [userId, days]);
        return rows;
    } catch (error) {
        console.error('Error getting body measurements:', error);
        throw error;
    }
};

// Get weight statistics
export const getWeightStatistics = async (userId, days = 90) => {
    try {
        const query = `
            SELECT 
                COUNT(*) as total_entries,
                MIN(weight_kg) as min_weight,
                MAX(weight_kg) as max_weight,
                AVG(weight_kg) as avg_weight,
                MIN(bmi) as min_bmi,
                MAX(bmi) as max_bmi,
                AVG(bmi) as avg_bmi,
                AVG(muscle_mass_kg) as avg_muscle_mass
            FROM weight_tracking 
            WHERE user_id = ? 
            AND measurement_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        `;
        
        const [rows] = await pool.execute(query, [userId, days]);
        return rows[0];
    } catch (error) {
        console.error('Error getting weight statistics:', error);
        throw error;
    }
};
