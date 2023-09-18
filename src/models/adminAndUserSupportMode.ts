import { InferSchemaType, Schema, model } from "mongoose";

const adminAndSupportSchema = new Schema(
  {
    userName: {},
    password: {},
    supportTicket: {},
    userManagementCapabilities: {},
  },
  { timestamps: true }
);

type admin = InferSchemaType<typeof adminAndSupportSchema>;

export default model<admin>("admin", adminAndSupportSchema);
