import jwt from "jsonwebtoken";
import env from "../config.js"
import Admin from "../model/admin.model.js";
import User from "../model/user.model.js";

export const authenticateToken = async(req, res, next) => {
    if(!req.headers.authorization)  return res.status(404).send("Token not found")
    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: "Access denied, token missing" });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        console.log(decoded)
        const { _id } = decoded;
        const oldUser = await User.findOne({ _id })
        if(!oldUser)   return res.status(404).send("token error")
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export const authenticateAdmin = async (req, res, next) => {
    if(!req.headers.authorization)  return res.status(404).send("Token not found")
    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: "Access denied, token missing" });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        const { _id } = decoded;
        const oldAdmin = await Admin.findOne({ _id })
        if (!oldAdmin.isAdmin) {
            return res.status(403).json({ message: "Access denied, not an admin" });
        }
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

