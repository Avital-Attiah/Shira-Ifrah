
import {getTodoById,addTodo,updateTodo,deleteTodo,} from '../service/todos.js';


export class Todo {
  getTodoById = async (req, res) => {
    try {
      console.log('getAll method called');
      const { user_id } = req.params;

      if (!user_id || isNaN(Number(user_id))) {
        return res
          .status(400)
          .send('חובה לשלוח user_id כפרמטר מספרי בשורת הכתובת');
      }

      const todos = await getTodoById(Number(user_id));
      res.send(todos);
    } catch (err) {
      console.error('שגיאה:', err.message);
      res.status(500).send(err.message);
    }
  };

  add = async (req, res) => {
    try {
      const newTodo = req.body;

      if (
        !newTodo.title ||
        typeof newTodo.title !== 'string' ||
        newTodo.title.trim() === '' ||
        newTodo.user_id === undefined ||
        isNaN(Number(newTodo.user_id)) ||
        (newTodo.completed !== undefined &&
          typeof newTodo.completed !== 'boolean')
      ) {
        return res.status(400).send(
          'שדות לא תקינים: חובה לשלוח title (string), user_id (number), ו-completed (boolean אופציונלי)'
        );
      }

      const todo = await addTodo({
        ...newTodo,
        user_id: Number(newTodo.user_id),
      });

      res.send(todo);
    } catch (err) {
      console.error(' Controller addTodo error:', err);   //  הדפסת השגיאה המלאה
      res.status(500).send(err.message);                   // שולח לשולחן העבודה את הטקסט המלא
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTodo = req.body;
  
      if (
        !id ||
        isNaN(Number(id)) ||
        !updatedTodo.title ||
        typeof updatedTodo.title !== 'string' ||
        updatedTodo.title.trim() === '' ||
        updatedTodo.user_id === undefined ||
        isNaN(Number(updatedTodo.user_id)) ||
        (updatedTodo.completed !== undefined &&
          typeof updatedTodo.completed !== 'boolean')
      ) {
        return res.status(400).send(
          'שדות לא תקינים: חובה לשלוח id תקין, title (string), user_id (number), ו-completed (boolean אופציונלי)'
        );
      }
  
      const todo = await updateTodo(Number(id), {
        ...updatedTodo,
        title: updatedTodo.title.trim(),
        user_id: Number(updatedTodo.user_id)
      });
  
      res.send(todo);
    } catch (err) {
      console.error('שגיאה:', err.message);
      res.status(500).send(err.message);
    }
  };
  

  deleteT = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).send('ID לא חוקי');
      }

      await deleteTodo(Number(id));
      res.send({ message: 'Todo נמחק בהצלחה' });
    } catch (err) {
      console.error('שגיאה:', err.message);
      res.status(500).send(err.message);
    }
  };
}
