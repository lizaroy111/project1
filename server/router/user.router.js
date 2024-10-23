import express from "express";
import { createUser, getMarks, deleteUser, addMark, loginUser, getSemStd, verifyToken, decodeUser,getUserData } from "../controller/user.controller.js"
import { authenticateToken, authenticateAdmin } from "../middleware/authController.js";

const UserRouter = express.Router();

UserRouter.post("/createUser", authenticateAdmin, createUser);
UserRouter.post("/loginUser", loginUser);
UserRouter.post("/addMark", authenticateAdmin, addMark);


UserRouter.post("/verifyToken", verifyToken);
UserRouter.post("/decodeUser", decodeUser);


UserRouter.delete("/deleteUser", authenticateAdmin, deleteUser);

UserRouter.post("/getMarks", authenticateToken, getMarks);

UserRouter.post("/getSemStd", authenticateAdmin, getSemStd);
UserRouter.post("/getUserData", getUserData);


export default UserRouter;