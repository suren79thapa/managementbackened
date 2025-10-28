import express from "express";
import Student from "../models/Student.js";
import { validateStudent } from "../middleware/validateStudent.js";

const router = express.Router();

/* =========================
   ✅ GET all students (pagination + global stats)
========================= */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    // Fetch total students
    const totalStudents = await Student.countDocuments();

    // Fetch paginated students
    const students = await Student.find().skip(skip).limit(limit);

    // ✅ Compute global stats for all students
    const allStudents = await Student.find({}, "course age");
    const totalCourses = new Set(allStudents.map((s) => s.course)).size;
    const averageAge =
      allStudents.length > 0
        ? allStudents.reduce((sum, s) => sum + s.age, 0) / allStudents.length
        : 0;

    // ✅ Collect all courses for dropdown
    const allCourses = [...new Set(allStudents.map((s) => s.course))];

    res.json({
      success: true,
      students,
      pagination: {
        totalStudents,
        page,
        totalPages: Math.ceil(totalStudents / limit),
        limit,
      },
      stats: {
        totalCourses,
        averageAge,
        allCourses,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
   ✅ GET student by ID
========================= */
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
   ✅ POST add new student
========================= */
router.post("/", validateStudent, async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, message: "Student added", student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
   ✅ PUT update student
========================= */
router.put("/:id", validateStudent, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    res.json({ success: true, message: "Student updated", student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
   ✅ DELETE student
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    res.json({ success: true, message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
