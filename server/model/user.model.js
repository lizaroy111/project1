import mongoose from "mongoose";

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

// Subject schema
const SubjectSchema = new mongoose.Schema({
    sub: {
        type: String,
        required: [true, "Subject name is required"],
        validate: {
            validator: function (value) {
                // Access the parent schema (SemesterSchema) to get the semester
                const semester = this.parent().sem;
                // Ensure the subject is valid for the given semester
                return semesterSubjects[semester]?.includes(value);
            },
            message: (props) => `${props.value} is not a valid subject for this semester`,
        },
    },
    mark: {
        type: Number,
        required: [true, "Mark is required"],
    },
}, { _id: false });  // Prevents _id for each subject

// Semester schema
const SemesterSchema = new mongoose.Schema({
    sem: {
        type: Number,
        required: [true, "Semester is required"],
        min: [1, "Semester must be between 1 and 8"],
        max: [8, "Semester must be between 1 and 8"],
    },
    subjects: {
        type: [SubjectSchema],
        default: [],
    },
});

// User schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    registrationNumber: {
        type: String,
        required: [true, "Registration number is required"],
        unique: true,
    },
    current_sem:{
        type:Number,
        enum:[1,2,3,4,5,6,7,8],
        default:1,
        required:true
    },
    subjects: {
        type: [SemesterSchema],
        default: [],
    },
});

export default mongoose.model("User", UserSchema);
