import Enrollment from "../models/enrollmentModel";
import errorHandler from "./../helpers/dbErrorHandler";

const create = async (req, res) => {
  let newEnrollment = {
    course: req.course,
    student: req.auth,
  };

  newEnrollment.lessonState = req.course.lessons.map((lesson) => {
    return { lesson: lesson, complete: false };
  });

  const enrollment = new Enrollment(newEnrollment);

  try {
    let result = await enrollment.save();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const read = (req, res) => {
  return res.json(req.enrollment);
};

const findEnrollment = async (req, res, next) => {
  try {
    let enrollments = await Enrollment.find({
      course: req.course._id,
      student: req.auth._id,
    });
    if (enrollments.length == 0) {
      next();
    } else {
      res.json(enrollments[0]);
    }
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const findEnrollmentByID = async (req, res, next, id) => {
  try {
    let enrollment = await Enrollment.findById(id)
      .populate({
        path: "course",
        populate: {
          path: "tutor",
        },
      })
      .populate("student", "_id name");
    if (!enrollment)
      return res.status("400").json({
        error: "Enrollment not found",
      });
    req.enrollment = enrollment;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not fetch enrollment",
    });
  }
};

const isStudent = (req, res, next) => {
  const isStudent = req.auth && req.auth._id == req.enrollment.student._id;
  if (!isStudent) {
    return res.status("403").json({
      error: "User is not enrolled",
    });
  }
  next();
};

const complete = async (req, res) => {
  let updatedData = {};
  updatedData["lessonState.$.complete"] = req.body.complete;
  updatedData.updated = Date.now();
  if (req.body.courseCompleted)
    updatedData.completed = req.body.courseCompleted;
  try {
    let enrollment = await Enrollment.updateOne(
      { "lessonState._id": req.body.lessonStateId },
      { $set: updatedData }
    );
    res.json(enrollment);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const getAllEnrolled = async (req, res) => {
  try {
    let enrollments = await Enrollment.find({ student: req.auth._id })
      .sort({ completed: 1 })
      .populate("course", "_id name category");
    res.json(enrollments);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const enrollmentState = async (req, res) => {
  try {
    let stats = {};
    stats.totalEnrolled = await Enrollment.find({
      course: req.course._id,
    }).countDocuments();
    stats.totalCompleted = await Enrollment.find({ course: req.course._id })
      .exists("completed", true)
      .countDocuments();
    res.json(stats);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
  read,
  findEnrollment,
  findEnrollmentByID,
  isStudent,
  complete,
  getAllEnrolled,
  enrollmentState,
};
