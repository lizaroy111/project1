import express from "express";
import { createUser, getMarks, deleteUser, addMark, loginUser } from "../controller/user.controller.js"
import { authenticateToken, authenticateAdmin } from "../middleware/authController.js";

const UserRouter = express.Router();

UserRouter.post("/createUser", authenticateAdmin, createUser);
UserRouter.post("/loginUser", loginUser);
UserRouter.post("/addMark", authenticateAdmin, addMark);
UserRouter.delete("/deleteUser", authenticateAdmin, deleteUser);

UserRouter.get("/getMarks", authenticateToken, getMarks);


export default UserRouter;