import express from "express";
import enrollmentC from "../controllers/enrollmentController";
import courseC from "../controllers/courseController";
import authC from "../controllers/authController";

const router = express.Router();

router
  .route("/api/enrollment/new/:courseId")
  .get(authC.requireSignin, enrollmentC.findEnrollment, enrollmentC.create);

router
  .route("/api/enrollment/:enrollmentId")
  .get(authC.requireSignin, enrollmentC.isStudent, enrollmentC.read);

router
  .route("/api/enrollment/enrolled")
  .get(authC.requireSignin, enrollmentC.getAllEnrolled);

router
  .route("/api/enrollment/complete/:enrollmentId")
  .put(authC.requireSignin, enrollmentC.isStudent, enrollmentC.complete);

router
  .route("/api/enrollment/stats/:courseId")
  .get(enrollmentC.enrollmentState);

router.param("courseId", courseC.findCourseByID);
router.param("enrollmentId", enrollmentC.findEnrollmentByID);

export default router;
