import { InferSchemaType, Schema, model } from "mongoose";

const locationSchema = new Schema(
  {
    latitude: {},
    longitude: {},
    address: {},
    city: {},
    state: {},
    zipCode: {},
    country: {},
  },
  { timestamps: true }
);

type location = InferSchemaType<typeof locationSchema>;

export default model<location>("location", locationSchema);
