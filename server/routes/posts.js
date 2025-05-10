import express from 'express';
import { Post } from '../controller/posts.js'; // או איך שקראת לקובץ



const postController = new Post(); // יצירת מופע מהמחלקה
const postRouter = express.Router();

 postRouter.get("/",postController.getAll);
postRouter.post("/",postController.add);
postRouter.delete("/:id", postController.deleteT);
postRouter.put("/:id", postController.update);




 export { postRouter };
