import express from "express";
import { createUser, updateUser, deleteUser } from "../controllers/userController.js";
import { loginUser } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const UserRouter = express.Router();

UserRouter.post("/users", createUser);                 
UserRouter.post("/login", loginUser);                  
UserRouter.put("/users/:userId", authenticateToken, updateUser); 
UserRouter.delete("/users/:userId", authenticateToken, deleteUser); 


UserRouter.post("/add-mark", authenticateAdmin, addMark);
UserRouter.put("/update-mark", authenticateAdmin, updateMark);    
UserRouter.delete("/delete-subject", authenticateAdmin, deleteSubject);

export default UserRouter;