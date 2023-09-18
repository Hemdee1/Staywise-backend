import { InferSchemaType, Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    senderId: {},
    recieverId: {},
    notificationContent: {},
  },
  { timestamps: true }
);

type notification = InferSchemaType<typeof notificationSchema>;

export default model<notification>("notification", notificationSchema);
