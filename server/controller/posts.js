import {getAllPosts,addPost,updatePost,deletePost} from '../service/posts.js';
  
  export class Post {
    // שליפה של כל הפוסטים (אופציונלית לפי user_id)
    getAll = async (req, res) => {
      try {
        const { user_id } = req.query;
        const posts = await getAllPosts(user_id);
        res.send(posts);
      } catch (err) {
        console.error('שגיאה בשליפת פוסטים:', err.message);
        res.status(500).send('שגיאה בשרת');
      }
    };
  
    // הוספת פוסט חדש
    add = async (req, res) => {
        try {
          const newPost = req.body;
      
          if (
            !newPost.title ||
            typeof newPost.title !== 'string' ||
            newPost.title.trim() === '' ||
            newPost.title.length > 150 ||
            newPost.user_id === undefined ||
            isNaN(Number(newPost.user_id)) ||
            (newPost.content !== undefined &&
              typeof newPost.content !== 'string')
          ) {
            return res.status(400).send(
              'שדות לא תקינים: חובה לשלוח title (string עד 150 תווים), user_id (number), ו-content (string אופציונלי)'
            );
          }
      
          const post = await addPost({
            ...newPost,
            title: newPost.title.trim(),
            content: newPost.content ? newPost.content.trim() : null,
            user_id: Number(newPost.user_id)
          });
      
          res.send(post);
        } catch (err) {
          console.error(' Controller addPost error:', err);
          res.status(500).send(err.message);
        }
      };
      
      
  
    // עדכון פוסט לפי id
    update = async (req, res) => {
        try {
          const { id } = req.params;
          const updatedPost = req.body;
      
          if (
            !id ||
            isNaN(Number(id)) ||
            !updatedPost.title ||
            typeof updatedPost.title !== 'string' ||
            updatedPost.title.trim() === '' ||
            updatedPost.title.length > 150 ||
            updatedPost.user_id === undefined ||
            isNaN(Number(updatedPost.user_id)) ||
            (updatedPost.content !== undefined &&
              typeof updatedPost.content !== 'string')
          ) {
            return res.status(400).send(
              'שדות לא תקינים: חובה לשלוח id תקין, title (string עד 150 תווים), user_id (number), ו-content (string אופציונלי)'
            );
          }
      
          const post = await updatePost(Number(id), {
            ...updatedPost,
            title: updatedPost.title.trim(),
            content: updatedPost.content ? updatedPost.content.trim() : null,
            user_id: Number(updatedPost.user_id)
          });
      
          res.send(post);
        } catch (err) {
          console.error(' Controller updatePost error:', err.message);
          res.status(500).send(err.message);
        }
      };
      
    // מחיקת פוסט לפי id
    deleteT = async (req, res) => {
      try {
        const { id } = req.params;
  
        if (!id || isNaN(Number(id))) {
          return res.status(400).send('ID לא חוקי');
        }
  
        await deletePost(Number(id));
        res.send({ message: 'הפוסט נמחק בהצלחה' });
      } catch (err) {
        console.error('שגיאה במחיקת פוסט:', err.message);
        res.status(500).send('שגיאה בשרת');
      }
    };
  }
  