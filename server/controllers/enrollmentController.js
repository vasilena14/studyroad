import Enrollment from "../models/enrollmentModel";
import errorHandler from "./../helpers/dbErrorHandler";

const create = async (req, res) => {
  let newEnrollment = {
    course: req.course,
    student: req.auth,
  };
  newEnrollment.lessonStatus = req.course.lessons.map((lesson) => {
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

export default {
  create,
  findEnrollment,
};
