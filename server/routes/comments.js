import express from 'express';
import { Comment } from '../controller/comments.js'; // או איך שקראת לקובץ



const commentController = new Comment(); // יצירת מופע מהמחלקה
const commentRouter = express.Router();

commentRouter.get("/",commentController.getAll);
commentRouter.post("/",commentController.add);
commentRouter.delete("/:id", commentController.deleteT);
commentRouter.put("/:id", commentController.update);




 export { commentRouter };