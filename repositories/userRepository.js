import pool from "../db/db.js";

export const createUser = async (email, hashedPassword, name) => {
  const [result] = await pool.execute(
    "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
    [email, hashedPassword, name]
  );
  return result.insertId;
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await pool.execute(
    "SELECT id, email, name FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
};
