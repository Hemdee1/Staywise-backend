import { reqBody } from "../otpSystem/controller";
import CreateHttpError from "http-errors";
import otpModel from "../otpSystem/model";
import { sendEmail } from "./sendEmail";
import { hashData } from "./dataHashing";

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

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: subject,
      html: `<p>${message}</p><p style="color:tomato; font-size:25px; letter-spacing:2px;><b>${otp}</b></p><p>This code <b>expires in ${duration} hour(s)</b>.</p>"`,
    };

    await sendEmail(mailOptions);

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
