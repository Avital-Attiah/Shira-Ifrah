import db from './db.js';

const usersTable = 'users';
const passwordsTable = 'passwords';

// בדיקה אם משתמש קיים לפי username
export const checkUserExists = async (username) => {
  try {
    const sql = `SELECT id FROM ${usersTable} WHERE username = ?`;
    const [rows] = await db.query(sql, [username]);
    return rows.length > 0;
  } catch (err) {
    console.error(' checkUserExists failed:', err.message);
    throw err;
  }
};

export const signUpUser = async ({ username, email, password }) => {
  try {
    console.log("signUpUser קיבל:", { username, email, password });

    // שלב 1: הכנסה לטבלת users (בלי id)
    const userSql = `INSERT INTO ${usersTable} (username, email) VALUES (?, ?)`;
    const [result] = await db.query(userSql, [username, email]);

    const insertedId = result.insertId;

    // שלב 2: הכנסת סיסמה
    const passSql = `INSERT INTO ${passwordsTable} (user_id, password) VALUES (?, ?)`;
    await db.query(passSql, [insertedId, password]);

    return {
      id: insertedId,
      username,
      email
    };
  } catch (err) {
    console.error('signUpUser failed:', err.message);
    throw err;
  }
};

// התחברות משתמש לפי username + password
export const logInUser = async ({ username, password }) => {
  try {
    const sql = `
      SELECT u.id, u.username, u.email
      FROM ${usersTable} u
      JOIN ${passwordsTable} p ON u.id = p.user_id
      WHERE u.username = ? AND p.password = ?
    `;
    const [rows] = await db.query(sql, [username, password]);
    return rows[0] || null; // null אם לא נמצא
  } catch (err) {
    console.error(' logInUser failed:', err.message);
    throw err;
  }
};

export const getUserById = async (id) => {
  try {
    const sql = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  } catch (err) {
    console.error("getUserById failed:", err.message);
    throw err;
  }
};
