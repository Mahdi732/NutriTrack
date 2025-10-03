import pool from '../db/db.js';

export const createUser = async (data) => {
    const query = `
    INSERT INTO (full_name, email, password) VALUES
    (?, ?, ?)`;
    const [result] = await pool.execute(query, [data.full_name, data.email, data.hashedPassword])
    return result.insertId;
}