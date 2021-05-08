import express from "express";
import userC from "../controllers/userController";
import authC from "../controllers/authController";

const router = express.Router();

router.route("/api/users").get(userC.getAll).post(userC.create);

router
  .route("/api/users/:userId")
  .get(authC.requireSignin, userC.read)
  .put(authC.requireSignin, authC.isAuthorized, userC.update)
  .delete(authC.requireSignin, authC.isAuthorized, userC.remove);

router.param("userId", userC.userByID);

export default router;
