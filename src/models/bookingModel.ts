import { InferSchemaType, Schema, model } from "mongoose";

const bookingSchema = new Schema(
  {
    userId: {},
    propertyId: {},
    bookingDate: {},
    paymentInfo: {},
    status: {},
  },
  { timestamps: true }
);

type booking = InferSchemaType<typeof bookingSchema>;

export default model<booking>("booking", bookingSchema);
