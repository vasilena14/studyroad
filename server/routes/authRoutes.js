import express from "express";
import authC from "../controllers/authController";

const router = express.Router();

router.route("/auth/signin").post(authC.signin);
router.route("/auth/signout").get(authC.signout);

export default router;
