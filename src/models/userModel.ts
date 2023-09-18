import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number },
    PaymentInfo: {},
    userPrefrences: {},
  },
  { timestamps: true }
);

type user = InferSchemaType<typeof userSchema>;

export default model<user>("user", userSchema);
