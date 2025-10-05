import pool from '../db/db.js';

export const insertAnalysisMeal = async (userId, jsonData) => {
    const query = 'INSERT INTO meal_analysis (user_id, analysis_data) VALUES (?, ?)';
    const [result] = await pool.execute(query, [userId, jsonData]);
    return result.insertId;
};

export const insertRocomondation = async (userId, jsonData) => {
    const query = 'INSERT INTO meal_analysis (user_id, analysis_data) VALUES (?, ?)';
    const [result] = await pool.execute(query, [userId, jsonData]);
    return result.insertId;
};