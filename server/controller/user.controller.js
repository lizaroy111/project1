import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../config.js"

const semesterSubjects = {
    1: ["Engineering Mathematics-I", "Engineering Physics", "Basic Electrical Engineering"],
    2: ["Engineering Mathematics-II", "Engineering Chemistry", "Universal Human Values"],
    3: ["Digital Electronics", "Web Technology", "Data Structure"],
    4: ["Database Management System", "Data Mining", "Environmental Science"],
    5: ["Computer Networks", "Machine Learning", "Formal Language"],
    6: ["Compiler Design", "Cloud Computing", "Big Data Analysis"],
    7: ["Cryptography & Network Security", "Fundamentals of Management", "Soft Computing"],
    8: ["Effective Technical Education", "Final Year Project", "Real Time Systems"]
};

// Create a new user
export const createUser = async (req, res) => {
    try {
        const { name, password, registrationNumber } = req.body;
        const oldUser = await User.findOne({ registrationNumber })

        if (oldUser) return res.status(404).send("RegNum is already used")

        const hashPass = await bcrypt.hash(password, 12)

        const newUser = new User({ name, password: hashPass, registrationNumber });
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
        // const { userId } = req.params;
        const { registrationNumber } = req.body

        const deletedUser = await User.deleteOne({ registrationNumber });

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
            { _id: user._id, registrationNumber: user.registrationNumber, password: user.password },
            env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};





export const verifyToken = async (req, res) => {
    if (!req.body.token) return res.status(404).send(false)
    const token = req.body.token
    if (!token) {
        return res.status(401).json(false);
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        const { _id } = decoded;
        const oldUser = await Admin.findOne({ _id })
        if (!oldUser) {
            return res.status(403).json(false);
        }
        return res.status(200).send(true)
    } catch (error) {
        res.status(401).json(false);
    }
}

export const verifyUser = async (req, res) => {
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
}

export const addMark = async (req, res) => {
    try {
        const { registrationNumber, semester, subjectName, mark } = req.body;

        console.log(req.body)
        const user = await User.findOne({ registrationNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (semester > 1) {
            for (let i = 1; i < semester; i++) {
                const previousSemester = user.subjects.find(s => s.sem === i);
                if (!previousSemester || previousSemester.subjects.length === 0) {
                    return res.status(400).json({
                        message: `Marks for all subjects in Semester ${i} must be filled before adding marks for Semester ${semester}`
                    });
                }

                const requiredSubjects = semesterSubjects[i];
                const filledSubjects = previousSemester.subjects.map(s => s.sub);

                const missingSubjects = requiredSubjects.filter(sub => !filledSubjects.includes(sub));

                if (missingSubjects.length > 0) {
                    return res.status(400).json({
                        message: `Missing marks for the following subjects in Semester ${i}: ${missingSubjects.join(", ")}`,
                    });
                }
            }
        }

        let semesterObj = user.subjects.find(s => s.sem === semester);
        if (!semesterObj) {
            semesterObj = { sem: semester, subjects: [{ sub: subjectName, mark }] };
            user.subjects.push(semesterObj);
        } else {
            const subjectObj = semesterObj.subjects.find(s => s.sub === subjectName);
            if (subjectObj) {
                return res.status(400).json({ message: "Subject already exists for this semester" });
            }
            semesterObj.subjects.push({ sub: subjectName, mark });
        }

        // Save the mark first
        await user.save();

        // After adding the mark, check if all subjects for the current semester are filled
        const currentSemesterSubjects = semesterSubjects[semester]; // Get the required subjects for this semester
        const filledSubjectsForSem = semesterObj.subjects.map(s => s.sub); // Get all filled subjects

        // Check if all required subjects have been filled
        const allSubjectsFilled = currentSemesterSubjects.every(sub => filledSubjectsForSem.includes(sub));

        // If all subjects for the current semester are filled, increment current_sem
        if (allSubjectsFilled && user.current_sem === semester) {
            user.current_sem += 1;
            await user.save();  // Save again to reflect the updated semester
        }

        res.status(200).json({ message: "Mark added successfully", user });
    } catch (error) {
        console.error("Error adding mark:", error);
        res.status(500).json({ message: "Error adding mark", error: error.message });
    }
};


export const updateMark = async (req, res) => {
    try {
        const { registrationNumber, semester, subjectName, mark } = req.body;

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

export const getMarks = async (req, res) => {
    try {
        const { registrationNumber } = req.user
        const { semester } = req.body;

        const user = await User.findOne({ registrationNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const semesterObj = user.subjects.find(s => s.sem === semester);
        if (!semesterObj) {
            return res.status(404).json({ message: `No marks found for Semester ${semester}` });
        }

        res.status(200).json({ semester: semesterObj.sem, subjects: semesterObj.subjects });
    } catch (error) {
        res.status(500).json({ message: "Error fetching marks", error: error.message });
    }
};


export const getSemStd = async (req, res) => {
    try {
        const { current_sem } = req.body;
        if (!current_sem) return res.status(400).send("current_sem is missing");

        // Query to find users who have subjects in the specified current_sem
        const users = await User.find(
            { current_sem }, // Find users who have this semester in their subjects array
            { name: 1, registrationNumber: 1, subjects: 1, _id: 1 } // Select only the necessary fields
        );

        if (!users.length) {
            return res.status(404).send("No students found for this semester");
        }

        const result = users.map(user => {
            // Find the semester data that matches the current semester
            const semesterData = user.subjects.find(sem => sem.sem === current_sem);

            // Determine which subjects are missing marks
            const subjectsToFill = semesterSubjects[current_sem].filter(sub => {
                return !semesterData?.subjects.some(subject => subject.sub === sub && subject.mark != null);
            });

            return {
                name: user.name,
                registrationNumber: user.registrationNumber,
                remainingSubjects: subjectsToFill,
            };
        });

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).send("Server error");
    }
};


export const decodeUser = async (req, res) => {
    if (!req.body.token) return res.status(404).send("JWT not found")
    const token = req.body.token.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: "Access denied, token missing" });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        const { _id } = decoded;
        const oldUser = await User.findOne({ _id })
        if (!oldUser) {
            return res.status(403).json({ message: "Access denied" });
        }
        return res.status(200).send(decoded)
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export const getUserData = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id) return res.status(404).send("_id not found")

        const oldUser = await User.findOne({ _id }).select('registrationNumber current_sem name')
        if (!oldUser) return res.status(404).send("User not found")

        return res.status(202).send(oldUser)
    } catch (error) {
        return res.status(404).send(error)
    }
}