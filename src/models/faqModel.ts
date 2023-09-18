import { InferSchemaType, Schema, model } from "mongoose";

const faqSchema = new Schema(
  {
    faqQuestion: {},
    faqAnswer: {},
    category: {},
  },
  { timestamps: true }
);

type faq = InferSchemaType<typeof faqSchema>;

export default model<faq>("faq", faqSchema);
