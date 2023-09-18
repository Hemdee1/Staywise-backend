import { InferSchemaType, Schema, model } from "mongoose";

const apartmentListingSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: Number, required: true },
    },
    pricing: { type: Number, required: true },
    images: { type: String, required: true },
    hostId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

type apartment = InferSchemaType<typeof apartmentListingSchema>;

export default model<apartment>("apartment", apartmentListingSchema);
