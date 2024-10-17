import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// Create a new user
export const createUser = async (req, res) => {
    try {
        const { name, password, registrationNumber } = req.body;
        const newUser = new User({ name, password, registrationNumber });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, password, registrationNumber, subjects } = req.body;

        // Find and update the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, password, registrationNumber, subjects },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { registrationNumber, password } = req.body;

        const user = await User.findOne({ registrationNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, registrationNumber: user.registrationNumber },
            "your_jwt_secret_key", 
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

export const addMark = async (req, res) => {
    try {
        const { registrationNumber, semester, subjectName, mark } = req.body;

        // Find the user by registration number
        const user = await User.findOne({ registrationNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the semester in the user model
        let semesterObj = user.subjects.find(s => s.sem === semester);
        if (!semesterObj) {
            // If the semester does not exist, create it
            semesterObj = { sem: semester, subjects: [] };
            user.subjects.push(semesterObj);
        }

        // Add the subject to the semester
        semesterObj.subjects.push({ sub: subjectName, mark });
        await user.save();

        res.status(200).json({ message: "Mark added successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error adding mark", error: error.message });
    }
};

// Update a mark for a student's subject
export const updateMark = async (req, res) => {
    try {
        const { registrationNumber, semester, subjectName, mark } = req.body;

        // Find the user by registration number
        const user = await User.findOne({ registrationNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the semester in the user model
        const semesterObj = user.subjects.find(s => s.sem === semester);
        if (!semesterObj) {
            return res.status(404).json({ message: "Semester not found" });
        }

        // Find the subject in the semester
        const subjectObj = semesterObj.subjects.find(sub => sub.sub === subjectName);
        if (!subjectObj) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Update the mark
        subjectObj.mark = mark;
        await user.save();

        res.status(200).json({ message: "Mark updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating mark", error: error.message });
    }
};

export const deleteSubject = async (req, res) => {
    try {
        const { registrationNumber, semester, subjectName } = req.body;

        const user = await User.findOne({ registrationNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const semesterObj = user.subjects.find(s => s.sem === semester);
        if (!semesterObj) {
            return res.status(404).json({ message: "Semester not found" });
        }

        const subjectIndex = semesterObj.subjects.findIndex(sub => sub.sub === subjectName);
        if (subjectIndex === -1) {
            return res.status(404).json({ message: "Subject not found" });
        }

        semesterObj.subjects.splice(subjectIndex, 1);
        await user.save();

        res.status(200).json({ message: "Subject deleted successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error deleting subject", error: error.message });
    }
};