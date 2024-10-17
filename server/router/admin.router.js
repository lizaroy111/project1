import express from "express";
import { createAdmin, updateAdmin, deleteAdmin } from "../controllers/adminController.js";
import { authenticateAdmin } from "../middleware/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.post("/create-admin", authenticateAdmin, createAdmin);    
adminRouter.put("/update-admin", authenticateAdmin, updateAdmin);      
adminRouter.delete("/delete-admin", authenticateAdmin, deleteAdmin);   

export default adminRouter;
