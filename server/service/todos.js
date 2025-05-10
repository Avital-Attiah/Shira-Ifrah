import db from './db.js'; // promisePool

const table = 'todos';

// שליפה לפי user_id
export const getTodoById = async (userId) => {
  try {
    const sql = `SELECT * FROM \`${table}\` WHERE user_id = ?`;
    const [rows] = await db.query(sql, [userId]);
    return rows;
  } catch (err) {
    console.error(' getTodoById failed:', err.message);
    return [];
  }
};

// הוספת מטלה
export const addTodo = async ({ user_id, title, completed }) => {
  try {
    const sql = `INSERT INTO ${table} (user_id, title, completed) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [user_id, title, completed]);

    return {
      id: result.insertId,
      user_id,
      title,
      completed
    };
  } catch (err) {
    console.error(' addTodo failed:', err.message);
    throw err;
  }
};

// עדכון מטלה
export const updateTodo = async (id, { title, completed }) => {
  try {
    const sql = `UPDATE ${table} SET title = ?, completed = ? WHERE id = ?`;
    await db.query(sql, [title, completed, id]);

    return {
      id,
      title,
      completed
    };
  } catch (err) {
    console.error(' updateTodo failed:', err.message);
    throw err;
  }
};

// מחיקת מטלה
export const deleteTodo = async (id) => {
  try {
    const sql = `DELETE FROM ${table} WHERE id = ?`;
    await db.query(sql, [id]);
  } catch (err) {
    console.error(' deleteTodo failed:', err.message);
    throw err;
  }
};
