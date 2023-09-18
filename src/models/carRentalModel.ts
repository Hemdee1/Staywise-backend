import { InferSchemaType, Schema, model } from "mongoose";

const carRentalSchema = new Schema(
  {
    carType: {},
    description: {},
    pricing: {},
    availablityDate: {},
    images: {},
    providerId: {},
  },
  { timestamps: true }
);

type car = InferSchemaType<typeof carRentalSchema>;

export default model<car>("car", carRentalSchema);
