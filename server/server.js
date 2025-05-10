// server.js
import express from 'express';
import cors from 'cors';
import { todoRouter } from './routes/todos.js';  // ייבוא ה־named export
import { postRouter } from './routes/posts.js';  // ייבוא ה־named export
import { commentRouter } from './routes/comments.js';  // ייבוא ה־named export
import { userRouter } from './routes/users.js';
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/todos", todoRouter); // הוספת ה־router לנתיב /todos
app.use("/posts", postRouter); // הוספת ה־router לנתיב /todos
app.use("/comments", commentRouter); // הוספת ה־router לנתיב /todos
app.use("/users", userRouter); // הוספת ה־router לנתיב /todos

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
