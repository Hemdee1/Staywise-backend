import { InferSchemaType, model, Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: String,
  },
  { timestamps: true }
);

type NoteType = InferSchemaType<typeof noteSchema>;

const NoteModel = model<NoteType>("Note", noteSchema);

export default NoteModel;
