import express from "express";
import { createAdmin, updateAdmin, deleteAdmin,adminLogin } from "../controller/admin.controller.js";
// import { authenticateAdmin } from "../middleware/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.post("/createAdmin", createAdmin);
adminRouter.post("/adminLogin", adminLogin);
// adminRouter.put("/update-admin", authenticateAdmin, updateAdmin);      
// adminRouter.delete("/delete-admin", authenticateAdmin, deleteAdmin);   

export default adminRouter;
