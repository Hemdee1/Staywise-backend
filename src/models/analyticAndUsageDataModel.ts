import { InferSchemaType, Schema, model } from "mongoose";

const analyticAndUsageSchema = new Schema(
  {
    userId: {},
    interactionType: {},
    parameter: {},
  },
  { timestamps: true }
);

type analytic = InferSchemaType<typeof analyticAndUsageSchema>;

export default model<analytic>("analytic", analyticAndUsageSchema);
