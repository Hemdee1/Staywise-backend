import { InferSchemaType, Schema, model } from "mongoose";

const apartmentListingSchema = new Schema(
  {
    title: { type: String },
    description: { type: Object },
    location: {
      address: { type: String },
      city: { type: String },
      country: { type: String },
    },
    price: { type: Number, required: true },
    images: { type: Object, required: true },
    hostId: { type: Schema.Types.ObjectId, required: true },
    rating: { type: Number },
    numReviews: { type: Number },
  },
  { timestamps: true }
);

type apartment = InferSchemaType<typeof apartmentListingSchema>;

export default model<apartment>("apartment", apartmentListingSchema);
