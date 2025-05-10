import express from "express";
import UserController from "../controller/users.js";

const userRouter = express.Router();
const userController = new UserController();
userRouter.post("/signUp", userController.signUp);
userRouter.post("/logIn", userController.logIn);
userRouter.post("/check", userController.check);
userRouter.get("/:id", userController.getById); //for get info
export { userRouter };
