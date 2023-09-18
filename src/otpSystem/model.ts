import { InferSchemaType, Schema, model } from "mongoose";

const otpSchema = new Schema({
  email: { type: String, unique: true, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
});

type otp = InferSchemaType<typeof otpSchema>;

export default model<otp>("otp", otpSchema);
