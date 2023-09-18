import { RequestHandler } from "express";
import { sendOtp } from "../utils/sendOtp";
import createHttpError from "http-errors";
import otpModel from "./model";
import { verifyHashedData } from "../utils/dataHashing";

export interface reqBody {
  email: string;
  subject: string;
  message: string;
  duration: number;
}
export const getOtp: RequestHandler<
  unknown,
  unknown,
  reqBody,
  unknown
> = async (req, res, next) => {
  try {
    const { duration, email, message, subject } = req.body;

    const createdOtp = await sendOtp({ email, duration, subject, message });

    res.status(200).json(createdOtp);
  } catch (error) {
    next(error);
  }
};

export interface verifyBody {
  email: string;
  otp: string;
}
export const verifyOtp: RequestHandler<
  unknown,
  unknown,
  verifyBody,
  unknown
> = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!(email && otp)) {
      res.status(500).json("provide value for email and otp");
      createHttpError(500, "provide value for email and otp ");
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

    res.status(201).json({ valid: validOtp });
  } catch (error) {
    next(error);
  }
};
