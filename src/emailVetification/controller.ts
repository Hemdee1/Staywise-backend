import { RequestHandler } from "express";
import createHttpError from "http-errors";
import userModel from "../models/userModel";
import { sendOtp } from "../utils/sendOtp";
import otpModel from "../otpSystem/model";
import { verifyHashedData } from "../utils/dataHashing";
import { addAbortSignal } from "nodemailer/lib/xoauth2";

export const sendVerificationOtpEmail: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(500).json("an email is required");
      createHttpError(500, "an email is required");
    }

    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      res.status(500).json("there is no account for the provided email");
      createHttpError(500, "there is no account for the provided email");
    }

    const otpDetails = {
      email,
      subject: "Email verification",
      message: "verify your email with the code below",
      duration: 1,
    };

    const createdEmailVerificationOtp = await sendOtp(otpDetails);

    res.status(201).json(createdEmailVerificationOtp);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail: RequestHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email && otp) {
      res.status(500).json("Empty otp details are not allowed");
      createHttpError(500, "Empty otp details are not allowed");
    }

    const matchedOtpRecord = await otpModel.findOne({ email });

    if (!matchedOtpRecord) {
      res.status(500).json("no otp record found");
      createHttpError(500, "no otp record found");
    }

    const expiresAt = matchedOtpRecord?.expiresAt;

    if (expiresAt && new Date(expiresAt) < new Date(Date.now())) {
      await otpModel.deleteOne({ email });
      res.status(500).json("code has expired, request a new one");
      createHttpError(500, "code has expired, request a new one");
    }

    const hashedOtp = matchedOtpRecord?.otp ?? "";
    const validOtp = await verifyHashedData(otp, hashedOtp);

    if (!validOtp) {
      res.status(500).json("invalid code passed, check your inbox");
      createHttpError(500, "invalid code passed, check your inbox");
    }

    await userModel.updateOne({ email }, { emailVerified: true });

    await otpModel.deleteOne({ email });
    res.status(200).json({ email, verified: true });
  } catch (error) {
    next(error);
  }
};
