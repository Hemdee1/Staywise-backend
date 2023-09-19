import express from "express";
import * as userController from "../controllers/userControllers";
import { requestAuth } from "../mildlewares/auth";

const router = express.Router();

router.get("/", requestAuth, userController.getAuthenticatedUser);

router.get("/send", userController.sendData);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/updateUser", userController.updateUserProfile);
router.post("/logout", userController.logOutUser);

export default router;
