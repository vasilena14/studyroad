import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.ObjectId, ref: "Course" },
  student: { type: mongoose.Schema.ObjectId, ref: "User" },
  enrolled: {
    type: Date,
    default: Date.now,
  },
  lessonStatus: [
    {
      lesson: { type: mongoose.Schema.ObjectId, ref: "Lesson" },
      complete: Boolean,
    },
  ],
  updated: Date,
  completed: Date,
});

export default mongoose.model("Enrollment", EnrollmentSchema);
