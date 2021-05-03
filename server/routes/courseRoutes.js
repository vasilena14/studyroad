import express from "express";
import courseCtrl from "../controllers/courseController";
import userCtrl from "../controllers/userController";
import authCtrl from "../controllers/authController";

const router = express.Router();

router
  .route("/api/courses/by/:userId")
  .post(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.isEducator,
    courseCtrl.create
  )
  .get(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    courseCtrl.listByInstructor
  );

router
  .route("/api/courses/:courseId/lesson/new")
  .put(authCtrl.requireSignin, courseCtrl.isInstructor, courseCtrl.newLesson);

router.route("/api/courses/:courseId").get(courseCtrl.read);

router.param("courseId", courseCtrl.courseByID);
router.param("userId", userCtrl.userByID);

export default router;
