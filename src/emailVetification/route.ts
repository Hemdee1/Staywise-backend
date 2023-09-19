import express from "express";
import { sendVerificationOtpEmail, verifyEmail } from "./controller";

const router = express.Router();

router.post("/verifyEmail", verifyEmail);

router.post("/sendVerification", sendVerificationOtpEmail);

export default router;
