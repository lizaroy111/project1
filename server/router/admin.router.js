import express from "express";
import { createAdmin, updateAdmin, deleteAdmin,adminLogin,decodeAdmin } from "../controller/admin.controller.js";
// import { authenticateAdmin } from "../middleware/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.post("/createAdmin", createAdmin);
adminRouter.post("/adminLogin", adminLogin);
adminRouter.post("/decodeAdmin", decodeAdmin);
// adminRouter.put("/update-admin", authenticateAdmin, updateAdmin);      
// adminRouter.delete("/delete-admin", authenticateAdmin, deleteAdmin);   

export default adminRouter;
