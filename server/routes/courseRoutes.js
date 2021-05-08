import express from "express";
import courseC from "../controllers/courseController";
import userC from "../controllers/userController";
import authC from "../controllers/authController";

const router = express.Router();

router
  .route("/api/courses/by/:userId")
  .post(authC.requireSignin, authC.isAuthorized, userC.isTutor, courseC.create)
  .get(authC.requireSignin, authC.isAuthorized, courseC.getAllByTutor);

router
  .route("/api/courses/cover/:courseId")
  .get(courseC.cover, courseC.defaultCover);

router.route("/api/courses/defaultcover").get(courseC.defaultCover);

router
  .route("/api/courses/:courseId/lesson/new")
  .put(authC.requireSignin, courseC.isTutor, courseC.newLesson);

router
  .route("/api/courses/:courseId")
  .get(courseC.read)
  .put(authC.requireSignin, courseC.isTutor, courseC.update)
  .delete(authC.requireSignin, courseC.isTutor, courseC.remove);

router.route("/api/courses/published").get(courseC.getAllPublishedCourses);

router.param("courseId", courseC.findCourseByID);
router.param("userId", userC.userByID);

export default router;
