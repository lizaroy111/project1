import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

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
