import mongoose from "mongoose";

const subjects = [
  "Math",
  "Physics",
  "Chemistry",
  "Biology",
  "MERN",
  "MEAN",
  "Data Science",
  "Java",
  "Python",
  "React",
];

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    course: { type: String, enum: subjects, required: true },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
