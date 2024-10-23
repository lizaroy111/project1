import JWT from "jsonwebtoken";
import Admin from "../model/admin.model.js";
import bcrypt from "bcryptjs";
import env from "../config.js"

// Create a new admin
export const createAdmin = async (req, res) => {
    try {
        const { adminId, password } = req.body;

        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ adminId });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Create a new admin
        const newAdmin = new Admin({ adminId, password });
        await newAdmin.save();

        res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: "Error creating admin", error: error.message });
    }
};

// Update an existing admin's password
export const updateAdmin = async (req, res) => {
    try {
        const { adminId, password } = req.body;

        // Find the admin by adminId
        const admin = await Admin.findOne({ adminId });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Update the password (hash the new password)
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);
        await admin.save();

        res.status(200).json({ message: "Admin updated successfully", admin });
    } catch (error) {
        res.status(500).json({ message: "Error updating admin", error: error.message });
    }
};

// Delete an admin
export const deleteAdmin = async (req, res) => {
    try {
        const { adminId } = req.body;

        // Find and delete the admin by adminId
        const deletedAdmin = await Admin.findOneAndDelete({ adminId });
        if (!deletedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting admin", error: error.message });
    }
};


export const adminLogin = async (req, res) => {
    try {
        const { adminId, password } = req.body;
        if (!adminId || !password) {
            return res.status(400).send("Missing attributes");
        }

        const oldAdmin = await Admin.findOne({ adminId });
        if (!oldAdmin) {
            return res.status(404).send("No admin found");
        }

        const passwordMatch = await bcrypt.compare(password, oldAdmin.password);
        if (!passwordMatch) {
            return res.status(401).send("Invalid credentials");
        }

        const token = JWT.sign({ adminId, _id: oldAdmin._id, password }, env.JWT_SECRET, { expiresIn: '1h' });
        console.log(adminId)
        return res.status(200).json({ token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send("Internal Server Error");
    }
};

export const decodeAdmin = async (req, res) => {
    if (!req.body.token) return res.status(404).send("JWT not found")
    const token = req.body.token.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: "Access denied, token missing" });
    }

    try {
        const decoded = JWT.verify(token, env.JWT_SECRET);
        const { _id } = decoded;
        const oldAdmin = await Admin.findOne({ _id })
        if (!oldAdmin.isAdmin) {
            return res.status(403).json({ message: "Access denied, not an admin" });
        }
        return res.status(200).send(decoded)
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
