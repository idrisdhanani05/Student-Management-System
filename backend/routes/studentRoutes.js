const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// 1. Add Student
router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();

    res.status(201).json({
      message: "Student added successfully",
      student: savedStudent,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to add student",
      error: error.message,
    });
  }
});

// 2. View All Students + Search + Branch Filter
router.get("/", async (req, res) => {
  try {
    const { search, branch } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { studentId: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (branch && branch !== "All") {
      filter.branch = branch;
    }

    const students = await Student.find(filter).sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students",
      error: error.message,
    });
  }
});

// 3. Display Total Number of Students
router.get("/stats/total", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();

    res.json({
      totalStudents,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get student count",
      error: error.message,
    });
  }
});
router.get("/bulk-test", (req, res) => {
  res.json({
    message: "Bulk route is working!"
  });
});

// 4. View Single Student
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch student",
      error: error.message,
    });
  }
});

// 5. Update Student
router.put("/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update student",
      error: error.message,
    });
  }
});

// 6. Delete Student
router.delete("/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete student",
      error: error.message,
    });
  }
});


// 7. Add Multiple Students at Once
router.post("/bulk", async (req, res) => {
  try {
    const students = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        message: "Please provide an array of students",
      });
    }

    const savedStudents = await Student.insertMany(students);

    res.status(201).json({
      message: `${savedStudents.length} students added successfully`,
      students: savedStudents,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to add students",
      error: error.message,
    });
  }
});

module.exports = router;