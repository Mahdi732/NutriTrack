import pool from '../db/db.js';

// Get meal analysis data for medical tracking
export const getMealAnalysisForPeriod = async (userId, days = 7) => {
    try {
        const query = `
            SELECT analysis_data, created_at 
            FROM meal_analysis 
            WHERE user_id = ? 
            AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            ORDER BY created_at DESC
        `;
        
        const [rows] = await pool.execute(query, [userId, days]);
        return rows;
    } catch (error) {
        console.error('Error getting meal analysis data:', error);
        throw error;
    }
};

// Get user profile with pathology information
export const getUserProfile = async (userId) => {
    try {
        const query = `
            SELECT type_pathologie, objectif, poids_actuel_kg, poids_cible_kg 
            FROM profiles 
            WHERE user_id = ?
        `;
        
        const [rows] = await pool.execute(query, [userId]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

// Save weekly report data
export const saveWeeklyReport = async (userId, reportData) => {
    try {
        const query = 'INSERT INTO weekly_reports (user_id, report_data) VALUES (?, ?)';
        const [result] = await pool.execute(query, [userId, JSON.stringify(reportData)]);
        return result.insertId;
    } catch (error) {
        console.error('Error saving weekly report:', error);
        throw error;
    }
};

// Get previous weekly reports
export const getPreviousReports = async (userId, limit = 5) => {
    try {
        const query = `
            SELECT id, report_data, created_at 
            FROM weekly_reports 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT ?
        `;
        
        const [rows] = await pool.execute(query, [userId, limit]);
        return rows.map(row => ({
            id: row.id,
            data: JSON.parse(row.report_data),
            createdAt: row.created_at
        }));
    } catch (error) {
        console.error('Error getting previous reports:', error);
        throw error;
    }
};

// Get meal count for a user in a specific period
export const getMealCount = async (userId, days = 7) => {
    try {
        const query = `
            SELECT COUNT(*) as meal_count 
            FROM meal_analysis 
            WHERE user_id = ? 
            AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        `;
        
        const [rows] = await pool.execute(query, [userId, days]);
        return rows[0].meal_count;
    } catch (error) {
        console.error('Error getting meal count:', error);
        throw error;
    }
};

// Get latest meal analysis for quick insights
export const getLatestMealAnalysis = async (userId, limit = 3) => {
    try {
        const query = `
            SELECT analysis_data, created_at 
            FROM meal_analysis 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT ?
        `;
        
        const [rows] = await pool.execute(query, [userId, limit]);
        return rows;
    } catch (error) {
        console.error('Error getting latest meal analysis:', error);
        throw error;
    }
};
