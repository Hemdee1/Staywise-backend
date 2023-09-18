import { InferSchemaType, Schema, model } from "mongoose";

const apartmentListingSchema = new Schema(
  {
    title: {},
    description: {},
    location: {
      address: {},
      city: {},
      state: {},
      zipCode: {},
    },
    pricing: {},
    images: {},
    hostId: {},
  },
  { timestamps: true }
);

type apartment = InferSchemaType<typeof apartmentListingSchema>;

export default model<apartment>("apartment", apartmentListingSchema);
