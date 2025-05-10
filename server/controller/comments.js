import {
    getAllComments,
    addComment,
    updateComment,
    deleteComment
  } from '../service/comments.js';
  
  export class Comment {
    // שליפה של תגובות, אפשר לפי post_id
    getAll = async (req, res) => {
        try {
          const { post_id } = req.query;
      
          // ולידציה: חובה לשלוח post_id חוקי
          if (!post_id || isNaN(Number(post_id))) {
            return res.status(400).send('חובה לשלוח post_id חוקי כפרמטר בשורת הכתובת');
          }
      
          const comments = await getAllComments(Number(post_id));
          res.send(comments);
        } catch (err) {
          console.error('שגיאה בשליפת תגובות:', err.message);
          res.status(500).send('שגיאה בשרת');
        }
      };
      
  
    // הוספת תגובה חדשה
    add = async (req, res) => {
      try {
        const newComment = req.body;
  
        if (
          !newComment.post_id || isNaN(Number(newComment.post_id)) ||
          !newComment.user_id || isNaN(Number(newComment.user_id)) ||
          !newComment.content || typeof newComment.content !== 'string' || newComment.content.trim() === ''
        ) {
          return res.status(400).send(
            'שדות לא תקינים: חובה לשלוח post_id (number), user_id (number), ו-content (string לא ריק)'
          );
        }
  
        const comment = await addComment({
          post_id: Number(newComment.post_id),
          user_id: Number(newComment.user_id),
          content: newComment.content.trim()
        });
  
        res.send(comment);
      } catch (err) {
        console.error('שגיאה בהוספת תגובה:', err.message);
        res.status(500).send('שגיאה בשרת');
      }
    };
  
    // עדכון תגובה
    update = async (req, res) => {
      try {
        const { id } = req.params;
        const updatedComment = req.body;
  
        if (
          !id || isNaN(Number(id)) ||
          !updatedComment.post_id || isNaN(Number(updatedComment.post_id)) ||
          !updatedComment.user_id || isNaN(Number(updatedComment.user_id)) ||
          !updatedComment.content || typeof updatedComment.content !== 'string' || updatedComment.content.trim() === ''
        ) {
          return res.status(400).send(
            'שדות לא תקינים: חובה לשלוח id, post_id, user_id, ו-content תקינים'
          );
        }
  
        const comment = await updateComment(Number(id), {
          post_id: Number(updatedComment.post_id),
          user_id: Number(updatedComment.user_id),
          content: updatedComment.content.trim()
        });
  
        res.send(comment);
      } catch (err) {
        console.error('שגיאה בעדכון תגובה:', err.message);
        res.status(500).send('שגיאה בשרת');
      }
    };
  
    // מחיקת תגובה
    deleteT = async (req, res) => {
      try {
        const { id } = req.params;
  
        if (!id || isNaN(Number(id))) {
          return res.status(400).send('ID לא חוקי');
        }
  
        await deleteComment(Number(id));
        res.send({ message: 'התגובה נמחקה בהצלחה' });
      } catch (err) {
        console.error('שגיאה במחיקת תגובה:', err.message);
        res.status(500).send('שגיאה בשרת');
      }
    };
  }
  