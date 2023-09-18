import express from "express";
import { sendVerificationOtpEmail } from "./controller";

const router = express.Router();

router.post("/verifyEmail");

router.post("/sendVerification", sendVerificationOtpEmail);

export default router;
