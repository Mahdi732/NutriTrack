import pool from '../db/db.js';

// Add performance data
export const addPerformanceData = async (userId, performanceData) => {
    try {
        const query = `
            INSERT INTO athlete_performance 
            (user_id, performance_date, performance_score, training_type, duration_minutes, intensity_level, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(query, [
            userId,
            performanceData.date,
            performanceData.score,
            performanceData.trainingType,
            performanceData.duration,
            performanceData.intensity,
            performanceData.notes || null
        ]);
        
        return result.insertId;
    } catch (error) {
        console.error('Error adding performance data:', error);
        throw error;
    }
};

// Get performance data for a period
export const getPerformanceData = async (userId, days = 30) => {
    try {
        const query = `
            SELECT * FROM athlete_performance 
            WHERE user_id = ? 
            AND performance_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            ORDER BY performance_date ASC
        `;
        
        const [rows] = await pool.execute(query, [userId, days]);
        return rows;
    } catch (error) {
        console.error('Error getting performance data:', error);
        throw error;
    }
};

// Add nutrition score
export const addNutritionScore = async (userId, nutritionData) => {
    try {
        const query = `
            INSERT INTO nutrition_scores 
            (user_id, score_date, protein_score, carb_score, fat_score, overall_score, calories_target, calories_actual) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(query, [
            userId,
            nutritionData.date,
            nutritionData.proteinScore,
            nutritionData.carbScore,
            nutritionData.fatScore,
            nutritionData.overallScore,
            nutritionData.caloriesTarget,
            nutritionData.caloriesActual
        ]);
        
        return result.insertId;
    } catch (error) {
        console.error('Error adding nutrition score:', error);
        throw error;
    }
};

// Get nutrition scores for a period
export const getNutritionScores = async (userId, days = 30) => {
    try {
        const query = `
            SELECT * FROM nutrition_scores 
            WHERE user_id = ? 
            AND score_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            ORDER BY score_date ASC
        `;
        
        const [rows] = await pool.execute(query, [userId, days]);
        return rows;
    } catch (error) {
        console.error('Error getting nutrition scores:', error);
        throw error;
    }
};

// Get combined performance and nutrition data
export const getPerformanceNutritionData = async (userId, days = 30) => {
    try {
        const query = `
            SELECT 
                p.performance_date as date,
                p.performance_score,
                p.training_type,
                p.duration_minutes,
                p.intensity_level,
                n.overall_score as nutrition_score,
                n.protein_score,
                n.carb_score,
                n.fat_score,
                n.calories_actual,
                n.calories_target
            FROM athlete_performance p
            LEFT JOIN nutrition_scores n ON p.user_id = n.user_id AND p.performance_date = n.score_date
            WHERE p.user_id = ? 
            AND p.performance_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            ORDER BY p.performance_date ASC
        `;
        
        const [rows] = await pool.execute(query, [userId, days]);
        return rows;
    } catch (error) {
        console.error('Error getting combined data:', error);
        throw error;
    }
};
