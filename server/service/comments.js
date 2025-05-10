import db from './db.js';

const table = 'comments';

// שליפת כל התגובות לפי post_id בלבד
export const getAllComments = async (postId) => {
  try {
    if (!postId || isNaN(Number(postId))) {
      throw new Error('post_id is required and must be a valid number');
    }

    const sql = `SELECT * FROM ${table} WHERE post_id = ? ORDER BY id`;
    const [rows] = await db.query(sql, [postId]);
    return rows;
  } catch (err) {
    console.error(' getAllComments failed:', err.message);
    return [];
  }
};

// הוספת תגובה חדשה
export const addComment = async ({ post_id, user_id, content }) => {
  try {
    const sql = `INSERT INTO ${table} (post_id, user_id, content) VALUES (?, ?, ?)`;
    const values = [post_id, user_id, content];

    const [result] = await db.query(sql, values);

    return {
      id: result.insertId,
      post_id,
      user_id,
      content
    };
  } catch (err) {
    console.error(' addComment failed:', err.message);
    throw err;
  }
};

// עדכון תגובה קיימת
export const updateComment = async (id, { post_id, user_id, content }) => {
  try {
    const sql = `UPDATE ${table} SET post_id = ?, user_id = ?, content = ? WHERE id = ?`;
    const values = [post_id, user_id, content, id];

    await db.query(sql, values);

    return {
      id,
      post_id,
      user_id,
      content
    };
  } catch (err) {
    console.error(' updateComment failed:', err.message);
    throw err;
  }
};

// מחיקת תגובה
export const deleteComment = async (id) => {
  try {
    const sql = `DELETE FROM ${table} WHERE id = ?`;
    await db.query(sql, [id]);
  } catch (err) {
    console.error(' deleteComment failed:', err.message);
    throw err;
  }
};
