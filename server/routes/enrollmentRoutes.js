import express from "express";
import enrollmentCtrl from "../controllers/enrollmentController";
import courseCtrl from "../controllers/courseController";
import authCtrl from "../controllers/authController";

const router = express.Router();

router
  .route("/api/enrollment/new/:courseId")
  .get(
    authCtrl.requireSignin,
    enrollmentCtrl.findEnrollment,
    enrollmentCtrl.create
  );

router.param("courseId", courseCtrl.courseByID);

router
  .route("/api/enrollment/:enrollmentId")
  .get(authCtrl.requireSignin, enrollmentCtrl.isStudent, enrollmentCtrl.read);

router.param("enrollmentId", enrollmentCtrl.enrollmentByID);

export default router;
