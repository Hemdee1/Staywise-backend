import { InferSchemaType, Schema, model } from "mongoose";

const chatAndMessagingModel = new Schema(
  {
    senderId: {},
    recieverId: {},
    messageContent: {},
  },
  { timestamps: true }
);

type chat = InferSchemaType<typeof chatAndMessagingModel>;

export default model<chat>("chat", chatAndMessagingModel);
