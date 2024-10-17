import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
    sub: {
        type: String,
        required: [true, "Subject name is required"]
    },
    mark: {
        type: Number,
        required: [true, "Mark is required"]
    }
});

const SemesterSchema = new mongoose.Schema({
    sem: {
        type: Number,
        required: [true, "Semester is required"]
    },
    subjects: {
        type: [SubjectSchema],
        default: []
    }
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    registrationNumber: {
        type: String,
        required: [true, "Registration number is required"],
        unique: true
    },
    subjects: {
        type: [SemesterSchema],
        default: []
    }
});

export default mongoose.model('User', UserSchema);
