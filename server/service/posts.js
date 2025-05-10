import db from './db.js';

const table = 'posts';

// שליפה של כל הפוסטים, או של פוסטים לפי user_id
export const getAllPosts = async (userId) => {
  try {
    let sql = `SELECT * FROM ${table}`;
    const params = [];

    if (userId) {
      sql += ` WHERE user_id = ?`;
      params.push(userId);
    }

    sql += ' ORDER BY id';

    const [rows] = await db.query(sql, params);
    return rows;
  } catch (err) {
    console.error(' getAllPosts failed:', err.message);
    return [];
  }
};

// הוספת פוסט חדש
export const addPost = async ({ title, content, user_id }) => {
  try {
    const sql = `INSERT INTO ${table} (title, content, user_id) VALUES (?, ?, ?)`;
    const values = [title, content, user_id];

    const [result] = await db.query(sql, values);

    return {
      id: result.insertId,
      title,
      content,
      user_id
    };
  } catch (err) {
    console.error(' addPost failed:', err.message);
    throw err;
  }
};

// עדכון פוסט קיים לפי ID
export const updatePost = async (id, { title, content, user_id }) => {
  try {
    const sql = `UPDATE ${table} SET title = ?, content = ?, user_id = ? WHERE id = ?`;
    const values = [title, content, user_id, id];

    await db.query(sql, values);

    return {
      id,
      title,
      content,
      user_id
    };
  } catch (err) {
    console.error(' updatePost failed:', err.message);
    throw err;
  }
};

// מחיקת פוסט לפי ID
export const deletePost = async (id) => {
  try {
    const sql = `DELETE FROM ${table} WHERE id = ?`;
    await db.query(sql, [id]);
  } catch (err) {
    console.error(' deletePost failed:', err.message);
    throw err;
  }
};
