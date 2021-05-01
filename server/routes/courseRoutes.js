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
  );

export default router;
