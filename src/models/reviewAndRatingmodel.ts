import { InferSchemaType, Schema, model } from "mongoose";

const reviewAndRatingSchema = new Schema(
  {
    userId: {},
    reviewPropertyId: {},
    rating: { type: Number, required: true },
    reviewText: { type: String, required: true },
  },
  { timestamps: true }
);

type review = InferSchemaType<typeof reviewAndRatingSchema>;

export default model<review>("review", reviewAndRatingSchema);
