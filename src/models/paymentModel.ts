import { InferSchemaType, Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    transactionId: {},
    userId: {},
    amount: {},
    paymentMethod: {},
  },
  { timestamps: true }
);

type payment = InferSchemaType<typeof paymentSchema>;

export default model<payment>("payment", paymentSchema);
