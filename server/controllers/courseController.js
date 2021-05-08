import Course from "../models/courseModel";
import extend from "lodash/extend";
import formidable from "formidable";
import fs from "fs";
import errorHandler from "./../helpers/dbErrorHandler";
import defaultImage from "./../../client/assets/images/defaultCourseImage.png";

const create = (req, res) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    let course = new Course(fields);

    course.tutor = req.profile;

    if (files.image) {
      course.image.data = fs.readFileSync(files.image.path);
      course.image.contentType = files.image.type;
    }
    try {
      let result = await course.save();
      res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const read = (req, res) => {
  req.course.image = undefined;
  return res.json(req.course);
};

const findCourseByID = async (req, res, next, id) => {
  try {
    let course = await Course.findById(id).populate("tutor", "_id name");
    if (!course)
      return res.status("400").json({
        error: "Course not found",
      });
    req.course = course;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not fetch course",
    });
  }
};

const newLesson = async (req, res) => {
  try {
    let lesson = req.body.lesson;
    let result = await Course.findByIdAndUpdate(
      req.course._id,
      { $push: { lessons: lesson }, updated: Date.now() },
      { new: true }
    )
      .populate("tutor", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const update = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Cover photo could not be uploaded",
      });
    }
    let course = req.course;
    course = extend(course, fields);
    if (fields.lessons) {
      course.lessons = JSON.parse(fields.lessons);
    }
    course.updated = Date.now();
    if (files.image) {
      course.image.data = fs.readFileSync(files.image.path);
      course.image.contentType = files.image.type;
    }
    try {
      await course.save();
      res.json(course);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const remove = async (req, res) => {
  try {
    let course = req.course;
    let deleteCourse = await course.remove();
    res.json(deleteCourse);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const isTutor = (req, res, next) => {
  const isTutor =
    req.course && req.auth && req.course.tutor._id == req.auth._id;
  if (!isTutor) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

const getAllByTutor = (req, res) => {
  Course.find({ tutor: req.profile._id }, (err, courses) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    res.json(courses);
  }).populate("tutor", "_id name");
};

const getAllPublishedCourses = (req, res) => {
  Course.find({ published: true }, (err, courses) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    res.json(courses);
  }).populate("tutor", "_id name");
};

const cover = (req, res, next) => {
  if (req.course.image.data) {
    res.set("Content-Type", req.course.image.contentType);
    return res.send(req.course.image.data);
  }
  next();
};

const defaultCover = (req, res) => {
  return res.sendFile(process.cwd() + defaultImage);
};

export default {
  create,
  read,
  update,
  remove,
  getAllByTutor,
  findCourseByID,
  isTutor,
  newLesson,
  getAllPublishedCourses,
  cover,
  defaultCover,
};
