import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  resource_url: String,
});

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Въведете заглавие",
    // required: "Name is required",
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  category: {
    type: String,
    trim: true,
    required: "Изберете категория",
    // required: "Category is required",
  },
  published: {
    type: Boolean,
    default: false,
  },
  tutor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
  lessons: [LessonSchema],
});

export default mongoose.model("Course", CourseSchema);
