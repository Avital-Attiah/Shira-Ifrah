

import express from 'express';
import { Todo } from '../controller/todos.js'; // או איך שקראת לקובץ



const todoController = new Todo(); // יצירת מופע מהמחלקה
const todoRouter = express.Router();

todoRouter.get("/getTodosById/:user_id",todoController.getTodoById);
todoRouter.post("/",todoController.add);
todoRouter.delete("/:id", todoController.deleteT);
todoRouter.put("/:id", todoController.update);




 export { todoRouter };
