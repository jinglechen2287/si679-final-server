import express from "express";
import { userControllers } from "../controllers/userControllers";
import { validateJWT } from "../middleware/validateJWT";

const userRouter = express.Router();

userRouter.get("/", validateJWT, userControllers.getAllUsers);
userRouter.get("/:id", validateJWT, userControllers.getUserById);
userRouter.post("/login", userControllers.login);
userRouter.post("/register", userControllers.addUser);
userRouter.patch("/:id", validateJWT, userControllers.updateUser);
userRouter.delete("/:id", validateJWT, userControllers.deleteUser);

export { userRouter };
