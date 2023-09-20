import { reqBody } from "../otpSystem/controller";
import CreateHttpError from "http-errors";
import otpModel from "../otpSystem/model";
import sendEmail from "./sendEmail";
import { hashData } from "./dataHashing";
import otpHtml from "./otpHtml";

export const sendOtp = async ({
  email,
  message,
  duration = 1,
  subject,
}: reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (!(email && message && subject)) {
      CreateHttpError(500, "provide values for email, subject, message");
    }

    await otpModel.deleteOne({ email });

    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const html = otpHtml(message, duration, otp);

    await sendEmail(html, email);

    const hashedOtp = await hashData(otp);

    const newOtp = await otpModel.create({
      email,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 * +duration,
    });

    return newOtp;
  } catch (error) {
    throw error;
  }
};
