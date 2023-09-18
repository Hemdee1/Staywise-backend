import express from "express";
import { getOtp, verifyOtp } from "./controller";

const router = express.Router();

router.post("/otp", getOtp);
router.post("/verify", verifyOtp);

export default router;
